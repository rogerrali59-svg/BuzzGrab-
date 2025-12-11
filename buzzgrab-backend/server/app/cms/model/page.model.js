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

let PAGE_MODEL_SCHEMA = new SCHEMA(
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

    typeId: {
      type: Number,
      enum: [CONST.ABOUT, CONST.TERMS, CONST.PRIVACY, CONST.OTHER_PAGE],
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

function validateAddCMS(data) {
    const JoiSchema = Joi.object({
        title: Joi.string()
        .max(50)
        .required(), // Optional field
        description: Joi.string(),
        //     .required(), // Optional field
        
        typeId: Joi.number()
            .valid(CONST.ABOUT, CONST.TERMS, CONST.PRIVACY, CONST.CANCEL_POLICY)
            .required(), // Required field
    });
  
    return JoiSchema.validate(data);
  }

module.exports.PAGE_MODEL = mongoose.model("page", PAGE_MODEL_SCHEMA);
module.exports.validateAddCMS = validateAddCMS;
