/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const { PAGE_MODEL } = require("../model/page.model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const {
  ALREADY_EXISTS,
  UPDATE_FAILED,
  FOUND_SUCCESS,
  NOT_FOUND,
  DELETE_SUCCESS,
} = require("../../../middleware/responseMessage");
const { default: mongoose } = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { validateAddCMS } = require("../model/page.model");
const { formatErrorResponse } = require("../../../helpers/schedulers");

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

module.exports = class cms_ {
  /*ADD CMS*/
  add = async (req, res, next) => {
    try {
      const isExists = await PAGE_MODEL.findOne({
        $or: [{ title: req.body.title }, { typeId: req.body.typeId }],
        stateId: { $ne: CONST.DELETED },
      });
      if (isExists) {
        await setResponseObject(req, false, "Cms Page already exist", "");
        next();
        return;
      }
      const data = req.body;
      const { error } = await validateAddCMS(req.body);
      if (error)

        return res.status(400).send({
          statusCode: 400,
          message: formatErrorResponse(error.details[0].message),
        });
      data.createdBy = req.userId;

      if (req.file) {
        data.image = req.file.id;
      }
      const result = await PAGE_MODEL.create(data);
      if (result) {
        await setResponseObject(
          req,
          true,
          "Cms Page addedd successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Cms Page not addedd", "");
        next();
      }
    } catch (error) {
      console.log("error", error)
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET ALL CMS*/
  list = async (req, res, next) => {
    try {
      let getList = await PAGE_MODEL.find({})
        .populate({
          path: "createdBy",
          select: "_id fullName",
        })
        .sort({ createdAt: -1 });
      if (getList) {
        await setResponseObject(req, true, FOUND_SUCCESS("Cms Pages"), getList);
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Cms Pages"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET SINGLE CMS*/
  detail = async (req, res, next) => {
    try {
      const getSingle = await PAGE_MODEL.findOne({ _id: req.params.id });
      if (getSingle) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Cms Page"),
          getSingle
        );
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Cms Page"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CMS*/
  update = async (req, res, next) => {
    try {
      const isExists = await PAGE_MODEL.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        $or: [{ title: req.body.title }, { typeId: req.body.typeId }],
        stateId: { $ne: CONST.DELETED },
      });

      if (isExists) {
        await setResponseObject(req, false, ALREADY_EXISTS("Cms Page"), "");
        next();
      }
      const data = req.body;
      const findCms = await PAGE_MODEL.findById({ _id: req.params.id });

      if (req.file) {
        data.image = req.file.id;
      }

      const updateData = await PAGE_MODEL.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (updateData) {
        await setResponseObject(
          req,
          true,
          "Cms Page updated successfully",
          updateData,
          ""
        );
        next();
      } else {
        await setResponseObject(req, false, "Cms Page not updated", "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CMS STATE*/
  updateState = async (req, res, next) => {
    try {
      let payload = req.query;
      const findData = await PAGE_MODEL.findById(req.params.id);
      if (!findData) {
        await setResponseObject(req, true, NOT_FOUND("Cms Page"), "");
        next();
      } else {
        if (payload.stateId == CONST.ACTIVE) {
          let updateState = await PAGE_MODEL.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Cms Page active successfully",
              updateState
            );
            next();
          }
          return;
        }
        if (payload.stateId == CONST.INACTIVE) {
          let updateState = await PAGE_MODEL.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Cms Page inactive successfully",
              updateState
            );
            next();
          }
          return;
        }
        if (payload.stateId == CONST.DELETED) {
          let updateState = await PAGE_MODEL.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Page deleted successfully",
              updateState
            );
            next();
          }
          return;
        }
      }
      await setResponseObject(req, true, "Invalid requested state!", "");
      next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET BY TYPE CMS WITH ACTIVE STATE USER END API*/
  getByType = async (req, res, next) => {
    try {
      const typeIdRegex = /^\d+$/

      if (!typeIdRegex.test(req.params.typeId)) {
        res.status(400).send({ message: 'It must be a valid input' })
      }

      const getSingle = await PAGE_MODEL.findOne({
        typeId: req.params.typeId,
        stateId: CONST.ACTIVE,
      }).exec();
      if (getSingle) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Cms Page"),
          getSingle
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Cms Page"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*DELETE CMS*/
  delete = async (req, res, next) => {
    try {
      const deleteData = await PAGE_MODEL.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deleteData) {
        await setResponseObject(req, true, DELETE_SUCCESS("Cms Page"), "");
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Cms Page"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
