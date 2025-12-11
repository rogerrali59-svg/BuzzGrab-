/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { DATE_CHECK } = require("../../dateCheck/model/dateCheck.model");
const mongoose = require("mongoose");
const setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
const validation = require("../model/dateCheckValidation");
const { CONST } = require("../../../helpers/constant");

const dateCheck = {};

/*Add dateCheck*/
dateCheck.add = async (req, res, next) => {
  try {
    const { error } = validation.dateCheckValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errorMessages[0],
      });
    }

    const data = req.body;
    data.createdBy = req.userId;

    let existDate = await DATE_CHECK.findOne({
      $and: [
        {
          date: data.date,
        },
        { stateId: CONST.ACTIVE },
      ],
    });

    if (existDate) {
      await setResponseObject(
        req,
        false,
        `You have already added a date with ${data.date} delete previous date.`
      );
      next();
    } else {
      const activeDate = await DATE_CHECK.findOne({ stateId: CONST.ACTIVE });
      if (activeDate) {
        await DATE_CHECK.findByIdAndUpdate(
          { _id: activeDate._id },
          { stateId: CONST.INACTIVE },
          { new: true }
        );
      } else {
        data.stateId = CONST.ACTIVE;
      }
      const saveData = await DATE_CHECK.create(data);
      if (saveData) {
        await setResponseObject(
          req,
          true,
          "Date addedd successfully.",
          saveData
        );
        next();
      } else {
        await setResponseObject(
          req,
          false,
          "Oops! Something went wrong while addeding date. Please try again."
        );
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error, "");
    next();
  }
};

/*Get dateCheck list*/
dateCheck.list = async (req, res, next) => {
  try {
    const dateList = await DATE_CHECK.find().sort({ createdAt: -1 });

    if (dateList.length > 0) {
      await setResponseObject(
        req,
        true,
        "Date list found successfully",
        dateList
      );
      next();
    } else {
      await setResponseObject(req, true, "Date list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error, "");
    next();
  }
};

/*View dateCheck details*/
dateCheck.details = async (req, res, next) => {
  try {
    const dateDetails = await REPORT.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (dateDetails.length > 0) {
      await setResponseObject(
        req,
        true,
        "Date details found successfully",
        dateDetails[0]
      );
      next();
    } else {
      setResponseObject(req, true, "Error occur while geting date details");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error, "");
    next();
  }
};

/*Delete dateCheck*/
dateCheck.delete = async (req, res, next) => {
  try {
    const deleteDate = await DATE_CHECK.findByIdAndDelete({
      _id: req.params.id,
    });

    if (deleteDate) {
      let findActiveInfo = await DATE_CHECK.findOne({ stateId: CONST.ACTIVE });

      if (!findActiveInfo) {
        let findInactiveInfo = await DATE_CHECK.findOne({
          stateId: CONST.INACTIVE,
        });

        if (findInactiveInfo) {
          await DATE_CHECK.findByIdAndUpdate(
            findInactiveInfo._id,
            { stateId: CONST.ACTIVE },
            { new: true }
          );
        }
      }
      await setResponseObject(req, true, "Date has been deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Error occur while deleted date");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error, "");
    next();
  }
};

/*Get dateCheck list*/
dateCheck.activeDateCheck = async (req, res, next) => {
  try {
    const dateList = await DATE_CHECK.findOne({ stateId: CONST.ACTIVE });

    if (dateList) {
      await setResponseObject(req, true, "", dateList);
      next();
    } else {
      await setResponseObject(req, true, "", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error, "");
    next();
  }
};

module.exports = dateCheck;
