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
const schema = mongoose.Schema;
const order = new schema(
  {
    products: [
      {
        items: {
          type: mongoose.Types.ObjectId,
          ref: "products",
        },
        productName: {
          type: String,
        },
        productImg: [
          {
            url: {
              type: String,
            },
            type: { type: String },
          },
        ],
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
        size: {
          type: String,
        },
        isRefund: {
          type: Boolean,
          default: false,
        },
      },
    ],
    promoAmount: {
      type: Number,
    },
    orderId: {
      type: Number,
    },
    deliveryCharge: {
      type: Number,
    },
    subTotal: {
      type: Number,
    },
    total: {
      type: Number,
    },
    fullName: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    promocode: {
      type: mongoose.Types.ObjectId,
      ref: "promocode",
    },
    couponCode: {
      type: mongoose.Types.ObjectId,
      ref: "coupon",
    },
    address: {
      type: mongoose.Types.ObjectId,
      ref: "address",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    reason: {
      type: String,
    },
    isScan: {
      type: Boolean,
    },
    deliveryStatus: {
      type: Number,
      enum: [
        CONST.ORDER_STATEID.PENDING,
        CONST.ORDER_STATEID.READY,
        CONST.ORDER_STATEID.SHIPPED,
        CONST.ORDER_STATEID.COMPLETED,
        CONST.ORDER_STATEID.CANCELED,
        CONST.ORDER_STATEID.UNDERPROCESS,
        CONST.ORDER_STATEID.ORDERDELETED,
      ],
      default: CONST.ORDER_STATEID.PENDING,
    },
    paymentStatus: {
      type: String,
    },
    purchaseCount: {
      type: Number,
    },
    orderTracking: [
      {
        date: {
          type: String,
        },
        stateId: {
          type: Number,
          enum: [
            CONST.ORDER_STATEID.PENDING,
            CONST.ORDER_STATEID.READY,
            CONST.ORDER_STATEID.SHIPPED,
            CONST.ORDER_STATEID.COMPLETED,
            CONST.ORDER_STATEID.CANCELED,
          ],
          default: CONST.ORDER_STATEID.PENDING,
        },
      },
    ],
    store: {
      type: mongoose.Types.ObjectId,
      ref: "store",
    },
    paymentType: {
      type: Number,
      enum: [CONST.ONLINE, CONST.OFFLINE],
    },
    paymentIntentId: {
      type: String,
    },
    chargeId: {
      type: String,
    },
    paymentReturnType: {
      type: Number,
      enum: [CONST.WALLET, CONST.ACCOUNT],
      default: CONST.WALLET,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", order);
