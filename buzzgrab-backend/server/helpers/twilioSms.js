/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

const dotenv = require("dotenv");
const { userSmsLogs } = require("../app/userService/model/userModel");
const { TWILIO } = require("../app/smtp/model/smtp.model");
const { CONST } = require("./constant");
dotenv.config();

const twilioData = async()=>
{
  return await TWILIO.findOne({stateId: CONST.ACTIVE})
}

const accountSid = twilioData?.sid || process.env.TWILLIO_ACCOUNT_SID;
const authToken = twilioData?.token || process.env.TWILLIO_AUTH_TOKEN;
const twilioNumber = twilioData?.number || process.env.TWILLIO_PHONE_NUMBER;

const client = require("twilio")(accountSid, authToken);

const sendSMS = (to, body) => {
  client.messages.create(
    {
      body: body,
      from: twilioNumber,
      to: to,
    },
    async (twilioErr, twilioResult) => {
      if (twilioErr) {
        console.log("Twillio error", twilioErr);
        await userSmsLogs.create({
          from: twilioNumber,
          to: to,
          message: body,
          errorMessage: twilioErr,
        });
      } else {
        await userSmsLogs.create({
          from: twilioResult.from,
          to: twilioResult.to,
          message: twilioResult.body,
          sid: twilioResult.sid,
          errorMessage: twilioResult.errorMessage,
        });
      }
    }
  );
  
};

const twilioCredential = async () =>{
  const twilioData = await TWILIO.findOne({ state: CONST.ACTIVE });

  const twilio = {
    accountSid : twilioData?.sid || process.env.TWILLIO_ACCOUNT_SID,
    authToken :  twilioData?.token || process.env.TWILLIO_AUTH_TOKEN,
    twilioNumber : twilioData?.number || process.env.TWILLIO_PHONE_NUMBER
  };

  return twilio;
}


module.exports.sendSMS = sendSMS;
module.exports.TWILIO = twilioCredential;

