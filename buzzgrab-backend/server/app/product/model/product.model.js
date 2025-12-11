/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
const Joi = require("joi");
const { CONST } = require("../../../helpers/constant");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product = new Schema(
  {
    productName: {
      type: String,
    },
    description: {
      type: String,
    },
    ingredients: {
      type: String,
    },
    productImg: [
      {
        url: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
    mrp: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    size: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "brand",
    },
    store: {
      type: mongoose.Types.ObjectId,
      ref: "store",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
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
    stateId: {
      type: Number,
      enum: [
        CONST.PRODUCT_STATE_ID.PENDING,
        CONST.PRODUCT_STATE_ID.ACTIVE,
        CONST.PRODUCT_STATE_ID.INACTIVE,
        CONST.PRODUCT_STATE_ID.DELETED,
        CONST.PRODUCT_STATE_ID.OUT_OF_STOCK,
      ],
      default: CONST.PRODUCT_STATE_ID.ACTIVE,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

product.index({ location: "2dsphere" });
module.exports.PRODUCT = mongoose.model("product", product);

function productAddValidation(data) {
  const JoiSchema = Joi.object({
    productName: Joi.string().trim().min(2).max(100).required().messages({
      "string.base": "Product name must be a string",
      "string.empty": "Product name is required",
      "any.required": "Product name is required",
    }),

    description: Joi.string().allow(""),

    // price: Joi.number().positive().required().messages({
    //   "number.base": "Price must be a number",
    //   "number.positive": "Price must be greater than 0",
    //   "any.required": "Price is required",
    // }),
  }).unknown();

  return JoiSchema.validate(data);
}
function productUpdateValidation(data) {
  const JoiSchema = Joi.object({
    productName: Joi.string().trim(),
    description: Joi.string().allow(""),
    mrp: Joi.number().optional(),
  }).unknown();

  return JoiSchema.validate(data);
}

module.exports.productAddValidation = productAddValidation;
module.exports.productUpdateValidation = productUpdateValidation;
