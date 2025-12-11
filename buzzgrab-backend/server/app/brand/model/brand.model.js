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
const SCHEMA = mongoose.Schema;
const Joi = require("joi");

let brandSchema = new SCHEMA(
  {
    title: {
      type: String,
    },

    image: {
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

function validateAddBrand(data) {
  const JoiSchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().optional(),
  }).unknown();

  return JoiSchema.validate(data);
}

module.exports.BRAND_MODEL = mongoose.model("brand", brandSchema);
module.exports.validateAddBrand = validateAddBrand;
