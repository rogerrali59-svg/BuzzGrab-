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
const SCHEMA = mongoose.Schema;

let CATEGORY_MODEL_SCHEMA = new SCHEMA(
  {
    title: {
      type: String,
    },

    description: {
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

    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

function validateAddCategory(data) {
    const JoiSchema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(), 
        image: Joi.string().optional()
        
    });
  
    return JoiSchema.validate(data);
  }

module.exports.CATEGORY_MODEL = mongoose.model("category", CATEGORY_MODEL_SCHEMA);
module.exports.validateAddCategory = validateAddCategory;
