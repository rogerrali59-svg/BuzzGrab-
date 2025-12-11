/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

const { default: mongoose } = require("mongoose");
const { CONST } = require("../../../helpers/constant");
/*Error log schema*/
const errorLogs = new mongoose.Schema(
  {
    errorCode: {
      type: String,
    },
    errorName: {
      type: String,
    },
    description: {
      type: String,
    },
    url:{
        type: String
    },

    error_type: {
      type: Number,
      enum: [CONST.ERROR_TYPE.API, CONST.ERROR_TYPE.APP, CONST.ERROR_TYPE.WEB],
      default: CONST.ERROR_TYPE.API,
    },
    stateId: {
      type: Number,
      enum: [CONST.ACTIVE, CONST.INACTIVE, CONST.DELETED],
      default: CONST.ACTIVE,
    },
    typeId: {
      type: Number,
      enum: [CONST.SUCCESS, CONST.ERROR],
      default: CONST.ERROR,
    },
    apiEndpoint: {
      type: String,
    },
    methodUsed: {
      type: String,
    },
    error: {
      type: String,
    },
    ip: {
      type: String,
    },
    link: {
      type: String,
    },
    refererLink: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    headers: {
      type: Object,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
     
    },
    body: {
      type: Object,
    },
    response: {
      type: Object,
    },
  },
  { timestamps: true }
);

const EmailLogsSchema = new mongoose.Schema(
  {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
    },
    stateId: {
      type: Number,
      enum: [CONST.SUCCESS, CONST.PENDING, CONST.FAILED],
    },
  },
  {
    timestamps: true,
  }
);

module.exports.EMAIL_LOGS = mongoose.model("email", EmailLogsSchema);
module.exports.Error_Logs = mongoose.model("errorLogs", errorLogs);
