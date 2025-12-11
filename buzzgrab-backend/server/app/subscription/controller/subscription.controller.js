/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

const responseMessage = require("../../../middleware/responseMessage");
const { setResponseObject, generateOTP } = require("../../../middleware/commonFunction");
const { NOT_FOUND } = require("../../../middleware/responseMessage");
const { PAGE_LIMIT, PAGE_ONE, CONST } = require("../../../helpers/constant");
const dotenv = require("dotenv");
const {
  Payment,
  SUBSCRIPTION_MODEL,
  paymentSubscription,
  validatePaymentSubscription,
} = require("../model/subscription.model");
const _ = require("lodash");
const { default: mongoose } = require("mongoose");
const { USER } = require("../../userService/model/userModel");
dotenv.config();
const moment = require("moment");
const { formatErrorResponse } = require("../../../helpers/schedulers");
const { Console } = require("winston/lib/winston/transports");
const { PLAN } = require("../../plan/model/plan.model");
const { Notification } = require("../../notification/model/notification.model");
const fs = require('fs');
//const moment = require('moment');
const ExcelJS = require('exceljs');
const { sendNotification } = require("../../../helpers/fcmPushNotification");


const secret_key = process.env.STRIPE_API_KEY;
const stripe = require("stripe")(secret_key);

module.exports = class subscription_ {


  /**
   * Get all Subscription List for user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getPlanUserList(req, res, next) {
    try {

      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT ? CONST.MAX_PAGE_LIMIT : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;
      const planList = await PLAN.aggregate([
        {
          $sort: { _id: -1 },
        },
        {
          $match: {
            stateId: { $in: [CONST.ACTIVE, CONST.INACTIVE] },
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            let: {
              planId: "$_id",
              userId: req?.userId ? { $toObjectId: req?.userId } : null,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$planId", "$$planId"] },
                      { $eq: ["$createdBy", "$$userId"] },
                      { $in: ["$status", ["active", "canceled"]] },
                      { $gte: ["$endDate", Math.round(Date.now() / 1000)] },
                    ],
                  },
                },
              },
              {
                $sort: { _id: -1 },
              },
            ],
            as: "paymentSubscriptionRecord",
          },
        },
        {
          $addFields: {
            isSubscriptionBuy: {
              $gt: [{ $size: "$paymentSubscriptionRecord" }, 0],
            },
          },
        },
        {
          $lookup: {
            from: "subscriptions",
            let: {
              planId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$planId", "$$planId"] },
                      { $eq: ["$status", "active"] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$planType", // Group by planType
                  count: { $sum: 1 }, // Count the number of subscriptions per type
                },
              },
            ],
            as: "subscriptionCounts", // Store the result in subscriptionCounts
          },
        },
        {
          $addFields: {
            subscriptionCounts: {
              $cond: {
                if: { $isArray: "$subscriptionCounts" }, // Check if subscriptionCounts is an array
                then: { $arrayElemAt: ["$subscriptionCounts.count", 0] }, // Extract the count if it's an array
                else: "$subscriptionCounts", // Keep the value if it's already a number
              },
            },
          },
        },
        {
          $sort: { subscriptionCounts: -1 }, // Sort by subscriptionCounts in descending order
        },
        {
          $set: {
            popular: {
              $cond: {
                if: {
                  $eq: [
                    { $ifNull: ["$subscriptionCounts", 0] },
                    { $max: "$subscriptionCounts" },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            currency: { $first: "$currency" },
            amount: { $first: "$amount" },
            priceId: { $first: "$priceId" },
            features: { $first: "$features" },
            createdBy: { $first: "$createdBy" },
            createdAt: { $first: "$createdAt" },
            planType: { $first: "$planType" },
            updatedAt: { $first: "$updatedAt" },
            isSubscriptionBuy: { $first: "$isSubscriptionBuy" },
            subscriptionCounts: { $first: "$subscriptionCounts" }, // Add subscription counts
            popular: { $first: "$popular" }, // Add subscription counts
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




      if (planList && planList[0].data.length) {
        await setResponseObject(
          req,
          true,
          responseMessage.FOUND_SUCCESS("Plan"),
          planList[0].data,
          planList[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Plan"), []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };







  /**
   * api for Landlords to get price list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getActivePlan(req, res, next) {
    try {

      const getAllProductPrice = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            $and: [
              { createdBy: new mongoose.Types.ObjectId(req.userId) },
              { status: { $in: ["active", "canceled"] } },
              { endDate: { $gte: Math.round(Date.now() / 1000) } },
            ],
          },
        },
        {
          $lookup: {
            from: "plans",
            let: {
              planId: "$planId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$_id", "$$planId"] }, // Match by priceId
                    ],
                  },
                },
              },
            ],
            as: "planRecord",
          },
        },
        {
          $unwind: {
            path: "$planRecord",
          },
        },
        {
          // Grouping to consolidate fields
          $group: {
            _id: "$_id",
            subscriptionId: { $first: "$subscriptionId" },
            planId: { $first: "$planId" },
            collectionMethod: { $first: "$collectionMethod" },
            currency: { $first: "$currency" },
            amount: { $first: "$amount" },
            startDate: { $first: "$startDate" },
            endDate: { $first: "$endDate" },
            paymentMethodId: { $first: "$paymentMethodId" },
            status: { $first: "$status" },
            priceId: { $first: "$priceId" },
            createdBy: { $first: "$createdBy" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            planRecord: { $first: "$planRecord" }, // First record from paymentProductRecord
          },
        },
        { $sort: { _id: -1 } },
      ]);

      if (getAllProductPrice.length) {
        await setResponseObject(
          req,
          true,
          responseMessage.FOUND_SUCCESS("Price plan"),
          getAllProductPrice[0]
        );
        next();
      } else {
        await setResponseObject(req, true, NOT_FOUND("Price plan"), []);
        next();
      }

    } catch (error) {
      await setResponseObject(req, false, error.message, error.stack);
      next();
    }
  }


  async getAllTransactions(req, res, next) {
    try {
      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT ? CONST.MAX_PAGE_LIMIT : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      const list = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match:
            { createdBy: new mongoose.Types.ObjectId(req.userId) },

        },
        {
          $lookup: {
            from: "plans",
            let: {
              plan: "$planId"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$plan", "$_id"]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  name: 1
                }
              }
            ],
            as: "planData"
          }
        },
        {
          $unwind: {
            path: "$planData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            _id: -1,
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
          "Transactions found successfuly",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "FAQ not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

  async getAdminAllTransactions(req, res, next) {
    try {
      let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
      let pageLimit = parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT ? CONST.MAX_PAGE_LIMIT : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      const searchQuery = req.query.search ? req.query.search : null;

      const list = await SUBSCRIPTION_MODEL.aggregate([
        {
          $lookup: {
            from: "plans",
            let: {
              plan: "$planId"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$plan", "$_id"]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  planType: 1
                }
              }
            ],
            as: "planData"
          }
        },
        {
          $unwind: {
            path: "$planData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            let: {
              user: "$createdBy"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$user", "$_id"]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  firstName: 1,
                  lastName: 1,
                  email: 1
                }
              }
            ],
            as: "userData"
          }
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: searchQuery ? {
            $or: [
              { "userData.email": { $regex: searchQuery, $options: "i" } },
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ["$userData.firstName", " ", "$userData.lastName"] },
                    regex: searchQuery,
                    options: "i"
                  }
                }
              }
            ]
          } : {}
        },
        {
          $sort: {
            _id: -1,
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
          "Transactions found successfuly",
          list[0].data,
          list[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(req, true, "FAQ not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };


  async getSingleTransaction(req, res, next) {
    try {

      const list = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match:
            { createdBy: new mongoose.Types.ObjectId(req.userId) },
        },
        {
          $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
        },
        {
          $lookup: {
            from: "plans",
            let: {
              plan: "$planId"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$plan", "$_id"]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  name: 1
                }
              }
            ],
            as: "planData"
          }
        },
        {
          $unwind: {
            path: "$planData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            let: {
              user: "$createdBy"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$user", "$_id"]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  mobile: 1
                }
              }
            ],
            as: "userData"
          }
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },

      ]);

      // Retrieve payment method and invoice details
      const paymentMethod = await stripe.paymentMethods.retrieve(
        list[0]?.paymentMethodId
      );
      const invoice = await stripe.invoices.retrieve(list[0].latestInvoice);
      if (list.length > 0) {
        // Merge paymentMethod and invoice into the data object
        const responseData = {
          ...list[0],
          paymentMethod: {
            brand: paymentMethod.card.brand,
            last4: `XXXX-XXXX-XXXX-${paymentMethod.card.last4}`,
          },
          invoice: {
            number: invoice?.number,
          },
        };
        return res.status(200).send({
          message: "Transactions found successfuly",
          data: responseData,
        });
      } else {
        await setResponseObject(req, true, "Transaction not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

  async getSingleAdminTransaction(req, res, next) {
    try {

      const list = await SUBSCRIPTION_MODEL.aggregate([

        {
          $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
        },
        {
          $lookup: {
            from: "plans",
            let: {
              plan: "$planId"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$plan", "$_id"]
                  }
                }
              },
              // {
              //   $project: {
              //     _id: 1,
              //     name: 1,
              //     features: 1
              //   }
              // }
            ],
            as: "planData"
          }
        },
        {
          $unwind: {
            path: "$planData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            let: {
              user: "$createdBy"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$user", "$_id"]
                  }
                }
              },
              {
                $project: {
                  _id: 1,
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  mobile: 1
                }
              }
            ],
            as: "userData"
          }
        },
        {
          $unwind: {
            path: "$userData",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "subscriptions",
            let: {
              subscription: "$_id"
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$subscription", "$_id"]
                  }
                }
              },

            ],
            as: "subscriptionData"
          }
        },
        {
          $unwind: {
            path: "$subscriptionData",
            preserveNullAndEmptyArrays: true,
          },
        },

      ]);


      if (list.length > 0) {
        // Merge paymentMethod and invoice into the data object
        const responseData = {
          ...list[0],

        };
        return res.status(200).send({
          message: "Transactions found successfuly",
          data: responseData,
        });
      } else {
        await setResponseObject(req, true, "Transaction not found", []);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message);
      next();
    }
  };

  async getSingleDeleteProductPrice(req, res, next) {
    try {
      const getSingleDeleteRecord = await paymentProductPrice.findByIdAndUpdate(
        req.params.id, // The ID of the document to update
        {
          $set: {
            stateId: CONST.DELETED,
          },
        },
        { new: true } // This option returns the updated document
      );
      if (getSingleDeleteRecord) {
        await setResponseObject(
          req,
          true,
          responseMessage.FOUND_SUCCESS("Price"),
          getSingleDeleteRecord
        );
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Price"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * Api for user to create a subscription
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async createSubscription(req, res, next) {
    try {
      let { priceId, paymentMethodId } = req.body;

      const { error } = await validatePaymentSubscription(req.body);
      if (error)
        return res.status(400).send({
          statusCode: 400,
          message: formatErrorResponse(error.details[0].message),
        });

      let paymentSubscriptionPreviousrecord = await SUBSCRIPTION_MODEL
        .findOne({
          createdBy: req.userId,
          status: "active",
        });

      if (paymentSubscriptionPreviousrecord) {
        return res.status(400).send({
          success: false,
          message: "You have already active plan",
        });
      }

      let paymentSubscriptionCheck = await SUBSCRIPTION_MODEL
        .findOne({
          createdBy: req.userId,
          endDate: { $gte: Math.round(Date.now() / 1000) }, // Match by createdBy
        })
        .sort({ _id: -1 })
        .populate("priceId");

      if (paymentSubscriptionCheck?.price == req.body.priceId) {
        return res.status(400).send({
          success: false,
          message: "You have already this plan",
        });
      }

      if (paymentSubscriptionCheck?.status == "active") {
        return res.status(400).send({
          success: false,
          message: "You have a already active plan first cancel.",
        });
      }

      const subscription = await stripe.subscriptions.create({
        customer: req.user.customerId,
        default_payment_method: req.body.paymentMethodId,
        items: [{ price: req.body.priceId }],
        currency: "usd",
      });

      let priceCheck = await PLAN.findOne({
        priceId: req.body.priceId,
      });

      //Add a subscription
      let payload = {
        subscriptionId: subscription.id,
        priceId: priceCheck?.priceId,
        collectionMethod: subscription.collection_method,
        currency: subscription.currency,
        amount: parseInt(subscription.plan.amount),
        startDate: subscription.current_period_start,
        endDate: subscription.current_period_end,
        paymentMethodId: subscription.default_payment_method,
        status: subscription.status,
        planId: priceCheck?._id,
        createdBy: req.userId,
        latestInvoice: subscription?.latest_invoice,
        stateId: CONST.COMPLETE
      };

      await new SUBSCRIPTION_MODEL(payload).save();
      subscription.userRecord = {
        _id: req?.user._id,
        firstName: req?.user.firstName,
        lastName: req?.user.lastName,
        firstNameArabic: req?.user.firstNameArabic,
        lastNameArabic: req?.user.lastNameArabic,
        countryCode: req?.user.countryCode,
        mobile: req?.user.mobile
      };
      if (subscription.status == "active") {
        await USER.updateOne(
          { _id: req.userId },
          { $set: { isSubscriptionBuy: true } }
        )
      }

      let paymentSubscriptionRecord = _.pick(subscription, [
        "_id",
        "object",
        "currency",
        "current_period_start",
        "current_period_end",
        "plan.amount",
        "status",
        "userRecord",
        "stateId"
      ]);

      if (subscription) {

        const adminData = await USER.findOne({ roleId: CONST.ADMIN })
        await Notification({
          title: "Subscription Activated",
          description: "Your subscription has been successfully activated.",
          from: adminData._id,
          to: req.userId,
          subscriptionId: subscription._id,
          type: CONST.NOTIFICATION_STATE.STATE_ID.PAYMENT,
        }).save()

        let findUser = await USER.findOne({ _id: req.userId })
        // Push Notification (assumes the user has a device token stored)
        if (findUser.deviceToken && findUser.isNotificationOn == CONST.NOTIFICATION_ON) {
          await sendNotification(
            findUser.deviceToken,
            "Subscription Activated",
            "Your subscription has been successfully activated.",
            CONST.NOTIFICATION_STATE.STATE_ID.PAYMENT
          );
        }
        await setResponseObject(
          req,
          true,
          "Subscription added Successfully",
          paymentSubscriptionRecord
        );
        return next();
      } else {
        await setResponseObject(req, true, "Error occur while payment", []);
        return next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  async deleteSubscription(req, res, next) {
    try {
      const deleteSubscription = await stripe.subscriptions.cancel(
        req.params.id
      );
      if (deleteSubscription) {

        
        let findUser = await USER.findOne({ _id: req.userId })

        // Push Notification (assumes the user has a device token stored)
        if (findUser.deviceToken && findUser.isNotificationOn == CONST.NOTIFICATION_ON) {
          await sendNotification(
            findUser.deviceToken,
            "Subscription Cancelled",
            "Your subscription is cancelled, and no auto payments will be charged.",
            CONST.NOTIFICATION_STATE.STATE_ID.CANCEL_SUBSCRIPTION
          );
        }
        await setResponseObject(
          req,
          true,
          "Subscription cancelled successfully",
          deleteSubscription
        );
        const subscriptionCancel = await SUBSCRIPTION_MODEL.updateOne(
          { subscriptionId: deleteSubscription?.id },
          { $set: { status: deleteSubscription?.status } }
        );
        const adminData = await USER.findOne({ roleId: CONST.ADMIN })
        await Notification({
          title: "Subscription Cancelled",
          description: "Your subscription is cancelled, and no auto payments will be charged..",
          from: adminData._id,
          to: req.userId,
          subscriptionId: subscriptionCancel._id,
          type: CONST.NOTIFICATION_STATE.STATE_ID.CANCEL_SUBSCRIPTION,
        }).save()
        return next();
      } else {
        await setResponseObject(req, false, "Subscription not cancelled", []);
        return next();
      }
    } catch (error) {
      console.log("error", error);
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }


  async subscriptionReportCount(req, res, next) {
    try {
        // Fetch all relevant plans
        const monthPlans = await PLAN.find({ planType: CONST.PLAN_TYPE.MONTH });
        const monthPlanIds = monthPlans.map(plan => plan._id);

        const yearPlans = await PLAN.find({ planType: CONST.PLAN_TYPE.YEAR });
        const yearPlanIds = yearPlans.map(plan => plan._id);

        const sixMonthPlans = await PLAN.find({ planType: CONST.PLAN_TYPE.SIX_MONTH });
        const sixPlanIds = sixMonthPlans.map(plan => plan._id);

        const threeMonthPlans = await PLAN.find({ planType: CONST.PLAN_TYPE.THREE_MONTH });
        const threePlanIds = threeMonthPlans.map(plan => plan._id);

        // Total subscription count
        let totalSubscriptionCount = await SUBSCRIPTION_MODEL.countDocuments({});

        // Total active subscription count
        let totalActiveSubscriptionCount = await SUBSCRIPTION_MODEL.countDocuments({
            status: "active",
            planId: { $in: [...monthPlanIds, ...yearPlanIds, ...sixPlanIds, ...threePlanIds] } // Flatten the arrays
        });

        // Total canceled subscription count
        let totalCancelCount = await SUBSCRIPTION_MODEL.countDocuments({
            status: "canceled",
            planId: { $in: [...monthPlanIds, ...yearPlanIds, ...sixPlanIds, ...threePlanIds] } // Flatten the arrays
        });

        // Total monthly subscriptions
        let totalMonthlyCount = await SUBSCRIPTION_MODEL.countDocuments({
            planId: { $in: monthPlanIds } // Match any planId in the array
        });

        // Total yearly subscriptions
        let totalYear = await SUBSCRIPTION_MODEL.countDocuments({
            planId: { $in: yearPlanIds } // Match any planId in the array
        });

        // Total six-month subscriptions
        let totalSixMonth = await SUBSCRIPTION_MODEL.countDocuments({
            planId: { $in: sixPlanIds } // Match any planId in the array
        });

        // Total three-month subscriptions
        let totalThreeMonth = await SUBSCRIPTION_MODEL.countDocuments({
            planId: { $in: threePlanIds } // Match any planId in the array
        });

        // Prepare response data
        return res.status(200).send({
            message: "Dashboard count found successfully",
            success: true,
            data: {
                totalSubscriptionCount: totalSubscriptionCount || 0,
                totalActiveSubscriptionCount: totalActiveSubscriptionCount || 0,
                totalCancelCount: totalCancelCount || 0,
                totalMonthlyCount: totalMonthlyCount || 0,
                totalYear: totalYear || 0,
                totalThreeMonth: totalThreeMonth || 0,
                totalSixMonth: totalSixMonth || 0
            },
        });
    } catch (error) {
        console.log("error===================", error);
        await setResponseObject(req, false, error.message, "");
        next(error); // Pass the error to next
    }
}


  async subscriptionReport(req, res, next) {
    try {
      // Fetch active plans
      const monthPlan = await PLAN.findOne({ planType: CONST.PLAN_TYPE.MONTH });
      const yearPlan = await PLAN.findOne({ planType: CONST.PLAN_TYPE.YEAR });
      const sixMonthPlan = await PLAN.findOne({ planType: CONST.PLAN_TYPE.SIX_MONTH });
      const threeMonthPlan = await PLAN.findOne({ planType: CONST.PLAN_TYPE.THREE_MONTH });


      const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const result = [];

      const currentYear = req.params.year ? req.params.year : new Date().getFullYear();

      for (const month of allMonths) {
        const monthlyCounts = [month];
        const monthIndex = allMonths.indexOf(month);
        const startDate = new Date(Date.UTC(currentYear, monthIndex, 1));
        const endDate = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999));
        const query = { createdAt: { $gte: startDate, $lte: endDate } };



        // Count by plan type
        if (monthPlan) {
          const countMonthPlan = await SUBSCRIPTION_MODEL.countDocuments({ status: "active", planId: monthPlan._id, ...query });
          monthlyCounts.push(countMonthPlan || 0);
        } else {
          monthlyCounts.push(0);
        }

        if (yearPlan) {
          const countYearPlan = await SUBSCRIPTION_MODEL.countDocuments({ status: "active", planId: yearPlan._id, ...query });
          monthlyCounts.push(countYearPlan || 0);
        } else {
          monthlyCounts.push(0);
        }

        if (sixMonthPlan) {
          const countSixMonthPlan = await SUBSCRIPTION_MODEL.countDocuments({ status: "active", planId: sixMonthPlan._id, ...query });
          monthlyCounts.push(countSixMonthPlan || 0);
        } else {
          monthlyCounts.push(0);
        }

        if (threeMonthPlan) {
          const countThreeMonthPlan = await SUBSCRIPTION_MODEL.countDocuments({ status: "active", planId: threeMonthPlan._id, ...query });
          monthlyCounts.push(countThreeMonthPlan || 0);
        } else {
          monthlyCounts.push(0);
        }

        result.push(monthlyCounts);
      }

      return res.send({
        success: true,
        totalCount: result.length,
        data: result,
      });
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next(error); // Pass the error to next
    }
  }






  async updateState(req, res, next) {
    try {
      let payload = req.body;

      const findData = await paymentProductPrice.findById(req.params.id);

      if (!findData) {
        await setResponseObject(req, false, NOT_FOUND("Subscription"), "");
        return next();
      }

      let message;
      if (payload.stateId == CONST.ACTIVE)
        message = 'Subsciption Active Successfully'
      else if (payload.stateId == CONST.INACTIVE)
        message = 'Subsciption Inactive Successfully'
      else
        return res.status(400).send({ message: 'stateId is required' })


      const updateState = await paymentProductPrice.findOneAndUpdate(
        { _id: req.params.id },
        { stateId: payload.stateId },
        { new: true }
      );

      if (updateState) {
        await setResponseObject(req, true, message, updateState);
        next()
      } else {
        await setResponseObject(req, false, "Failed to update subscription state", "");
        next()
      }
    } catch (error) {
      console.log("Error in updateState:", error);
      await setResponseObject(req, false, error.message, "");
      return next();
    }
  }

  /**
   * Create card
   * @param {customerId} req.body
   * @param {token} req.body // Get by client
   * @param {*}
   */
  async addCard(req, res, next) {
    try {

      const card = await stripe.customers.createSource(req.user.customerId, {
        source: req.body.cardTokenId,
      });

      const paymentMethods = await stripe.customers.listPaymentMethods(
        req.user.customerId,
        {
          type: "card", // Specify the type of payment method
        }
      );

      if (card) {
        await setResponseObject(req, true, "Card added successfully", card);
        return next();
      } else {
        await setResponseObject(req, false, "Fail to add card", "");
        return next();
      }
    } catch (error) {
      console.log("error", error)
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }


  /**
   * List of all cards
   * @param {customerId} req.body
   * @param {*}
   * @param {*}
   */
  async cardList(req, res, next) {
    try {
      const paymentMethods = await stripe.customers.listPaymentMethods(
        req.user.customerId,
        {
          limit: 8,
        }
      );

      let response = [];
      for (let index = 0; index < paymentMethods.data.length; index++) {
        const element = paymentMethods.data[index];
        var obj = {};
        (obj.id = element.id),
          (obj.object = element.object),
          (obj.customer = element.customer),
          (obj.type = element.type),
          (obj.brand = element.card.brand),
          (obj.country = element.card.country),
          (obj.exp_month = element.card.exp_month),
          (obj.exp_year = element.card.exp_year),
          (obj.last4 = `XXXX-XXXX-XXXX-` + element.card.last4),
          (obj.created = element.created),
          response.push(obj);
      }

      if (response) {
        await setResponseObject(
          req,
          true,
          "Cards found successfully",
          response
        );
        return next();
      } else {
        await setResponseObject(req, true, "Cards not found", []);
        return next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * single Card details
   * @param {customerId} req.body
   * @param {cardId} req.body
   * @param {*}
   */
  async cardDetails(req, res, next) {
    try {
      const card = await stripe.customers.retrieveSource(
        req.user.customerId,
        req.params.id
      );
      if (card) {
        await setResponseObject(
          req,
          true,
          "Card details found successfully",
          card
        );
        return next();
      } else {
        await setResponseObject(req, true, "Card details not found", []);
        return next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * Delete card
   * @param {customerId} req.body
   * @param {cardId} req.body
   * @param {*} next
   */
  async cardDelete(req, res, next) {
    try {
      const deletecard = await stripe.customers.deleteSource(
        req.user.customerId,
        req.params.id
      );
      if (deletecard) {
        await setResponseObject(
          req,
          true,
          "Card deleted successfully",
          deletecard
        );
        return next();
      } else {
        await setResponseObject(req, false, "Card not deleted", []);
        return next();
      }
    } catch (error) {
      console.log("error", error);
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * api for admin to add price for commission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async addCommission(req, res, next) {
    try {
      let { typeId, amount } = req.body;
      let exist = await paymentCommission.findOne({
        typeId: typeId,
      });
      if (exist) {
        await setResponseObject(
          req,
          false,
          responseMessage.ALREADY_EXIST("Data")
        );
        return next();
      } else {
        let result = await paymentCommission.create({
          typeId: typeId,
          amount: amount,
          createdBy: req.userId,
        });
        if (result) {
          await setResponseObject(
            req,
            true,
            "Commission Added Successfully",
            result
          );
          return next();
        } else {
          await setResponseObject(req, false, "Something went wrong");
          return next();
        }
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * api for admin to edit price for commission
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async editCommission(req, res, next) {
    try {
      let { typeId, amount } = req.body;
      let exist = await paymentCommission.findOne({
        _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
        typeId: typeId,
      });
      if (exist) {
        await setResponseObject(
          req,
          false,
          responseMessage.ALREADY_EXIST("Data")
        );
        return next();
      } else {
        let result = await paymentCommission.findByIdAndUpdate(
          { _id: req.params.id },
          {
            typeId: typeId,
            amount: amount,
          },
          { new: true }
        );
        if (result) {
          await setResponseObject(
            req,
            true,
            "Commission Updated Successfully",
            result
          );
          return next();
        } else {
          await setResponseObject(req, false, "Something went wrong", "");
          return next();
        }
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * api for admin to get commission detail
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async commissionDetail(req, res, next) {
    try {
      const getSingle = await paymentCommission.findOne({ _id: req.params.id });
      if (getSingle) {
        await setResponseObject(
          req,
          true,
          responseMessage.FOUND_SUCCESS("Detail"),
          getSingle
        );
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND("Detail"), "");
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /*DELETE commission*/
  async deleteCommission(req, res, next) {
    try {
      const deleteData = await paymentCommission.findByIdAndDelete({
        _id: req.params.id,
      });
      if (deleteData) {
        await setResponseObject(
          req,
          true,
          responseMessage.PAGE_DELETE_SUCCESS,
          ""
        );
        next();
      } else {
        await setResponseObject(
          req,
          false,
          responseMessage.PAGE_DELETE_ERROR,
          ""
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /*Commission List*/
  async commissionList(req, res, next) {
    try {
      const list = await paymentCommission.find({});
      if (list.length) {
        await setResponseObject(req, true, responseMessage.FOUND_SUCCESS, list);
        next();
      } else {
        await setResponseObject(req, false, NOT_FOUND, list);
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  /**
   * api for admin to get a subscription list
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getLandlordSubscriptions(req, res, next) {
    try {
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit =
        parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT
          ? CONST.MAX_PAGE_LIMIT
          : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      let getErrorLog = await paymentProductPrice.aggregate([
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $match: {
            stateId: { $in: [CONST.ACTIVE, CONST.INACTIVE] }
          }
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

      if (getErrorLog && getErrorLog[0].data.length) {
        await setResponseObject(
          req,
          true,
          responseMessage.FOUND_SUCCESS("Subscription"),
          getErrorLog[0].data,
          getErrorLog[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(
          req,
          true,
          responseMessage.NOT_FOUND("Subscription"),
          ""
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  async getAdminSubscriptionsList(req, res, next) {
    try {
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit =
        parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT
          ? CONST.MAX_PAGE_LIMIT
          : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      let getErrorLog = await paymentSubscription.aggregate([
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            let: { id: "$createdBy" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
              {
                $project: {
                  _id: 1,
                  fullName: 1,
                  firstName: 1,
                  lastName: 1,
                  email: 1,
                  countryCode: 1,
                  mobile: 1,
                  profileImg: 1,
                },
              },
            ],
            as: "userData",
          },
        },
        {
          $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: "productprices",
            let: { id: "$priceId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$_id"] },
                },
              },
            ],
            as: "productPricesData",
          },
        },
        {
          $unwind: {
            path: "$productPricesData",
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

      if (getErrorLog && getErrorLog[0].data.length) {
        await setResponseObject(
          req,
          true,
          responseMessage.FOUND_SUCCESS("Subscription"),
          getErrorLog[0].data,
          getErrorLog[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(
          req,
          true,
          responseMessage.NOT_FOUND("Subscription transactions"),
          ""
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  async getSubscribedUserList(req, res, next) {
    try {
      let pageNo = parseInt(req.query.pageNo) || 1;
      let pageLimit =
        parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT
          ? CONST.MAX_PAGE_LIMIT
          : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

      let searchFilters = {};
      if (req.query.search && req.query.search !== "undefined") {
        const searchTerm = req.query.search.replace(
          new RegExp("\\\\", "g"),
          "\\\\"
        );

        searchFilters = {
          $or: [
            {
              lastName: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              email: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              uniqueUserId: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              totalVoucherGeneratedCount: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              totalVoucherRedeemCount: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              totalTotalSpent: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              totalSaving: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              "paymentsubscriptions.amount": {
                $regex: searchTerm,
                $options: "i",
              },
            },
          ],
        };
      }
      let filter = [];
      let startDateString;
      let endDateString;

      if (req.query.from) {
        const startDate = moment(req?.query?.from);
        if (!startDate.isValid()) {
        } else {
          startDateString = startDate.format("YYYY-MM-DD"); // Use YYYY-MM-DD for comparison
        }
      }

      if (req?.query?.to) {
        const endDate = moment(req?.query?.to);
        if (!endDate.isValid()) {
          console.log("Invalid end date");
        } else {
          endDateString = endDate.format("YYYY-MM-DD"); // Use YYYY-MM-DD for comparison
          console.log("endDateString", endDateString);
        }
      }

      if (startDateString && endDateString) {
        filter.push({
          $match: {
            $expr: {
              $and: [
                {
                  $gte: [
                    {
                      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    startDateString,
                  ],
                },
                {
                  $lte: [
                    {
                      $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                    },
                    endDateString,
                  ],
                },
              ],
            },
          },
        });
      } else if (startDateString) {
        filter.push({
          $match: {
            $expr: {
              $gte: [
                {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                startDateString,
              ],
            },
          },
        });
      } else if (endDateString) {
        filter.push({
          $match: {
            $expr: {
              $lte: [
                {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                endDateString,
              ],
            },
          },
        });
      }

      let stateId = {};
      switch (req.query.state) {
        case "1":
          stateId = {
            stateId: CONST.ACTIVE,
          };
          break;
        case "2":
          stateId = {
            stateId: CONST.INACTIVE,
          };
          break;

        default:
      }

      let getErrorLog = await USER.aggregate([
        ...filter,
        {
          $match: {
            stateId: { $ne: CONST.DELETED },
          },
        },
        {
          $match: {
            isSubscriptionBuy: true
          },
        },
        // {
        //   $match: searchFilters, // Apply additional search filters
        // },
        {
          $match: stateId, // Apply date filters
        },
        {
          $lookup: {
            from: "vouchers",
            let: { user_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$$user_id", "$userId"], // Match vouchers by user ID
                  },
                },
              },
              {
                $project: {
                  __v: 0,
                },
              },
              {
                $lookup: {
                  from: "services",
                  let: { id: "$serviceId" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$_id", "$$id"] }, // Match services by service ID
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        price: 1,
                        discount: 1,
                      },
                    },
                  ],
                  as: "serviceRecords",
                },
              },
            ],
            as: "vouchersRecord", // Store the results in vouchersRecord
          },
        },

        {
          $lookup: {
            from: "paymentsubscriptions",
            let: { user_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$user_id", "$createdBy"] },
                      { $gte: ["$endDate", Math.round(Date.now() / 1000)] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "productprices",
                  let: {
                    priceId: "$priceId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$_id", "$$priceId"] }, // Match by priceId
                          ],
                        },
                      },
                    },
                  ],
                  as: "paymentProductRecord",
                },
              },
              {
                $unwind: {
                  path: "$paymentProductRecord",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $sort: {
                  _id: -1,
                },
              },
            ],
            as: "paymentsubscriptions", // Store the results in vouchersRecord
          },
        },
        {
          $unwind: {
            path: "$paymentsubscriptions",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            totalVoucherGeneratedCount: {
              $size: "$vouchersRecord", // Count total vouchers
            },
            totalVoucherRedeemCount: {
              // Count vouchers where isUser is true
              $size: {
                $filter: {
                  input: "$vouchersRecord",
                  as: "voucher",
                  cond: { $eq: ["$$voucher.isUsed", true] }, // Change to isUsed based on your data
                },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$vouchersRecord",
            preserveNullAndEmptyArrays: true, // Keep documents even if vouchersRecord is empty
          },
        },
        {
          $unwind: {
            path: "$vouchersRecord.serviceRecords",
            preserveNullAndEmptyArrays: true, // Keep documents even if serviceRecords is empty
          },
        },
        {
          $addFields: {
            totalTotalSpent: {
              $ifNull: [
                {
                  $subtract: [
                    "$vouchersRecord.serviceRecords.price",
                    {
                      $divide: [
                        {
                          $multiply: [
                            "$vouchersRecord.serviceRecords.price",
                            "$vouchersRecord.serviceRecords.discount",
                          ],
                        },
                        100,
                      ],
                    },
                  ],
                },
                0, // Default value if calculation results in null
              ],
            },
          },
        },
        {
          $addFields: {
            totalSaving: {
              $ifNull: [
                {
                  $round: [
                    {
                      $subtract: [
                        "$vouchersRecord.serviceRecords.price",
                        "$totalTotalSpent",
                      ],
                    },
                    2, // Round to 2 decimal places
                  ],
                },
                0, // Default value if calculation results in null
              ],
            },
          },
        },
        {
          $group: {
            _id: "$_id", // Group by user ID
            countryCode: { $first: "$countryCode" },
            mobile: { $first: "$mobile" },
            email: { $first: "$email" },
            isVerified: { $first: "$isVerified" },
            isNotify: { $first: "$isNotify" },
            locationType: { $first: "$location.type" },
            coordinates: { $first: "$location.coordinates" },
            isProfileCompleted: { $first: "$isProfileCompleted" },
            deviceToken: { $first: "$deviceToken" },
            isTermsCondition: { $first: "$isTermsCondition" },
            isNotificationOn: { $first: "$isNotificationOn" },
            deviceType: { $first: "$deviceType" },
            roleId: { $first: "$roleId" },
            stateId: { $first: "$stateId" },
            customerId: { $first: "$customerId" },
            isDocumentVerified: { $first: "$isDocumentVerified" },
            // isIndividualPlanBuy: { $first: "$isIndividualPlanBuy" },
            // isFamilyPlanBuy: { $first: "$isFamilyPlanBuy" },
            isFreeTrial: { $first: "$isFreeTrial" },
            isSubscriptionBuy: { $first: "$isSubscriptionBuy" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            firstName: { $first: "$firstName" },
            lastName: { $first: "$lastName" },
            uniqueUserId: { $first: "$uniqueUserId" },
            profileImg: { $first: "$profileImg" },
            paymentsubscriptions: { $first: "$paymentsubscriptions" },

            totalVoucherGeneratedCount: {
              $first: "$totalVoucherGeneratedCount",
            },
            totalVoucherRedeemCount: { $first: "$totalVoucherRedeemCount" },

            totalTotalSpent: { $first: "$totalTotalSpent" },

            totalSaving: { $first: "$totalSaving" },
          },
        },
        {
          $sort: {
            _id: -1, // Sort by descending order of _id
          },
        },
        {
          $match: searchFilters, // Apply additional search filters
        },
        {
          $facet: {
            data: [
              {
                $skip: pageLimit * (pageNo - 1),
              },
              {
                $limit: pageLimit,
              },
            ],
            count: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);

      if (getErrorLog && getErrorLog[0].data.length) {
        await setResponseObject(
          req,
          true,
          responseMessage.FOUND_SUCCESS("Subscription user"),
          getErrorLog[0].data,
          getErrorLog[0].count[0].count,
          pageNo,
          pageLimit
        );
        next();
      } else {
        await setResponseObject(
          req,
          true,
          responseMessage.NOT_FOUND("Subscription user"),
          ""
        );
        next();
      }
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  }

  downloadGraph = async (req, res, next) => {
    try {
      const dir = "../uploads/dailyGraph";
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Extract start and end dates from the request query parameters
      const { startDate, endDate } = req.query;

      // Initialize start and end of the month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setHours(23, 59, 59, 999);

      // Use provided dates if they exist, otherwise use the default month range
      const start = startDate ? new Date(startDate) : startOfMonth;
      const end = endDate ? new Date(endDate) : endOfMonth;

      // Validate the dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).send({
          success: false,
          message: "Invalid date format. Please provide valid start and end dates."
        });
      }

      // Generate an array of all dates from the start to the end date
      const generateDateRange = (start, end) => {
        const dates = [];
        let currentDate = moment(start);
        const endDate = moment(end);

        while (currentDate <= endDate) {
          dates.push(currentDate.format("YYYY-MM-DD"));
          currentDate = currentDate.add(1, 'days');
        }

        return dates;
      };

      const allDates = generateDateRange(start, end);

      const dailyRevenue = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            status: "active",
            createdAt: {
              $gte: start,
              $lte: end
            }
          }
        },
        {
          $project: {
            formattedDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            amount: 1 // Include the amount field
          }
        },
        {
          $group: {
            _id: "$formattedDate", // Group by the formatted date
            totalRevenue: { $sum: { $ifNull: ["$amount", 0] } } // Use $ifNull to handle null amounts
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Create a map of the daily revenue for easy lookup
      const revenueMap = dailyRevenue.reduce((acc, item) => {
        acc[item._id] = item.totalRevenue;
        return acc;
      }, {});

      // Prepare the final result with all dates from the start to the end date
      const result = allDates.map(date => ({
        _id: date,
        totalRevenue: revenueMap[date] || 0 // Use 0 if no revenue found for the date
      }));

      // Inner function to generate Excel file
      const generateExcel = async (result) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Daily Report");

        const data = [
          ["Date", "Amount"], // Header row
        ];

        result.forEach((item) => {
          data.push([item._id, item.totalRevenue]);
        });

        // Add rows to the worksheet
        data.forEach((row) => {
          worksheet.addRow(row);
        });

        // Adjust column widths
        data[0].forEach((_, index) => {
          const maxLength = data.reduce(
            (max, row) => Math.max(max, row[index] ? row[index].toString().length : 0),
            0
          );
          worksheet.getColumn(index + 1).width = maxLength + 2; // Adding some padding
        });

        // Define the file path for the Excel file
        const excelPath = `../uploads/dailyGraph/report-${generateOTP(6)}.xlsx`;

        // Write the workbook to a file
        await workbook.xlsx.writeFile(excelPath);

        return excelPath; // Ensure this is returned
      };

      if (result.length > 0) {
        const excelPath = await generateExcel(result);

        let excelUrl = `${process.env.SERVER_API_URL}/api/${excelPath}`; // Example URL format
        excelUrl = excelUrl.replace(/\/\.\.\//g, "/");
        await setResponseObject(req, true, "Report downloaded successfully", excelUrl, result[0].data);
        next();
      } else {
        await setResponseObject(req, true, "No data available");
        next();
      }
    } catch (error) {
      console.error("Error in downloadGraph:", error); // Log the error for debugging
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };

  graphData = async (req, res, next) => {
    try {
      // Extract start and end dates from the request query parameters
      const { startDate, endDate } = req.query;

      // Initialize start and end of the month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setHours(23, 59, 59, 999);

      // Use provided dates if they exist, otherwise use the default month range
      const start = startDate ? moment(startDate).startOf('day').toDate() : startOfMonth;
      const end = endDate ? moment(endDate).endOf('day').toDate() : endOfMonth;

      // Validate the dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).send({
          success: false,
          message: "Invalid date format. Please provide valid start and end dates."
        });
      }

      // Generate an array of all dates from the start to the end date
      const generateDateRange = (start, end) => {
        const dates = [];
        let currentDate = moment(start);
        const endDate = moment(end);

        while (currentDate <= endDate) {
          dates.push(currentDate.format("YYYY-MM-DD"));
          currentDate = currentDate.add(1, 'days');
        }

        return dates;
      };

      const allDates = generateDateRange(start, end);

      const dailyRevenue = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            createdAt: {
              $gte: start,
              $lte: end
            },

          }
        },
        {
          $project: {
            formattedDate: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            amount: 1 // Include the amount field
          }
        },
        {
          $group: {
            _id: "$formattedDate", // Group by the formatted date
            totalRevenue: { $sum: { $ifNull: ["$amount", 0] } } // Use $ifNull to handle null amounts
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Create a map of the daily revenue for easy lookup
      const revenueMap = dailyRevenue.reduce((acc, item) => {
        acc[item._id] = item.totalRevenue;
        return acc;
      }, {});

      // Prepare the final result with all dates from the start to the end date
      const result = allDates.map(date => ({
        _id: date,
        totalRevenue: revenueMap[date] || 0 // Use 0 if no revenue found for the date
      }));

      return res.send({
        success: true,
        dailyRevenue: result, // Send the result back in the response
      });
    } catch (error) {
      console.error("Error in graphData:", error); // Log the error for debugging
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };




  async monthReportCount(req, res, next) {
    try {

      // Fetch active plans
      const monthPlan = await PLAN.find({ planType: CONST.PLAN_TYPE.MONTH });
      const monthPlanIds = monthPlan.map(plan => plan._id);
      const yearPlan = await PLAN.find({ planType: CONST.PLAN_TYPE.YEAR });
      const yearPlanIds = yearPlan.map(plan => plan._id);
      const sixMonthPlan = await PLAN.find({ planType: CONST.PLAN_TYPE.SIX_MONTH });
      const sixPlanIds = sixMonthPlan.map(plan => plan._id);
      const threeMonthPlan = await PLAN.find({ planType: CONST.PLAN_TYPE.THREE_MONTH });
      const threePlanIds = threeMonthPlan.map(plan => plan._id);

      // Total Revenue Calculations
      const monthlyRevenue = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            planId: { $in: monthPlanIds } // Match any planId in the array
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" }
          }
        }

      ]);


      const yearlyRevenue = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            planId: { $in: yearPlanIds } // Match any planId in the array
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" }
          }
        }
      ]);


      const sixMonthRevenue = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            planId:{ $in: sixPlanIds } // Match any planId in the array
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" }
          }
        }
      ]);

      
      const threeMonthRevenue = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            planId: { $in: threePlanIds } // Match any planId in the array
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" }
          }
        }
      ]);

      // Calculate total revenue
      const totalRevenue =
        (monthlyRevenue.length > 0 ? monthlyRevenue[0].totalRevenue : 0) +
        (yearlyRevenue.length > 0 ? yearlyRevenue[0].totalRevenue : 0) +
        (sixMonthRevenue.length > 0 ? sixMonthRevenue[0].totalRevenue : 0) +
        (threeMonthRevenue.length > 0 ? threeMonthRevenue[0].totalRevenue : 0);

      // Prepare response data
      return res.status(200).send({
        message: "Dashboard count found successfully",
        success: true,
        data: {

          monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue[0].totalRevenue : 0,
          quarterlyRevenue: threeMonthRevenue.length > 0 ? threeMonthRevenue[0].totalRevenue : 0,
          halfYearlyRevenue: sixMonthRevenue.length > 0 ? sixMonthRevenue[0].totalRevenue : 0,
          yearlyRevenue: yearlyRevenue.length > 0 ? yearlyRevenue[0].totalRevenue : 0,
          totalRevenue: totalRevenue,
        },
      });
    } catch (error) {
      console.log("error===================", error);
      await setResponseObject(req, false, error.message, "");
      next(error); // Pass the error to next
    }
  }






  monthlySubscriptionReport = async (req, res, next) => {
    try {
      const startOfYear = new Date();
      startOfYear.setMonth(0); // January
      startOfYear.setDate(1);
      startOfYear.setHours(0, 0, 0, 0);

      const endOfYear = new Date(startOfYear.getFullYear() + 1, 0, 0); // End of the year
      endOfYear.setHours(23, 59, 59, 999);

      // Monthly Subscription Count
      const monthlyCount = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            status: "active",
            createdAt: {
              $gte: startOfYear,
              $lte: endOfYear
            }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" }
            },
            totalCount: { $sum: 1 } // Count the number of subscriptions
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Quarterly Subscription Count
      const quarterlyCount = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            status: "active",
            createdAt: {
              $gte: startOfYear,
              $lte: endOfYear
            }
          }
        },
        {
          $group: {
            _id: {
              $concat: [
                { $substr: [{ $dateToString: { format: "%Y", date: "$createdAt" } }, 0, 4] },
                "-Q",
                { $toString: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } } }
              ]
            },
            totalCount: { $sum: 1 } // Count the number of subscriptions
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Half-Yearly Subscription Count
      const halfYearlyCount = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            status: "active",
            createdAt: {
              $gte: startOfYear,
              $lte: endOfYear
            }
          }
        },
        {
          $group: {
            _id: {
              $concat: [
                { $substr: [{ $dateToString: { format: "%Y", date: "$createdAt" } }, 0, 4] },
                "-H",
                { $toString: { $ceil: { $divide: [{ $month: "$createdAt" }, 6] } } }
              ]
            },
            totalCount: { $sum: 1 } // Count the number of subscriptions
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Yearly Subscription Count
      const yearlyCount = await SUBSCRIPTION_MODEL.aggregate([
        {
          $match: {
            status: "active",
            createdAt: {
              $gte: startOfYear,
              $lte: endOfYear
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
            totalCount: { $sum: 1 } // Count the number of subscriptions
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      return res.send({
        success: true,
        monthlyCount: monthlyCount[0].totalCount,
        quarterlyCount: quarterlyCount[0].totalCount,
        halfYearlyCount: halfYearlyCount[0].totalCount,
        yearlyCount: yearlyCount[0].totalCount
      });
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next();
    }
  };


  async financialSubscriptionReport(req, res, next) {
    try {
      const startOfYear = new Date();
      startOfYear.setMonth(0); // January
      startOfYear.setDate(1);
      startOfYear.setHours(0, 0, 0, 0);

      const endOfYear = new Date(startOfYear.getFullYear() + 1, 0, 0); // End of the year
      endOfYear.setHours(23, 59, 59, 999);

      // Fetch active plans
      const monthPlan = await PLAN.find({ planType: CONST.PLAN_TYPE.MONTH });
      const monthPlanIds = monthPlan.map(plan => plan._id);
      const yearPlan = await PLAN.find({ planType: CONST.PLAN_TYPE.YEAR });
      const yearPlanIds = yearPlan.map(plan => plan._id);
      const sixMonthPlan = await PLAN.find({ planType: CONST.PLAN_TYPE.SIX_MONTH });
      const sixPlanIds = sixMonthPlan.map(plan => plan._id);
      const threeMonthPlan = await PLAN.find({ planType: CONST.PLAN_TYPE.THREE_MONTH });
      const threePlanIds = threeMonthPlan.map(plan => plan._id);

      const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const result = [];

      const currentYear = req.params.year ? req.params.year : new Date().getFullYear();

      // Initialize total sums for each plan type
      let totalMonthlyRevenue = 0;
      let totalYearlyRevenue = 0;
      let totalSixMonthRevenue = 0;
      let totalThreeMonthRevenue = 0;

      for (const month of allMonths) {
        const monthlyCounts = [month];
        const monthIndex = allMonths.indexOf(month);
        const startDate = new Date(Date.UTC(currentYear, monthIndex, 1));
        const endDate = new Date(Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999));
        const query = { createdAt: { $gte: startDate, $lte: endDate } }; // Filter by date and status



        // Count revenue by plan type
        const monthPlanRevenue = monthPlan ? (await SUBSCRIPTION_MODEL.find({ ...query, planId: { $in: monthPlanIds }  })).reduce((acc, sub) => acc + sub.amount, 0) : 0;
        const yearPlanRevenue = yearPlan ? (await SUBSCRIPTION_MODEL.find({ ...query, planId: { $in: yearPlanIds } })).reduce((acc, sub) => acc + sub.amount, 0) : 0;
        const sixMonthPlanRevenue = sixMonthPlan ? (await SUBSCRIPTION_MODEL.find({ ...query, planId: { $in: sixPlanIds } })).reduce((acc, sub) => acc + sub.amount, 0) : 0;
        const threeMonthPlanRevenue = threeMonthPlan ? (await SUBSCRIPTION_MODEL.find({ ...query, planId: { $in: threePlanIds } })).reduce((acc, sub) => acc + sub.amount, 0) : 0;

        const totalRevenue = monthPlanRevenue + yearPlanRevenue + sixMonthPlanRevenue + threeMonthPlanRevenue ? monthPlanRevenue + yearPlanRevenue + sixMonthPlanRevenue + threeMonthPlanRevenue : 0;

        // Push plan revenues to monthlyCounts
        monthlyCounts.push(totalRevenue);
        monthlyCounts.push(monthPlanRevenue);
        monthlyCounts.push(yearPlanRevenue);
        monthlyCounts.push(sixMonthPlanRevenue);
        monthlyCounts.push(threeMonthPlanRevenue);

        // Accumulate total revenues
        totalYearlyRevenue += yearPlanRevenue;
        totalSixMonthRevenue += sixMonthPlanRevenue;
        totalThreeMonthRevenue += threeMonthPlanRevenue;

        result.push(monthlyCounts);
      }

      return res.send({
        success: true,
        totalCount: result.length,
        data: result,
        totalMonthlyRevenue: totalMonthlyRevenue || 0,
        totalYearlyRevenue: totalYearlyRevenue || 0,
        totalSixMonthRevenue: totalSixMonthRevenue || 0,
        totalThreeMonthRevenue: totalThreeMonthRevenue || 0,
      });
    } catch (error) {
      await setResponseObject(req, false, error.message, "");
      next(error); // Pass the error to next
    }
  }






}



