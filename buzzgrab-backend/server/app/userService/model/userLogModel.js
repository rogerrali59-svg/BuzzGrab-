/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;
let { CONST } = require("../../../helpers/constant");

let loginActivity = new SCHEMA(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    userIP: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    failedReason: {
      type: String,
      default: "",
    },

    loginAt: {
      type: Date,
      default: Date.now,
    },

    deviceType: {
      type: Number,
      enum: [CONST.WEB, CONST.ANDROID, CONST.IOS],
      default: CONST.WEB,
    },

    state: {
      type: String,
      enum: [CONST.LOGIN, CONST.LOGIN_FAIL],
    },
  },
  { timestamps: true }
);

module.exports.LOGIN_ACTIVITY = mongoose.model("loginActivity", loginActivity);
