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
const dateCheckSchema = new Schema(
  {
    date: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);

module.exports.DATE_CHECK = mongoose.model("dateCheckSchema", dateCheckSchema);
