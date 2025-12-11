/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
let mongoose = require("mongoose");
let SCHEMA = mongoose.Schema;
let { CONST } = require("../../../helpers/constant");

let promocode = new SCHEMA(
  {
    promoCode: {
      type: String,
    },

    discount: {
      type: Number,
    },

    minPurchaseAmount: {
      type: Number,
    },

    maxDiscountAmount: {
      type: Number,
    },

    numberOfUsed: {
      type: Number,
    },

    numberOfUsedUser: {
      type: Number,
    },

    uesdUserCount: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        count: {
          type: Number,
          default: 0,
        },
      },
      { _id: false },
    ],

    forFreeDelivery: {
      type: Boolean,
    },

    startDate: {
      type: String,
    },

    endDate: {
      type: String,
    },

    actionType: {
      type: Number,
      enum: [CONST.PROMOTION, CONST.CASHBACK],
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },

    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
    },
  },
  { timestamps: true }
);

module.exports.PROMO_CODE = mongoose.model("promocode", promocode);
