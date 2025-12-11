/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const { BRAND_MODEL, validateAddBrand } = require("../model/brand.model");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { CONST } = require("../../../helpers/constant");
const { formatErrorResponse } = require("../../../helpers/schedulers");
const mongoose = require("mongoose");

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

module.exports = class brand_ {
  /*ADD BRAND*/
  add = async (req, res, next) => {
    try {
      const isExists = await BRAND_MODEL.findOne({
        title: req.body.title,
        stateId: { $ne: CONST.DELETED },
      });
      if (isExists) {
        await setResponseObject(req, false, "Brand already exist", "");
        next();
        return;
      }

      const data = req.body;
      data.createdBy = req.userId;

      const { error } = await validateAddBrand(req.body);
      if (error)
        return res.status(400).send({
          statusCode: 400,
          message: formatErrorResponse(error.details[0].message),
        });

      if (req.file) {
        data.image = req.file.id;
      }

      const result = await BRAND_MODEL.create(data);
      if (result) {
        await setResponseObject(req, true, "Brand addedd successfully", result);
        next();
      } else {
        await setResponseObject(req, false, "Brand not addedd", "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET ALL BRAND*/
  list = async (req, res, next) => {
    try {
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit) || 10;

      let filter = {};
      switch (req.query.stateId) {
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

        default:
          filter = {};
      }
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

      let list = await BRAND_MODEL.aggregate([
        {
          $match: searchFilter,
        },
        {
          $match: filter,
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
            count: [{ $count: "count" }],
          },
        },
      ]);

      if (list && list[0].data.length) {
        list[0].data = list[0].data.map((category) => {
          if (category.image) {
            category.image = process.env.IMAGE_BASE_URL + category.image;
          }
          return category;
        });
        await setResponseObject(
          req,
          true,
          "Brand list found",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Brand not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET SINGLE BRAND*/
  detail = async (req, res, next) => {
    try {
      const getSingle = await BRAND_MODEL.findOne({ _id: req.params.id });

      if (getSingle?.image) {
        getSingle.image = process.env.IMAGE_BASE_URL + getSingle?.image;
      }

      if (getSingle) {
        await setResponseObject(
          req,
          true,
          "Brand details found successfully",
          getSingle
        );
        next();
      } else {
        await setResponseObject(req, false, "Brand details not found", "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*UPDATE BRAND*/
  update = async (req, res, next) => {
    try {
      // Check if another subCategory with the same title exists (excluding current ID)
      const isExists = await BRAND_MODEL.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        title: req.body.title,
        stateId: { $ne: CONST.DELETED },
      });

      if (isExists) {
        await setResponseObject(req, false, ALREADY_EXISTS("subCategory"), "");
        return next();
      }

      const data = req.body;

      // If image is provided in the request
      if (req.file) {
        data.image = process.env.IMAGE_BASE_URL + req.file.id;
      }

      // Update subCategory
      const updateData = await BRAND_MODEL.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
      );

      if (updateData) {
        await setResponseObject(
          req,
          true,
          "Brand updated successfully",
          updateData
        );
      } else {
        await setResponseObject(req, false, "Brand not updated", "");
      }

      return next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      return next();
    }
  };

  /*UPDATE BRAND STATE*/
  updateState = async (req, res, next) => {
    try {
      let payload = req.query;

      if (payload.stateId == CONST.ACTIVE) {
        let updateState = await BRAND_MODEL.findOneAndUpdate(
          { _id: req.params.id },
          payload,
          { new: true }
        );
        if (updateState) {
          await setResponseObject(
            req,
            true,
            "Brand active successfully",
            updateState
          );
          next();
        }
        return;
      }
      if (payload.stateId == CONST.INACTIVE) {
        let updateState = await BRAND_MODEL.findOneAndUpdate(
          { _id: req.params.id },
          payload,
          { new: true }
        );
        if (updateState) {
          await setResponseObject(
            req,
            true,
            "Brand inactive successfully",
            updateState
          );
          next();
        }
        return;
      }
      if (payload.stateId == CONST.DELETED) {
        let updateState = await SUB_CATEGORY_MODEL.findOneAndUpdate(
          { _id: req.params.id },
          payload,
          { new: true }
        );
        if (updateState) {
          await setResponseObject(
            req,
            true,
            "Brand deleted successfully",
            updateState
          );
          next();
        }
        return;
      }

      await setResponseObject(req, true, "Invalid requested state!", "");
      next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*DELETE BRAND*/
  delete = async (req, res, next) => {
    try {
      const deleteData = await BRAND_MODEL.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deleteData) {
        await setResponseObject(req, true, "Brand deleted successfully", "");
        next();
      } else {
        await setResponseObject(req, false, "Brand not deleted", "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*ACTIVE BRAND LIST*/
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
      let list = await BRAND_MODEL.aggregate([
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
          },
        },
      ]);

      if (list.length > 0) {
        list = list.map((category) => {
          if (category.image) {
            category.image = process.env.IMAGE_BASE_URL + category.image;
          }
          return category;
        });
        await setResponseObject(req, true, "Brand list found", list);
        next();
      } else {
        await setResponseObject(req, true, "Brand list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
