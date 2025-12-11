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
const SCHEMA = mongoose.Schema;
const { CONST } = require("../../../helpers/constant");

const testimonial = new SCHEMA(
  {
    name: {
      type: String,
    },
    profession: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    description: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports.TESTIMONIAL = mongoose.model("testimonial", testimonial);
