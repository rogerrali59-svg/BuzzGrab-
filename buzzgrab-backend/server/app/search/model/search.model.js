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

let SEARCH_MODEL_SCHEMA = new SCHEMA(
  {
    search: {
      type: String,
    },

    productId: {
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



module.exports.SEARCH_MODEL = mongoose.model("search", SEARCH_MODEL_SCHEMA);

