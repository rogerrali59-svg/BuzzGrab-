/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const { setResponseObject } = require("../../../middleware/commonFunction");
const {
  FOUND_SUCCESS,
  NOT_FOUND,
  DELETE_SUCCESS,
  DELETE_FAIL,
} = require("../../../middleware/responseMessage");
const { PLAN } = require("../model/plan.model");
const { USER } = require("../../userService/model/userModel");
const { Notification } = require("../../notification/model/notification.model");
const responseMessages = require("../../../middleware/responseMessage");
const nodemailer = require("../../../helpers/nodemailer");
const { sendNotification } = require("../../../helpers/fcmPushNotification");
const secret_key = process.env.STRIPE_API_KEY;
const stripe = require("stripe")(secret_key);
let _planController = {};

/**
 * Create a Plan
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_planController.addPlan = async (req, res, next) => {
  try {
    const getStripeInterval = (key) => {
      return {
        "1": { interval: 'month', interval_count: 1 },
        "2": { interval: 'month', interval_count: 3 },
        "3": { interval: 'month', interval_count: 6 },
        "4": { interval: 'year', interval_count: 1 },
      }[String(key)]
    }

    let body = req.body;

    const PLAN_TYPE_LABELS = {
      1: "Monthly",
      2: "Three-Month",
      3: "Six-Month",
      4: "Yearly"
    };


    const isPlanExist = await PLAN.findOne({
      planType: body.planType,
      stateId: { $ne: CONST.DELETED }
    });
    if (isPlanExist) {
      return res.status(400).send({
        success: false,
        message: `${PLAN_TYPE_LABELS[body.planType] || 'Unknown'} plan is already added`,
      });
    } else {
      let stripeProductList = await stripe.products.list({
        limit: 1,
      });

      let stripePlanData;

      if (stripeProductList?.data?.length > 0) {
        stripePlanData = await stripe.prices.create({
          unit_amount: req.body.amount,
          currency: "usd",
          recurring: getStripeInterval(req.body.planType),
          product: stripeProductList?.data[0].id,
          nickname: body?.name
        });
      } else {
        stripeProductList = await stripe.products.create({
          name: process.env.PROJECT_NAME,
        });
        if (stripeProductList) {
          stripePlanData = await stripe.prices.create({
            unit_amount: req.body.amount,
            currency: "usd",
            recurring: getStripeInterval(req.body.planType),
            product: stripeProductList?.id,
            nickname: body?.name
          });
        }
      }

      if (stripePlanData) {
        const response = await PLAN({
          productId: stripeProductList?.id,
          priceId: stripePlanData.id,
          name: stripePlanData?.nickname,
          features: body?.features,
          amount: stripePlanData?.unit_amount,
          currency: "usd",
          priceType: stripePlanData?.type,
          planType: req?.body.planType,
          insertDate: stripePlanData?.created,
          createdBy: req.userId,
        }).save();
        await setResponseObject(req, true, "Plan added Successfully", {});
        return next();
      } else {
        await setResponseObject(req, false, "Some issue is occured when adding the plan", {});
        return next();
      }
    }

  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Get all Subscription List
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_planController.getPlanList = async (req, res, next) => {
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
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [
            {
              $count: "count",
            },
          ],
        },
      },
    ])

    if (planList && planList[0].data.length) {
      await setResponseObject(
        req,
        true,
        FOUND_SUCCESS("Plan"),
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
 * Subscription update api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_planController.updatePlan = async (req, res, next) => {
  try {
    const data = req.body;

    let isExists = await PLAN.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(req.params.id) },
      name: { $regex: new RegExp(`^${data.name}$`, "i") },
      stateId: { $ne: CONST.DELETED },

    });
    if (isExists) {
      await setResponseObject(
        req,
        true,
        "Plan already exists with this name."
      );
      next();
    } else {
      let updatePlan = await PLAN.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { features: data?.features },
        { new: true }
      );
      if (updatePlan) {
         const adminData = await USER.findOne({roleId: CONST.ADMIN})
       let findUser = await USER.findOne({ _id: req.userId })
        // Push Notification (assumes the user has a device token stored)
        if (findUser.deviceToken && findUser.isNotificationOn == CONST.NOTIFICATION_ON) {
          await sendNotification(
            findUser.deviceToken,
            "Subcription Update",
            "A subscription has updated",
            CONST.NOTIFICATION_STATE.STATE_ID.SUBSCRIPTION
          );
        }
        await setResponseObject(
          req,
          true,
          "Plan updated successfully",
          updatePlan
        );
        next();
      } else {
        await setResponseObject(req, false, "Plan not updated.");
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/**
 * Subscription detail api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_planController.planDetail = async (req, res, next) => {
  try {
    const planData = await PLAN.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) })

    if (planData) {
      await setResponseObject(
        req,
        true,
        FOUND_SUCCESS("Plan"),
        planData
      );
      next();
    } else {
      await setResponseObject(req, false, NOT_FOUND("Plan"), {});
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};


_planController.deletePlan = async (req, res, next) => {
  try {
    // const isPlanTakenByUser = await SUBSCRIPTION_MODEL.findOne({ status: "active" });
    // if (isPlanTakenByUser) {
    //   await setResponseObject(
    //     req,
    //     true,
    //     "You can't delete the plan, some one is already taken",
    //     {}
    //   );
    // }
    let deleteSubcription = await PLAN.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      {
        $set: {
          stateId: CONST.DELETED,
        },
      }
    );
    if (deleteSubcription) {
      await setResponseObject(req, true, DELETE_SUCCESS("Subscription"), deleteSubcription);
      next();
    } else {
      await setResponseObject(req, false, "Subscription ", "");
      next();
    }

  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};



/**
 * Subscription status update api
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
_planController.updateState = async (req, res, next) => {
  try {
    let filter = {};
    let resp;

    switch (req.query.stateId) {
      case "1":
        filter = {
          stateId: 1, // 1 => ACTIVE
        };
        resp = "Plan active successfully";
        break;

      case "2":
        filter = {
          stateId: 2, // 2 => INACTIVE
        };
        resp = "Plan inactive successfully";
        break;
      default:
    }

    let updateState;

    updateState = await PLAN.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: filter,
      },
      { new: true }
    );

    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      next();
    } else {
      await setResponseObject(req, false, "Plan state not updated");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};


module.exports = _planController;
