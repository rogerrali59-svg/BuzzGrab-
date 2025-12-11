/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const { CATEGORY_MODEL } = require("../model/cetegory.model");
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
const { validateAddCategory } = require("../model/cetegory.model");
const { formatErrorResponse } = require("../../../helpers/schedulers");

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

module.exports = class category_ {
  /*ADD CATEGORY*/
  add = async (req, res, next) => {
    try {
      const isExists = await CATEGORY_MODEL.findOne({
        title: req.body.title,
        stateId: { $ne: CONST.DELETED },
      });
      if (isExists) {
        await setResponseObject(req, false, "Category already exist", "");
        next();
        return;
      }
      const data = req.body;
      const { error } = await validateAddCategory(req.body);
      if (error)
        return res.status(400).send({
          statusCode: 400,
          message: formatErrorResponse(error.details[0].message),
        });
      data.createdBy = req.userId;

      if (req.file) {
        data.image = process.env.IMAGE_BASE_URL + req.file.id;
      }
      const result = await CATEGORY_MODEL.create(data);
      if (result) {
        await setResponseObject(
          req,
          true,
          "Category addedd successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Category not addedd", "");
        next();
      }
    } catch (error) {
      console.log("error", error);
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET ALL CATEGORY*/
  list = async (req, res, next) => {
    try {
      let filter = {};
      switch (req.query.state) {
        case "1":
          filter = {
            stateId: CONST.ACTIVE,
          };
          break;

        case "2":
          filter = {
            stateId: CONST.INACTIVE,
          };
          break;

        case "3":
          filter = {
            stateId: CONST.DELETED, // 3 => DELETED
          };
          break;

        default:
          filter = {};
      }

      if (req.query.search) {
        const escapedSearchTerm = req.query.search.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        filter.title = { $regex: escapedSearchTerm, $options: "i" };
      }
      let getList = await CATEGORY_MODEL.find(filter)
        .populate({
          path: "createdBy",
          select: "_id firstName lastName email",
        })
        .sort({ createdAt: -1 });
      if (getList) {
        await setResponseObject(req, true, FOUND_SUCCESS("Categorys"), getList);
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Categorys"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET SINGLE CATEGORY*/
  detail = async (req, res, next) => {
    try {
      const getSingle = await CATEGORY_MODEL.findOne({ _id: req.params.id });
      if (getSingle) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Category"),
          getSingle
        );
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Category"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE CATEGORY*/
  update = async (req, res, next) => {
    try {
      // Check if another subCategory with the same title exists (excluding current ID)
      const isExists = await CATEGORY_MODEL.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        title: req.body.title,
        stateId: { $ne: CONST.DELETED },
      });

      if (isExists) {
        await setResponseObject(req, false, ALREADY_EXISTS("category"), "");
        return next();
      }

      const data = req.body;

      // Find existing subCategory
      const findCms = await CATEGORY_MODEL.findById(req.params.id);

      // If image is provided in the request
      if (req.file) {
        data.image = process.env.IMAGE_BASE_URL + req.file.id;
      }

      // Update subCategory
      const updateData = await CATEGORY_MODEL.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
      );

      if (updateData) {
        await setResponseObject(
          req,
          true,
          "category updated successfully",
          updateData,
          ""
        );
      } else {
        await setResponseObject(req, false, "category not updated", "");
      }

      return next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      return next();
    }
  };

  /*UPDATE CATEGORY STATE*/
  updateState = async (req, res, next) => {
    try {
      let payload = req.query;
      const findData = await CATEGORY_MODEL.findById(req.params.id);
      if (!findData) {
        await setResponseObject(req, true, NOT_FOUND("Category"), "");
        next();
      } else {
        if (payload.stateId == CONST.ACTIVE) {
          let updateState = await CATEGORY_MODEL.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Category active successfully",
              updateState
            );
            next();
          }
          return;
        }
        if (payload.stateId == CONST.INACTIVE) {
          let updateState = await CATEGORY_MODEL.findOneAndUpdate(
            { _id: req.params.id },
            payload,
            { new: true }
          );
          if (updateState) {
            await setResponseObject(
              req,
              true,
              "Category inactive successfully",
              updateState
            );
            next();
          }
          return;
        }
        if (payload.stateId == CONST.DELETED) {
          let updateState = await CATEGORY_MODEL.findOneAndUpdate(
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

  /*DELETE CATEGORY*/
  delete = async (req, res, next) => {
    try {
      const deleteData = await CATEGORY_MODEL.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deleteData) {
        await setResponseObject(req, true, DELETE_SUCCESS("Category"), "");
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Category"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*ACTIVE CATGORY LIST*/
  activeList = async (req, res, next) => {
    try {
      let searchFilter = {};
      if (req.query.search && req.query.search !== "undefined") {
        searchFilter = {
          title: {
            $regex: req.query.search.trim()
              ? req.query.search.trim()
              : "".replace(new RegExp("\\\\", "g"), "\\\\").trim(),
            $options: "i",
          },
        };
      }
      let list = await CATEGORY_MODEL.aggregate([
        {
          $match: { stateId: CONST.ACTIVE },
        },
        {
          $match: searchFilter,
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            image: 1,
          },
        },
      ]);

      if (list.length > 0) {
        // list = list.map((category) => {
        //   if (category.image) {
        //     category.image = process.env.IMAGE_BASE_URL + category.image;
        //   }
        //   return category;
        // });
        await setResponseObject(req, true, "Category list found", list);
        next();
      } else {
        await setResponseObject(req, true, "Category list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
