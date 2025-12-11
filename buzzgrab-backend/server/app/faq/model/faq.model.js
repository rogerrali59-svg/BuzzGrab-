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
const Joi = require("joi");
let SCHEMA = mongoose.Schema;

/**
 * Declear the schema for faq model
 */
const faq = new SCHEMA(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED], // ACTIVE => 1, INACTIVE => 2, DELETED => 3
      default: CONST.ACTIVE,
    },
  },
  { timestamps: true }
);


function validateAddFAQ(data) {
  const JoiSchema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
  });

  return JoiSchema.validate(data);
}

function validateEditFAQ(data) {
    const JoiSchema = Joi.object({
      id:Joi.string().required(),
      question: Joi.string().required(),
      answer: Joi.string().required(),
    });
  
    return JoiSchema.validate(data);
  }

module.exports.FAQ_MODEL = mongoose.model("faq", faq);
module.exports.validateAddFAQ = validateAddFAQ;
module.exports.validateEditFAQ = validateEditFAQ;
