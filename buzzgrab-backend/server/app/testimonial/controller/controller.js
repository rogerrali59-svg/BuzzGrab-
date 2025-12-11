/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
const { default: mongoose } = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { TESTIMONIAL } = require("../model/model");

const logger = require("winston");
const multer = require("multer");
const fs = require("fs");
const dir = "./uploads/tetimonial";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().getTime().toString() +
      "-" +
      file.originalname.replace(/\s+/g, "")
    );
  },
});

const upload = multer({ storage: storage }).fields([{ name: "profileImg" }]);

module.exports = class _testimonial {
  /*Add testimonial api*/
  async add(req, res, next) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
        });
      }
      upload(req, res, async (err) => {
        if (err) {
          await setResponseObject(req, false, err);
          next();
        }

        const payloadData = req.body;

        if (req?.files?.profileImg) {
          data.profileImg = req.files?.profileImg?.[0].path.replace(/\s+/g, "");
        }

        payloadData.createdBy = req?.userId;
        const result = await new TESTIMONIAL(payloadData).save();

        if (result) {
          await setResponseObject(
            req,
            true,
            "Testimonial added successfully",
            result
          );
          next();
        } else {
          await setResponseObject(req, false, "Testimonial not added");
          next();
        }
      });
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  }

  /*Edit testimonial api */
  async edit(req, res, next) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
        });
      }

      upload(req, res, async (err) => {
        if (err) {
          await setResponseObject(req, false, err);
          next();
        }

        const payloadData = req.body;

        const exist = await TESTIMONIAL.findById({ _id: req.params.id });

        if (req.exist?.profileImg) {
          if (exist?.profileImg) {
            fs.stat(exist.profileImg, function (err, stat) {
              if (err == null) {
                fs.unlinkSync(exist.profileImg, async (err) => {
                  if (err) {
                    logger.warn(`error ${err}`);
                  } else {
                    logger.warn(`file was deleted`);
                  }
                });
              } else if (err.code == "ENOENT") {
                logger.warn(`file doesnot exists`);
                return;
              }
            });
          }
          data.profileImg = req.files?.profileImg?.[0].path.replace(/\s+/g, "");
        }
        const result = await TESTIMONIAL.findByIdAndUpdate(
          { _id: req.params.id },
          payloadData,
          { new: true }
        );
        if (result) {
          await setResponseObject(
            req,
            true,
            "Testimonial updated successfully",
            result
          );
          next();
        } else {
          await setResponseObject(req, false, "Testimonial not updated");
          next();
        }
      });
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  }

  /*GET all testimonial api*/
  async getList(req, res, next) {
    try {
      let pageLimit = parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT ? CONST.MAX_PAGE_LIMIT : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;;
      let pageNo = parseInt(req.query.pageNo) || 1;

      let filter = {};

      switch (req.query.stateId) {
        case "1": // ACTIVE
          filter = {
            stateId: CONST.ACTIVE,
          };
          break;
        case "2": // INACTIVE
          filter = {
            stateId: CONST.INACTIVE,
          };
        default:
          break;
      }

      let searchFilter = {};
      if (req.query.search && req.query.search !== "undefined") {
        searchFilter.$or = [
          {
            name: {
              $regex: req.query.search
                ? req.query.search
                : "".replace(new RegExp("\\\\", "g"), "\\\\"),
              $options: "i",
            },
          },
          {
            profession: {
              $regex: req.query.search
                ? req.query.search
                : "".replace(new RegExp("\\\\", "g"), "\\\\"),
              $options: "i",
            },
          },
        ];
      }
      const list = await TESTIMONIAL.aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $match: filter,
        },
        {
          $match: searchFilter,
        },
        {
          $facet: {
            data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
            count: [{ $count: "count" }],
          },
        },
      ]);

      if (list && list[0]?.data.length) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Testimonial"),
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Testimonial"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  }

  /*GET active testimonial*/
  async getActiveList(req, res, next) {
    try {
      let pageLimit = parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT ? CONST.MAX_PAGE_LIMIT : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;;
      let pageNo = parseInt(req.query.pageNo) || 1;

      const list = await TESTIMONIAL.aggregate([
        {
          $match: {
            stateId: CONST.ACTIVE,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $facet: {
            data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
            count: [{ $count: "count" }],
          },
        },
      ]);
      if (list && list[0]?.data.length) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Testimonial"),
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Testimonial"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  }

  /*View testimonial details*/
  async detail(req, res, next) {
    try {
      let findSingle = await TESTIMONIAL.findOne({ _id: req.params.id });
      if (findSingle) {
        await setResponseObject(
          req,
          true,
          FOUND_SUCCESS("Testimonial"),
          findSingle
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Testimonial"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  }

  /*Delete  testimonial api*/
  async delete(req, res, next) {
    try {
      let update = await TESTIMONIAL.findOneAndDelete({ _id: req.params.id });
      if (update) {
        await setResponseObject(
          req,
          true,
          "Testimonial deleted successfully",
          update
        );
        next();
      } else {
        await setResponseObject(req, false, "Testimonial not deleted", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  }

  /*START State-change faq*/
  async changeState(req, res, next) {
    try {
      let filter = {};
      let resp;

      switch (req.query.stateId) {
        case "1":
          filter = {
            stateId: 1, // 1 => ACTIVE
          };
          resp = "Testimonial active successfully";
          break;

        case "2":
          filter = {
            stateId: 2, // 2 => INACTIVE
          };
          resp = "Testimonial inactive successfully";
          break;
        default:
      }

      let updateState;

      updateState = await TESTIMONIAL.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        {
          $set: filter,
        },
        {
          new: true,
        }
      );

      if (updateState) {
        await setResponseObject(req, true, resp, updateState);
        next();
      } else {
        await setResponseObject(req, false, "Testimonial state not updated");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  }
};
