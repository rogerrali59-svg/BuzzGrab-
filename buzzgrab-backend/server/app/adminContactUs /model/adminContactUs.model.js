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
const Joi = require("joi")
const { CONST } = require("../../../helpers/constant");
const schema = mongoose.Schema;

const contactus = new schema(
  {
    
    email: {
      type: String,
    },
    facebookLink: {
      type: String,
    },
    instaLink: {
      type: String,
    },
    twitterLink: {
      type: String,
    },
    linkedinLink: {
      type: String,
    },
    countryCode: {
      type: String
    },
    mobile: {
      type: String,
    },
    address:{
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
  {
    timestamps: true,
  }
);



module.exports.CONTACTUS = mongoose.model("admincontactus", contactus);

