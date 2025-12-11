/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

const { default: mongoose } = require("mongoose");

const { setResponseObject } = require("../../../middleware/commonFunction");
const { Notification } = require("../model/notification.model");
const responseMessages = require("../../../middleware/responseMessage");
const { USER } = require("../../userService/model/userModel");
const { CONST } = require("../../../helpers/constant");

module.exports = class notification_ {
  /**
   * User notification list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getUserNotification(req, res, next) {
    try {
      let pageNo = parseInt(req.query.pageNo || req.body.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit || req.body.pageLimit) || 10;

      const myAllNotification = await Notification.aggregate([
        { $sort: { _id: -1 } },
        { $match: { stateId: CONST.NOTIFICATION_STATE.STATE_ID.ACTIVE } },
        { $match: { to: new mongoose.Types.ObjectId(req.userId) } },
        {
          $lookup: {
            from: "users",
            let: { id: "$from" },
            pipeline: [{ $match: { $expr: { $eq: ["$$id", "$_id"] } } }],
            as: "fromUserData",
          },
        },
        {
          $unwind: { path: "$fromUserData", preserveNullAndEmptyArrays: true },
        },

        {
          $lookup: {
            from: "products",
            let: {
              product: "$productId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$product", "$_id"],
                  },
                },
              },
            ],
            as: "productData",
          },
        },
        {
          $unwind: {
            path: "$productData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: true,
            title: true,
            description: true,
            stateId: true,
            createdAt: true,
            updatedAt: true,
            isSeen: true,
            fromUserData: { _id: true, fullName: true, email: true },
            productData: { _id: true, name: true, image: true },
            type: true,
          },
        },
        {
          $facet: {
            data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
            count: [{ $count: "count" }],
          },
        },
      ]);

      await Notification.updateMany(
        { to: req.userId },
        { $set: { isSeen: true } }
      );

      if (myAllNotification && myAllNotification[0].data.length) {
        await setResponseObject(
          req,
          true,
          "Notification found successfully",
          myAllNotification[0].data,
          myAllNotification[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "Notification not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * Admin notification list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAdminNotificationList(req, res, next) {
    try {
      let pageNo = parseInt(req.query.pageNo || req.body.pageNo) || 1;
      let pageLimit = parseInt(req.query.pageLimit || req.body.pageLimit) || 10;

      const myAllNotification = await Notification.aggregate([
        {
          $sort: { _id: -1 },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$from" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
              // {
              //   $project: {
              //     firstName: 1,
              //     lastName: 1,
              //     email: 1,
              //     mobile: 1,
              //     countryCode: 1
              //   }
              // }
            ],
            as: "sendFrom",
          },
        },
        {
          $unwind: {
            path: "$sendFrom",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$to" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
              // {
              //   $project: {
              //     firstName: 1,
              //     lastName: 1,
              //     email: 1,
              //     mobile: 1,
              //     countryCode: 1
              //   }
              // }
            ],
            as: "sendTo",
          },
        },
        {
          $unwind: {
            path: "$sendTo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $facet: {
            data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
            count: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);

      if (myAllNotification && myAllNotification[0].data.length) {
        await setResponseObject(
          req,
          true,
          responseMessages.FOUND_SUCCESS("Notification"),
          myAllNotification[0].data,
          myAllNotification[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(
          req,
          true,
          responseMessages.NOT_FOUND("Notification"),
          ""
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, error.stack);
      next();
    }
  }

  /**
   * Notification count
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async NotificationCount(req, res, next) {
    try {
      const myAllNotification = await Notification.countDocuments({
        to: req.userId,
        isSeen: false,
      });
      if (myAllNotification) {
        await setResponseObject(
          req,
          true,
          responseMessages.FOUND_SUCCESS("Notification Count"),
          myAllNotification
        );
        next();
      } else {
        await setResponseObject(
          req,
          true,
          responseMessages.NOT_FOUND("Notification"),
          ""
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, error.stack);
      next();
    }
  }

  /**
   * Notification details api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async noificationDetails(req, res, next) {
    try {
      const result = await Notification.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$from" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  mobile: 1,
                  countryCode: 1,
                },
              },
            ],
            as: "sendFrom",
          },
        },
        {
          $unwind: {
            path: "$sendFrom",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$to" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
              {
                $project: {
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  mobile: 1,
                  countryCode: 1,
                },
              },
            ],
            as: "sendTo",
          },
        },
        {
          $unwind: {
            path: "$sendTo",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      if (result && result.length > 0) {
        await Notification.updateOne(
          { _id: result[0]._id },
          { $set: { isSeen: true } }
        );
        await setResponseObject(
          req,
          true,
          responseMessages.FOUND_SUCCESS("Data"),
          result[0]
        );
        next();
      } else {
        await setResponseObject(
          req,
          false,
          responseMessages.NOT_FOUND("Data"),
          {}
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * Toggle notifcation api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async toggleNotification(req, res, next) {
    try {
      const userData = await USER.findOne(
        { _id: req.userId },
        "isNotificationOn"
      );

      console.log("=========", userData);

      if (userData) {
        let query = {};
        if (userData.isNotificationOn == CONST.NOTIFICATION_ON) {
          query = {
            isNotificationOn: CONST.NOTIFICATION_OFF,
          };
        } else {
          query = {
            isNotificationOn: CONST.NOTIFICATION_ON,
          };
        }
        const result = await USER.findOneAndUpdate(
          { _id: req.userId },
          { $set: query },
          { new: true }
        );
        if (result) {
          let message;
          if (result.isNotificationOn == CONST.NOTIFICATION_ON)
            message = "Notification on successfully";
          else message = "Notification off successfully";
          await setResponseObject(req, true, message, {
            isNotificationOn: result.isNotificationOn,
          });
          next();
        } else {
          await setResponseObject(req, false, "", {});
          next();
        }
      } else {
        await setResponseObject(req, false, "User not found", {});
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * Delete all notifcation api
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteAllNotification(req, res, next) {
    try {
      let deleteNotification = await Notification.deleteMany({
        to: req.userId,
      });

      if (deleteNotification) {
        return res.status(200).send({
          success: true,
          message: "All notification deleted successfully",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "All notification not deleted",
        });
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }
};
