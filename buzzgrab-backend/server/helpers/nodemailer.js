/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

const nodemailer = require("nodemailer");
const { EMAIL_LOGS } = require("../app/errorLogs/model/logModal");
const { CONST } = require("../helpers/constant");
const {
  FORGOT_PASSWORD_OTP,
  ADD_USER_MAIL,
  WELCOME_EMAIL_TEMPLATE,
  ACCOUNT_VERIFICATION_TEMPLATE,
  WELCOME_NOTIFY_EMAIL_TEMPLATE_FOR_ADMIN,
  DELETED_ACCOUNT,
  BOOKING_CONFIRMATION_EMAIL,
  ACCOUNT_VERIFY_TEMPLATE,
  VOUCHER_OTP,
  REPLY_MESSAGE_TEMPLATE,
  FORGOT_PASSWORD_TEMPLATE,
  EXPIRE_REMINDER,
  EXPIRE_SUBSCRIPTION,
} = require("../helpers/email_template");
const { SMTP } = require("../app/smtp/model/smtp.model");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  async sendMail(to, subject, html) {
    const smtpData = await SMTP.findOne({ state: CONST.ACTIVE });

    const smtp = {
      host: smtpData?.host ? smtpData?.host : process.env.SMTP_HOST,
      port: smtpData?.port ? smtpData?.port : process.env.SMTP_PORT,
      email: smtpData?.email ? smtpData?.email : process.env.SMTP_AUTH_EMAIL,
      password: smtpData?.password
        ? smtpData?.password
        : process.env.SMTP_AUTH_PASSWORD,
    };

    const transporter = nodemailer.createTransport({
      // create smtp protocol values
      host: smtp.host,
      port: smtp.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtp.email,
        pass: smtp.password,
      },
    });

    let mailOptions = {
      // set data for mail options
      from: `BuzzGrab Support ${smtp.email}`,
      to: to,
      subject: subject,
      html: html,
    };

    return new Promise(function (resolve, reject) {
      // use send mail function to send mail to other user
      transporter.sendMail(mailOptions, async (err, res) => {
        if (err) {
          reject(Error(err.Error));
          const result = EMAIL_LOGS({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            description: html,
            stateId: CONST.FAILED,
          }).save();
          resolve(null);
        } else {
          // else send success into resolve
          const result = EMAIL_LOGS({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            description: html,
            stateId: CONST.SUCCESS,
          }).save();
          resolve(0);
        }
      });
    });
  },

  async sendMailByUser(from, subject, html) {
    const smtpData = await SMTP.findOne({ state: CONST.ACTIVE });

    const smtp = {
      host: smtpData?.host ? smtpData?.host : process.env.SMTP_HOST,
      port: smtpData?.port ? smtpData?.port : process.env.SMTP_PORT,
      email: smtpData?.email ? smtpData?.email : process.env.SMTP_AUTH_EMAIL,
      password: smtpData?.password
        ? smtpData?.password
        : process.env.SMTP_AUTH_PASSWORD,
    };

    const transporter = nodemailer.createTransport({
      // create smtp protocol values
      host: smtp.host,
      port: smtp.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtp.email,
        pass: smtp.password,
      },
    });

    let mailOptions = {
      // set data for mail options
      from: from,
      to: smtp.email,
      subject: subject,
      html: html,
    };

    return new Promise(function (resolve, reject) {
      // use send mail function to send mail to other user
      transporter.sendMail(mailOptions, async (err, res) => {
        if (err) {
          reject(Error(err.Error));
          const result = EMAIL_LOGS({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            description: html,
            stateId: CONST.FAILED,
          }).save();
          resolve(null);
        } else {
          // else send success into resolve
          const result = EMAIL_LOGS({
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject,
            description: html,
            stateId: CONST.SUCCESS,
          }).save();
          resolve(0);
        }
      });
    });
  },

  async signUp(email, username, otp) {
    const subject = "Verify Email !";
    const html = ACCOUNT_VERIFICATION_TEMPLATE(username, otp);
    const sendMail = this.sendMail(email, subject, html);
  },

  async bookingEmail(email, username, bookingData) {
    const subject = "Booking confirmation !";
    const html = BOOKING_CONFIRMATION_EMAIL(username, bookingData);
    const sendMail = this.sendMail(email, subject, html);
  },

  async welcomeMail(email, username, countryCode, mobile) {
    const subject = "Welcome email";
    const html = WELCOME_EMAIL_TEMPLATE(username, email, countryCode, mobile);
    const sendMail = this.sendMail(email, subject, html);
  },

  async approvedUser(email, username, countryCode, mobile) {
    const subject = "Verify email";
    const html = ACCOUNT_VERIFY_TEMPLATE(username, email, countryCode, mobile);
    const sendMail = this.sendMail(email, subject, html);
  },

  async forgotPassword(email, username, otp) {
    const subject = "Otp for restore password";
    const html = FORGOT_PASSWORD_OTP(username, otp);
    let sendMail = this.sendMail(email, subject, html);
  },

  async resendOtp(email, username, otp) {
    const subject = "Resend Otp";
    const html = FORGOT_PASSWORD_OTP(username, otp);
    let sendMail = this.sendMail(email, subject, html);
  },

  async voucherOtp(email, username, otp) {
    const subject = "Voucher Otp";
    const html = VOUCHER_OTP(username, otp);
    let sendMail = this.sendMail(email, subject, html);
  },

  async reminderExpireProduct(
    productName,
    productImg,
    expireDate,
    user,
    email
  ) {
    const subject = "Expire Product";
    const html = EXPIRE_REMINDER(productName, productImg, expireDate, user);
    let sendMail = this.sendMail(email, subject, html);
  },

  async subscriptionExpire(email, name, amount, date) {
    const subject = "Expire Subcription";
    const html = EXPIRE_SUBSCRIPTION(email, name, amount, date);
    let sendMail = this.sendMail(email, subject, html);
  },

  async notificationMailForAdminRegardingNewUserRagiester(
    userName,
    email,
    countryCode,
    mobile,
    adminEmail
  ) {
    const subject = "New User register";
    const html = WELCOME_NOTIFY_EMAIL_TEMPLATE_FOR_ADMIN(
      userName,
      email,
      countryCode,
      mobile
    );
    const sendMail = this.sendMail(adminEmail, subject, html);
  },

  async addUser(email, password) {
    const subject = `Login credential for ${process.env.PROJECT_NAME}`;
    const html = ADD_USER_MAIL(email, password);
    const sendMail = this.sendMail(email, subject, html);
  },

  async deleteUserAccount(email, deleteAccountUrl) {
    const subject = `Request to close your account`;
    const html = DELETED_ACCOUNT(email, deleteAccountUrl);
    const sendMail = this.sendMail(email, subject, html);
  },

  async replyMeassage(userEmail, message) {
    const subject = `Reply Message`;
    const html = REPLY_MESSAGE_TEMPLATE(message);
    const sendMail = this.sendMail(userEmail, subject, html);
  },

  async sendRequestLinkForForgotPassword(email, forgotPasswordLink) {
    const subject = `Forgot Password`;
    const html = FORGOT_PASSWORD_TEMPLATE(email, forgotPasswordLink);
    this.sendMail(email, subject, html);
  },

  async smtpCredential() {
    const smtpData = await SMTP.findOne({ state: CONST.ACTIVE });

    const smtp = {
      host: smtpData?.host || process.env.SMTP_HOST,
      port: smtpData?.port || process.env.SMTP_PORT,
      email: smtpData?.email || process.env.SMTP_AUTH_EMAIL,
      password: smtpData?.password || process.env.SMTP_AUTH_PASSWORD,
    };

    return smtp;
  },
};
