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
const SCHEMA = mongoose.Schema;


const Notification = new SCHEMA(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    from: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    to: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    type:{
      type: Number,
      enum:[
        CONST.NOTIFICATION_STATE.STATE_ID.ADMIN,
        CONST.NOTIFICATION_STATE.STATE_ID.USER
      ]
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    stateId: {
      type: Number,
      enum: [
        CONST.NOTIFICATION_STATE.STATE_ID.ACTIVE,
        CONST.NOTIFICATION_STATE.STATE_ID.INACTIVE,
        CONST.NOTIFICATION_STATE.STATE_ID.DELETED,
      ],
      default: CONST.NOTIFICATION_STATE.STATE_ID.ACTIVE,
    },
    productId:{
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    reminderId:{
      type: mongoose.Types.ObjectId,
      ref: "reminder",
    },
    subscriptionId:{
      type: mongoose.Types.ObjectId,
      ref: "subscription",
    },
    planId:{
      type: mongoose.Types.ObjectId,
      ref: "plan",
    }
  },
  { timestamps: true }
);

module.exports.Notification = mongoose.model("notification", Notification);
