/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const { SEARCH_MODEL } = require("../model/search.model");
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
const { formatErrorResponse } = require("../../../helpers/schedulers");
const { createLogger } = require("winston");

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

module.exports = class search_ {
  /*ADD CMS*/
  add = async (req, res, next) => {
    try {

      const isExists = await SEARCH_MODEL.findOne({
        search: req.body.search,
        createdBy: req.userId
      });
      if (isExists) {
        await setResponseObject(req, false, "Search already exist", "");
        next();
        return;
      }
      const data = req.body;
      data.createdBy = req.userId;

      const result = await SEARCH_MODEL.create(data);
      if (result) {
        await setResponseObject(
          req,
          true,
          "Search addedd successfully",
          result
        );
        next();
      } else {
        await setResponseObject(req, false, "Search not addedd", "");
        next();
      }
    } catch (error) {
      console.log("error", error)
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET ALL SEARCH*/
  list = async (req, res, next) => {
    try {
      let getList = await SEARCH_MODEL.find({})
        .populate({
          path: "createdBy",
          select: "_id fullName",
        })
        .sort({ createdAt: -1 });
      if (getList) {
        await setResponseObject(req, true, FOUND_SUCCESS("Search"), getList);
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Search"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  /*GET SINGLE SEARCH*/
  detail = async (req, res, next) => {
    try {
      const getSingle = await SEARCH_MODEL.findOne({ _id: req.params.id });
      if (getSingle) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Search"),
          getSingle
        );
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Search"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  
  


  /*DELETE SEARCH*/
  delete = async (req, res, next) => {
    try {
      const deleteData = await SEARCH_MODEL.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deleteData) {
        await setResponseObject(req, true, DELETE_SUCCESS("Search"), "");
        next();
      } else {
        await setResponseObject(req, false, UPDATE_FAILED("Search"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };
};
