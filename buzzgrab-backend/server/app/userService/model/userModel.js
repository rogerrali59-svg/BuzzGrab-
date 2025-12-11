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
const Joi = require("joi");
let SCHEMA = mongoose.Schema;
let { CONST } = require("../../../helpers/constant");
let user = new SCHEMA(
  {
    fullName: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    otp: {
      type: Number,
      default: 0,
    },
    reason: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    dob: {
      type: String,
    },
    about: {
      type: String,
    },
    address: {
      type: String,
    },
    isAddress: {
      type: Boolean,
      default: false,
    },
    postalCode: {
      type: Number,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isNotify: {
      type: Boolean,
      default: false,
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
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    userIP: {
      type: String,
    },
    token: {
      type: String,
      default: "",
    },
    deviceName: {
      type: String,
    },
    deviceToken: {
      type: String,
      default: "",
    },
    isTermsCondition: {
      type: Boolean,
      default: false,
    },
    isNotificationOn: {
      type: Number,
      enum: [CONST.NOTIFICATION_OFF, CONST.NOTIFICATION_ON],
      default: CONST.NOTIFICATION_OFF,
    },
    deviceType: {
      type: Number,
      enum: [CONST.WEB, CONST.ANDROID, CONST.IOS],
      default: CONST.WEB,
    },
    gender: {
      type: Number,
      enum: [CONST.MALE, CONST.FEMALE, CONST.OTHERS],
    },
    roleId: {
      type: Number,
      enum: [CONST.ADMIN, CONST.SUB_ADMIN, CONST.USER, CONST.DRIVER],
      default: CONST.USER,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED, CONST.BAN],
      default: CONST.ACTIVE,
    },
    reasonId: {
      type: mongoose.Types.ObjectId,
      ref: "accountdeletereason",
    },
    reasonDescription: {
      type: String,
    },
    customerId: {
      type: String,
    },
    isSubscriptionBuy: {
      type: Boolean,
      default: false,
    },
    otpExpiration: {
      type: Date,
    },
    uniqueUserId: {
      type: String,
      required: true,
      unique: true,
      default: generateOrderId,
    },
    longitude: {
      type: String,
    },
    latitude: {
      type: String,
    },

    socialType: {
      type: "string",
      enum: ["facebook", "google", "apple"],
    },
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    appleId: {
      type: String,
    },
    isFreeTrial: {
      type: Boolean,
      default: false,
    },
    IOSCode: {
      type: String,
    },
    frontImg: {
      type: String,
    },
    isFrontImgVerified: {
      type: Number,
      enum: [
        CONST.DOC_VERIFY.PENDING,
        CONST.DOC_VERIFY.APPROVED,
        CONST.DOC_VERIFY.REJECTED,
      ],
      default: CONST.PENDING,
    },
    backImg: {
      type: String,
    },
    isBackImgVerified: {
      type: Number,
      enum: [
        CONST.DOC_VERIFY.PENDING,
        CONST.DOC_VERIFY.APPROVED,
        CONST.DOC_VERIFY.REJECTED,
      ],
      default: CONST.PENDING,
    },
    liveSelfyImg: {
      type: String,
    },
    isLiveSelfyImgVerified: {
      type: Number,
      enum: [
        CONST.DOC_VERIFY.PENDING,
        CONST.DOC_VERIFY.APPROVED,
        CONST.DOC_VERIFY.REJECTED,
      ],
      default: CONST.PENDING,
    },
    type: {
      type: String,
    },
    vehicleImg: {
      type: String,
    },
    isVehicleImgVerified: {
      type: Boolean,
      default: false,
    },
    vehicleRegistrationImg: {
      type: String,
    },
    isVehicleRegistrationVerified: {
      type: Boolean,
      default: false,
    },
    insuranceImg: {
      type: String,
    },
    isInsuranceVerified: {
      type: Boolean,
      default: false,
    },
    store: {
      type: mongoose.Types.ObjectId,
      ref: "store",
    },
  },
  { timestamps: true }
);
user.index({ location: "2dsphere" });

/**
 * Declear the schema for user SMS records
 */
const userSmsSchema = new SCHEMA(
  {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    message: {
      type: String,
      default: "",
    },
    sid: {
      type: String,
      default: "",
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

//function to validate the admin
function validateSignup(admin) {
  const JoiSchema = Joi.object({
    firstName: Joi.string().allow("").empty("").optional(),
    lastName: Joi.string().allow("").empty("").optional(),
    email: Joi.string().max(50).email().required(),
    countryCode: Joi.string().min(2).max(5).required(),
    mobile: Joi.string().min(6).max(15).required(),
    password: Joi.string().min(5).max(50).required(),
    deviceToken: Joi.string().allow("").empty("").optional(),
    isNotificationOn: Joi.number().allow("").empty("").optional(),
    deviceType: Joi.number().allow("").empty("").optional(),
  }).unknown();

  return JoiSchema.validate(admin);
}

function validateLogin(loginData) {
  const JoiSchema = Joi.object()
    .keys({
      email: Joi.string().email().optional(),
      password: Joi.string().min(5).max(50).required(),
      roleId: Joi.number()
        .valid(CONST.ADMIN, CONST.SUB_ADMIN, CONST.USER, CONST.DRIVER)
        .optional(),
      mobile: Joi.string().min(6).max(15).optional(),
      countryCode: Joi.string().min(2).max(5).optional(),
    })
    .unknown()
    .xor("email", "mobile");
  return JoiSchema.validate(loginData);
}

function validateForgotPassword(data) {
  const JoiSchema = Joi.object()
    .keys({
      email: Joi.string().allow("").empty("").optional(),
      mobile: Joi.string().min(6).max(15).allow("").empty("").optional(),
      countryCode: Joi.string().min(2).max(15).allow("").empty("").optional(),
      // countryCode: Joi.string().min(2).max(5).optional(),
    })
    .xor("email", "mobile")
    .with("mobile", "countryCode");
  return JoiSchema.validate(data);
}

function validateChangePassword(data) {
  const JoiSchema = Joi.object()
    .keys({
      password: Joi.string().min(5).max(50).required(),
      oldPassword: Joi.string().min(5).max(50).required(),
    })
    .unknown();
  return JoiSchema.validate(data);
}

function validateEditProfile(data) {
  const JoiSchema = Joi.object({
    firstName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .message("First name cannot contain special characters")
      .optional(),
    lastName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .message("Last name cannot contain special characters")
      .optional(),
    email: Joi.string().email().optional(),
    about: Joi.string().optional().allow(""),
    country: Joi.string().optional(),
    fullName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .message("Full name cannot contain special characters")
      .optional(),
    mobile: Joi.string()
      .min(6)
      .max(15)
      .pattern(/^\+?\d+$/)
      .message("Phone number must be a valid number")
      .optional(),
    countryCode: Joi.string().min(2).max(5).optional(),
    profileImg: Joi.string().optional(),
    longitude: Joi.string().optional(),
    latitude: Joi.string().optional(),
    gender: Joi.number()
      .valid(CONST.MALE, CONST.FEMALE, CONST.OTHERS)
      .optional(),
  }).unknown();
  return JoiSchema.validate(data);
}

function validateUserEditProfile(data) {
  const JoiSchema = Joi.object({
    firstName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .message("First name cannot contain special characters")
      .optional(),
    lastName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .message("Last name cannot contain special characters")
      .optional(),
    email: Joi.string().email().optional(),
    about: Joi.string().optional(),
    fullAddress: Joi.string()
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .message(
        "Address can only contain letters, numbers, spaces, commas, periods, and hyphens."
      )
      .optional(),
    postalCode: Joi.number().optional(),
    city: Joi.string().optional(),
    country: Joi.string().optional(),
    stateName: Joi.string().optional(),
    fullName: Joi.string()
      .min(1)
      .max(50)
      .pattern(/^[a-zA-Z0-9\s]+$/)
      .message("Full name cannot contain special characters")
      .optional(),
    mobile: Joi.string()
      .min(6)
      .max(15)
      .pattern(/^\+?\d+$/)
      .message("Phone number must be a valid number")
      .optional(),
    countryCode: Joi.string().min(2).max(5).optional(),
    profileImg: Joi.string().optional(),
  }).unknown();
  return JoiSchema.validate(data);
}

module.exports.USER = mongoose.model("user", user);
module.exports.validateSignup = validateSignup;
module.exports.validateLogin = validateLogin;
module.exports.validateForgotPassword = validateForgotPassword;
module.exports.validateChangePassword = validateChangePassword;
module.exports.validateEditProfile = validateEditProfile;
module.exports.validateUserEditProfile = validateUserEditProfile;
module.exports.userSmsLogs = mongoose.model("userSmsLogs", userSmsSchema);

function generateOrderId() {
  const digits = "0123456789";
  let orderId = "UR";

  for (let i = 0; i < 8; i++) {
    orderId += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return orderId;
}
