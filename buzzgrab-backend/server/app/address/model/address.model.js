/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const schema = mongoose.Schema;
const address = new schema(
  {
    name: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    mobile: {
      type: String,
    },
    house: {
      type: String,
    },
    building: {
      type: String,
    },
    landMark: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    isDefault: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.ADDRESS = mongoose.model("address", address);
