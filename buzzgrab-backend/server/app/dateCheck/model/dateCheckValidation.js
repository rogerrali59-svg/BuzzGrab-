/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const Joi = require("joi");
const validation = {};

validation.dateCheckValidation = Joi.object({
 date: Joi.date().iso().required().messages({
      "string.base": "Date should be a valid date format",
      "string.empty": "Date cannot be an empty field",
      "any.required": "Date is a required field",
      "date.base": "Date must be a valid date",
      "date.format": "Date must follow a valid format (ISO 8601)",
    }),
});

module.exports = validation;
