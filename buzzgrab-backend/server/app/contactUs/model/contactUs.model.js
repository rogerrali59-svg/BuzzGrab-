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
const { CONST } = require("../../../helpers/constant");
const schema = mongoose.Schema;

const contactus = new schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    reply: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [CONST.NEW, CONST.REPLIED],
      default: CONST.NEW,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

function validateAddContact(data) {
  const JoiSchema = Joi.object({
    fullName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[A-Za-z\s]+$/)
      .message("Full Name cannot contain special characters and number.")
      .required(),
    email: Joi.string()
      .max(50)
      .email({ tlds: { allow: false } })
      .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/)
      .message("Enter a valid email.")
      .required(),
    subject: Joi.string()
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .message("Subject cannot contain special characters.")
      .min(2)
      .max(30)
      .optional(),
    message: Joi.string().min(2).max(500).required(),
  }).unknown();

  return JoiSchema.validate(data);
}

module.exports.CONTACTUS = mongoose.model("contactus", contactus);
module.exports.validateAddContact = validateAddContact;
