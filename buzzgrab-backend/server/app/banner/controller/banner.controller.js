/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
let multer = require("multer");
const dir = "./uploads/banner";
let fs = require("fs");
const { setResponseObject } = require("../../../middleware/commonFunction");
const { BANNER } = require("../model/banner.Model");
const { CONST } = require("../../../helpers/constant");
const { default: mongoose } = require("mongoose");
const {
  NOT_FOUND,
  FOUND_SUCCESS,
} = require("../../../middleware/responseMessage");
const {
  validateAddBanner,
  validateEditBanner,
} = require("../model/banner.Model");
const { formatErrorResponse } = require("../../../helpers/schedulers");

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

let _item = {};

_item.addBanner = async (req, res, next) => {
  try {
    const data = req.body;

    if (req.file) {
      data.bannerImg = req.file.id;
    }

    const { error } = await validateAddBanner(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });

    data.createdBy = req.userId;

    const result = await BANNER.create(data);
    if (result) {
      await setResponseObject(req, true, "Banner add successfully", result);
      next();
    } else {
      await setResponseObject(req, false, "Banner not add successfully", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_item.updateBanner = async (req, res, next) => {
  try {
    const data = req.body;

    if (req.file) {
      data.bannerImg = req.file.id;
    }

    const { error } = await validateEditBanner(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });

    const updateData = await BANNER.findByIdAndUpdate(
      { _id: req.params.id },
      data,
      { new: true }
    );
    if (updateData) {
      await setResponseObject(
        req,
        true,
        "Banner update successfully",
        updateData,
        ""
      );
      next();
    } else {
      await setResponseObject(req, false, "Banner not update successfully", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_item.listBanners = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let pageLimit =
      parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT
        ? CONST.MAX_PAGE_LIMIT
        : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    // Initialize filterWithState as an empty object
    let filterWithState = {};

    switch (req.query.stateId) {
      case "1":
        filterWithState.stateId = 1;
        break;
      case "2":
        filterWithState.stateId = 2;
        break;

      default:
        filterWithState.stateId = { $ne: 3 };
        break;
    }

    let allItems = await BANNER.find(filterWithState)
      .sort({ createdAt: -1 })
      .limit(pageLimit)
      .skip(pageNo * pageLimit - pageLimit);

    let count = await BANNER.countDocuments(filterWithState);

    allItems = allItems.map((bannerImg) => {
      if (bannerImg.bannerImg) {
        bannerImg.bannerImg = process.env.IMAGE_BASE_URL + bannerImg.bannerImg;
      }
      return bannerImg;
    });

    if (allItems.length > 0) {
      await setResponseObject(
        req,
        true,
        FOUND_SUCCESS("Banner"),
        allItems,
        count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, NOT_FOUND("Banner"), []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

_item.getSingleBanner = async (req, res, next) => {
  try {
    let getSingleBannerDetail = await BANNER.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
    ]);

    if (getSingleBannerDetail[0]?.bannerImg) {
      getSingleBannerDetail[0].bannerImg =
        process.env.IMAGE_BASE_URL + getSingleBannerDetail[0]?.bannerImg;
    }

    if (getSingleBannerDetail && getSingleBannerDetail.length > 0) {
      await setResponseObject(
        req,
        true,
        FOUND_SUCCESS("Banner"),
        getSingleBannerDetail[0]
      );
      next();
    } else {
      await setResponseObject(req, true, NOT_FOUND("Banner"), []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, true, error.message, "");
    next();
  }
};

_item.updateBannerState = async (req, res, next) => {
  try {
    let payload = req.query;

    const findData = await BANNER.findById(req.params.id);
    if (!findData) {
      await setResponseObject(req, true, NOT_FOUND("Banner"), "");
      next();
    } else {
      if (payload.stateId == CONST.ACTIVE) {
        let updateState = await BANNER.findByIdAndUpdate(
          { _id: req.params.id },
          payload,
          { new: true }
        );
        if (updateState) {
          await setResponseObject(
            req,
            true,
            "Banner active successfully",
            updateState
          );
          next();
        }
        return;
      }
      if (payload.stateId == CONST.INACTIVE) {
        let updateState = await BANNER.findOneAndUpdate(
          { _id: req.params.id },
          payload,
          { new: true }
        );
        if (updateState) {
          await setResponseObject(
            req,
            true,
            "Banner inactive successfully",
            updateState
          );
          next();
        }
        return;
      }
      if (payload.stateId == CONST.DELETED) {
        let updateState = await BANNER.findOneAndUpdate(
          { _id: req.params.id },
          payload,
          { new: true }
        );
        if (updateState) {
          await setResponseObject(
            req,
            true,
            "Banner deleted successfully",
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

_item.deleteBanner = async (req, res, next) => {
  try {
    let bannerCheck = await BANNER.findOne({ _id: req.params.id });
    if (bannerCheck) {
      let update = await BANNER.findByIdAndUpdate(
        { _id: req.params.id },
        { stateId: 3 },
        { new: true }
      );
      if (update) {
        await setResponseObject(req, true, "Banner deleted successfully");
        next();
      } else {
        await setResponseObject(
          req,
          false,
          "Something went wrong please try again"
        );
        next();
      }
    } else {
      await setResponseObject(req, false, "Banner not exit");
      next();
    }
  } catch (err) {
    console.log("err-------", err);
    await setResponseObject(req, false, err.message);
    next();
  }
};

_item.activeBanners = async (req, res, next) => {
  try {
    let allItems = await BANNER.aggregate([
      {
        $match: { stateId: CONST.ACTIVE },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (allItems.length > 0) {
      allItems = allItems.map((bannerImg) => {
        if (bannerImg.bannerImg) {
          bannerImg.bannerImg =
            process.env.IMAGE_BASE_URL + bannerImg.bannerImg;
        }
        return bannerImg;
      });

      await setResponseObject(req, true, FOUND_SUCCESS("Banner"), allItems);
      next();
    } else {
      await setResponseObject(req, true, NOT_FOUND("Banner"), []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = _item;
