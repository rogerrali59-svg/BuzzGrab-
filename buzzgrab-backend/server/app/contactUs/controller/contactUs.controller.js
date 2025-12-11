/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

const { setResponseObject } = require("../../../middleware/commonFunction");
const { CONST } = require("../../../helpers/constant");
const { CONTACTUS } = require("../model/contactUs.model");
const { validateAddContact } = require("../model/contactUs.model");
const mongoose = require("mongoose");
const { formatErrorResponse } = require("../../../helpers/schedulers");
const moment = require("moment");
const nodemailer = require("../../../helpers/nodemailer");
const xss = require("xss");

const contact = {
  /**
   * Add contact
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  add: async (req, res, next) => {
    try {
      const data = req.body;
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = xss(data[key]); // Apply XSS sanitization
        }
      }

      const { error } = await validateAddContact(req.body);
      if (error) {
        return res.status(400).send({
          statusCode: 400,
          message: formatErrorResponse(error.details[0].message),
        });
      }

      // Get the current date in "YYYY-MM-DD" format to check daily submissions
      const currentDate = moment().format("YYYY-MM-DD");

      // Count how many "Contact Us" submissions exist with the same email today
      const submissionsToday = await CONTACTUS.countDocuments({
        email: data?.email?.toLowerCase(),
        createdAt: {
          $gte: moment(currentDate).startOf("day").toDate(),
          $lt: moment(currentDate).endOf("day").toDate(),
        },
      });

      if (submissionsToday >= 3) {
        return res.status(400).send({
          statusCode: 400,
          message:
            "You have exceeded the maximum limit of submissions per day.",
        });
      }

      // Create the "Contact Us" record
      const saveContactUs = await CONTACTUS.create(data);

      if (saveContactUs) {
        await setResponseObject(
          req,
          true,
          "We have received your inquiry. We appreciate your interest in our services. Our team will get back to you soon.",
          saveContactUs
        );
        next();
      } else {
        await setResponseObject(req, false, "Something went wrong");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Get all contactus List
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  list: async (req, res, next) => {
    try {
      let search = req.query.search;
      let state = req.query.state;
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit =
        parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT
          ? CONST.MAX_PAGE_LIMIT
          : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      let filter = {};
      switch (state) {
        case "1": // ACTIVE
          filter = {
            stateId: CONST.NEW,
          };
          break;

        case "2": // INACTIVE
          filter = {
            stateId: CONST.REPLIED,
          };
          break;

        default:
      }
      let searchFilter = {};
      if (search && search !== "undefined") {
        searchFilter = {
          $or: [
            {
              fullName: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
            {
              email: {
                $regex: search
                  ? search
                  : "".replace(new RegExp("\\\\", "g"), "\\\\"),
                $options: "i",
              },
            },
          ],
        };
      }

      const list = await CONTACTUS.aggregate([
        {
          $match: searchFilter,
        },
        {
          $match: filter,
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
      if (list && list[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Contactus list found successfully",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Contactus list not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Get contactus details
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  view: async (req, res, next) => {
    try {
      const data = req.body;
      const contactusDetails = await CONTACTUS.findOne({
        _id: req.params.id,
      });
      if (contactusDetails) {
        await setResponseObject(
          req,
          true,
          "Contactus details found successfully",
          contactusDetails
        );
        next();
      } else {
        await setResponseObject(req, false, "Contactus details not found");
        next();
      }
    } catch (error) {
      console.log("error", error);
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Delete contactus api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  delete: async (req, res, next) => {
    try {
      var result = await CONTACTUS.findByIdAndDelete({ _id: req.params.id });
      if (result) {
        await setResponseObject(req, true, "Contact us deleted");
        next();
      } else {
        await setResponseObject(req, false, "Contact us not deleted");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  },

  /**
   * Rating reply api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * **/

  reply: async (req, res, next) => {
    try {
      const data = req.body;
      data.stateId = CONST.REPLIED;
      let updateRating = await CONTACTUS.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        data,
        { new: true }
      );

      if (!updateRating) {
        await setResponseObject(req, false, "Something Went Wrong");
        next();
      } else {
        const smtp = await nodemailer.smtpCredential();
        if (smtp.host && smtp.port && smtp.email && smtp.password) {
          await nodemailer.replyMeassage(
            updateRating.email,
            updateRating.reply
          );
        }
        next();

        await setResponseObject(
          req,
          true,
          "Reply Added Successfully",
          updateRating
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },
};

module.exports = contact;
