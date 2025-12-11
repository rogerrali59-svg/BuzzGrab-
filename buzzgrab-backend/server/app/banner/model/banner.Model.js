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
const Joi = require("joi");
let schema = mongoose.Schema;

let banner = new schema(
  {
    title: {
      type: String,
    },
    bannerImg: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [1, 2, 3], // 1 => ACTIVE, 2 => INACTIVE,
      default: 1,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

function validateAddBanner(data) {
  const JoiSchema = Joi.object({
    bannerImg: Joi.required(),
  });

  return JoiSchema.validate(data);
}

function validateEditBanner(data) {
  const JoiSchema = Joi.object({
    bannerImg: Joi.required(),
  });

  return JoiSchema.validate(data);
}

const BANNER = mongoose.model("banner", banner);

module.exports = { BANNER };
module.exports.validateAddBanner = validateAddBanner;
module.exports.validateEditBanner = validateEditBanner;
