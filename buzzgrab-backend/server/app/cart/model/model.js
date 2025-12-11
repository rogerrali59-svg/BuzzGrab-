/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cart = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    deviceToken: {
      type: String,
    },
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    size: {
      type: String,
    },
    shippingCharge: {
      type: Number,
    },
    promocode: {
      type: mongoose.Types.ObjectId,
      ref: "promocode",
    },
    store: {
      type: mongoose.Types.ObjectId,
      ref: "store",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      default: null,
    },
    promotionApplied: {
      type: Boolean,
      default: false,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.CART = mongoose.model("cart", cart);
