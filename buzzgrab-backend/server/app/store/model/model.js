/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
const { CONST } = require("../../../helpers/constant");
const SCHEMA = mongoose.Schema;

let store = new SCHEMA(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    coverImg: {
      type: String,
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
    address: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    subAdmin: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    totalAverageRating: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports.STORE_MODEL = mongoose.model("store", store);
