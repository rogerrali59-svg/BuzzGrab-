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
const { CONST } = require("../../../helpers/constant");
let SCHEMA = mongoose.Schema;

/**
 * Declear the schema for faq model
 */
const PLAN_SCEMA = new SCHEMA(
  {
    name: {
      type: String,
    },
    productId: {
      type: String,
    },
    priceId: {
      type: String,
    },
    interval: {
      type: String,
    },
    currency: {
      type: String,
    },
    amount: {
      type: Number,
    },
    insertDate: {
      type: Number,
    },
    planType: {
      type: Number,
      enum: [CONST.PLAN_TYPE.MONTH, CONST.PLAN_TYPE.THREE_MONTH, CONST.PLAN_TYPE.SIX_MONTH, CONST.PLAN_TYPE.YEAR],
      default: CONST.PLAN_TYPE.MONTH
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    // features: [String],
    features: {
      type: String
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED], // ACTIVE => 1, INACTIVE => 2, DELETED => 3
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.PLAN = mongoose.model("plan", PLAN_SCEMA);
