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
const { CONTACTUS } = require("../model/adminContactUs.model");
const mongoose = require("mongoose");
const { formatErrorResponse } = require("../../../helpers/schedulers");
const moment = require("moment");

const contact = {
  /**
   * Add contact
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  add :async (req, res, next) => {
    try {
      const data = req.body;
  
      // 1. Inactivate all previously active TWILIO records
      await CONTACTUS.updateMany(
        { stateId: CONST.ACTIVE },
        { $set: { stateId: CONST.INACTIVE } }
      );
  
      // 2. Add the new TWILIO with active state
      data.stateId = CONST.ACTIVE;
      const saveKey = await CONTACTUS.create(data);
  
      if (saveKey) {
        await setResponseObject(
          req,
          true,
          "Contact Info created successfully. Previous Contact Info are now inactive.",
          saveKey
        );
      } else {
        await setResponseObject(req, false, "Contact Info not created.", saveKey);
      }
  
      next();
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  },
  

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



  update: async (req, res, next) => {
    try {
      const data = req.body;

      const updateData = await CONTACTUS.findByIdAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );
      if (updateData) {

        await setResponseObject(
          req,
          true,
          "Admin contact us update successfully",
          updateData,
          ""
        );
        next();
      } else {
        await setResponseObject(
          req,
          false,
          "Admin contact us not update successfully",
          ""
        );
        next();
      }
    }
    catch (error) {
      await setResponseObject(req, false, error.message, "");
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
      let matchStage = {};

      if (search && search !== "undefined") {
        matchStage = {
          $or: [
            {
              fullName: {
                $regex: search.replace(/\\/g, "\\\\"),
                $options: "i",
              },
            },
            {
              email: {
                $regex: search.replace(/\\/g, "\\\\"),
                $options: "i",
              },
            },
            {
              address: {
                $regex: search.replace(/\\/g, "\\\\"),
                $options: "i",
              },
            },
          ],
        };
      }

      const result = await CONTACTUS.aggregate([
        
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
      ]);

      if (result && result.length) {
        await setResponseObject(
          req,
          true,
          "Contactus list found successfully",
          result// 👈 returning full array
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

  listContact: async (req, res, next) => {
    try {
      let search = req.query.search;
      let matchStage = {};

      if (search && search !== "undefined") {
        matchStage = {
          $or: [
            {
              fullName: {
                $regex: search.replace(/\\/g, "\\\\"),
                $options: "i",
              },
            },
            {
              email: {
                $regex: search.replace(/\\/g, "\\\\"),
                $options: "i",
              },
            },
            {
              address: {
                $regex: search.replace(/\\/g, "\\\\"),
                $options: "i",
              },
            },
          ],
        };
      }

      const result = await CONTACTUS.aggregate([
        {
          $match: {
            stateId: CONST.ACTIVE
          }
        },
        { $match: matchStage }
      ]);

      if (result && result.length) {
        await setResponseObject(
          req,
          true,
          "Contactus list found successfully",
          result[0]// 👈 returning full array
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
   * Delete contactus api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  delete: async (req, res, next) => {
    try {
      var result = await CONTACTUS.findByIdAndDelete({ _id: req.params.id });
      if (result) {
        let findActiveInfo = await CONTACTUS.findOne({ stateId: CONST.ACTIVE });

      if (!findActiveInfo) {
        let findInactiveInfo = await CONTACTUS.findOne({
          stateId: CONST.INACTIVE,
        });

        if (findInactiveInfo) {
          await CONTACTUS.findByIdAndUpdate(
            findInactiveInfo._id,
            { stateId: CONST.ACTIVE },
            { new: true }
          );
        }
      }
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



};

module.exports = contact;
