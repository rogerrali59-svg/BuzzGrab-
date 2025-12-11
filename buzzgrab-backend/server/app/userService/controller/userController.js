/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
let { USER, userSmsLogs } = require("../model/userModel");
let { LOGIN_ACTIVITY } = require("../model/userLogModel");
let { CONST } = require("../../../helpers/constant");
let nodemailer = require("../../../helpers/nodemailer");
const { Error_Logs } = require("../../errorLogs/model/logModal");
let setResponseObject =
  require("../../../middleware/commonFunction").setResponseObject;
const {
  getHashPassword,
  generateOTP,
  comparePasswords,
} = require("../../../middleware/commonFunction");
const { HTTP } = require("../../../helpers/http-status-code");
const { Notification } = require("../../notification/model/notification.model");
const {
  FOUND_SUCCESS,
  PASSWORD_CANNNOT_SAME,
  ADD_SUCCESS,
  ADD_FAILED,
} = require("../../../middleware/responseMessage");
const secret_key = process.env.STRIPE_API_KEY;
const stripe = require("stripe")(secret_key);
const {
  validateSignup,
  validateLogin,
  validateForgotPassword,
  validateChangePassword,
  validateEditProfile,
} = require("../model/userModel");
const { formatErrorResponse } = require("../../../helpers/schedulers");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const { sendSMS, TWILIO } = require("../../../helpers/twilioSms");
const { BANNER } = require("../../banner/model/banner.Model");
const { PLAN } = require("../../plan/model/plan.model");
const { CATEGORY_MODEL } = require("../../category/model/cetegory.model");
const fs = require("fs");
const dir1 = "../uploads/userReport";
const ExcelJS = require("exceljs");
const moment = require("moment");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
let dotenv = require("dotenv");
const { BRAND_MODEL } = require("../../brand/model/brand.model");
dotenv.config();

let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

const rateLimiter = new RateLimiterMemory({
  points: 5, // Maximum number of attempts
  duration: 60, // Within 1 minute
});

let _user = {};

/*SOCIAL LOGIN*/
_user.socialLogin = async (req, res, next) => {
  try {
    let data = req.body;

    let existingUser = null;

    if (req.body.googleId) {
      existingUser = await USER.findOne({
        googleId: req.body.googleId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    // If user doesn't exist based on Google ID, check Facebook ID
    if (!existingUser && req.body.facebookId) {
      existingUser = await USER.findOne({
        facebookId: req.body.facebookId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    // If user doesn't exist based on Facebook ID, check Apple ID
    if (!existingUser && req.body.appleId) {
      existingUser = await USER.findOne({
        appleId: req.body.appleId,
        stateId: { $ne: CONST.DELETED },
      });
    }

    if (data.email) {
      existingUser = await USER.findOne({
        email: data.email,
        stateId: { $ne: CONST.DELETED },
      });
    }

    if (existingUser) {
      if (existingUser?.roleId == Number(data?.roleId)) {
        let token_Data = {
          userId: existingUser?._id,
          email: existingUser?.email,
          roleId: existingUser?.roleId,
        };
        let token = jwt.sign(token_Data, process.env.JWT_SECRET);
        let updateData = {
          lastVisitTime: Date.now(),
          token: token,
          isVerified: true,
          stateId: CONST.ACTIVE,
        };

        if (existingUser.customerId == undefined) {
          const customer = await stripe.customers.create({
            name: "User",
          });
          updateData.customerId = customer?.id;
        }

        let record = await USER.findOneAndUpdate(
          { _id: existingUser._id },
          updateData,
          { new: true }
        );

        await setResponseObject(req, true, "Login Successfully", record);
        next();
      } else {
        return res.status(400).send({ message: "This email is already taken" });
      }
    } else {
      data.isVerified = true;
      data.stateId = CONST.ACTIVE;
      if (req.body.socialType == "apple") {
        data.profileImg = data?.profileImage ?? "";
        const [firstName, lastName] = data?.fullName?.split(" ");
        data.firstName = firstName ?? "";
        data.lastName = lastName ?? "";
        data.email = data?.email ?? "";

        data.roleId = data?.roleId ?? "";
      }
      const customer = await stripe.customers.create({
        name: "User",
      });
      data.customerId = customer?.id;

      data.firstName = data?.firstName ? data?.firstName : "";
      data.lastName = data?.lastName ? data.lastName : "";

      let signupUser = await new USER(data).save();
      let token_Data = {
        userId: signupUser?._id,
        email: signupUser?.email,
        roleId: signupUser?.roleId,
      };
      let token = jwt.sign(token_Data, process.env.JWT_SECRET);
      signupUser.token = token;
      let record = await signupUser.save();
      await setResponseObject(req, true, "Login Successfully", record);
      next();
    }
  } catch (error) {
    console.log("error========>", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER SIGNUP*/
_user.signup = async (req, res, next) => {
  try {
    let data = req.body;

    data.email = data?.email?.toLowerCase().trim();
    const { error } = validateSignup(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });

    if (data.email) {
      let emailExists = await USER.findOne({
        email: data?.email,
        stateId: { $ne: CONST.DELETED },
      });
      if (emailExists) {
        return res.status(400).send({
          message: "Account already created with this email",
          success: false,
        });
      }
    }

    if (data.mobile || data.countryCode) {
      let mobileExists = await USER.findOne({
        $and: [{ mobile: data?.mobile }, { countryCode: data?.countryCode }],
        stateId: { $ne: CONST.DELETED },
      });
      if (mobileExists) {
        return res.status(400).send({
          message: "Account already created with this mobile number",
          success: false,
        });
      }
    }

    // data.fullName = data?.firstName + " " + data?.lastName;
    data.password = await getHashPassword(data.password);
    let randomNumber = generateOTP();
    data.otp = randomNumber;
    const otpExpirationTime = Date.now() + 5 * 60000;
    data.otpExpiration = otpExpirationTime;

    let signupUser = await new USER(data).save();

    if (!signupUser) {
      await setResponseObject(req, false, "Account not created");
      next();
    } else {
      let token_Data = {
        email: signupUser.email,
        userId: signupUser._id,
        roleId: signupUser.roleId,
      };

      let token = jwt.sign(token_Data, process.env.JWT_SECRET);

      let updateToken = await USER.findByIdAndUpdate(
        { _id: signupUser._id },
        { token: token },
        { new: true }
      );

      await nodemailer.welcomeMail(
        signupUser?.email,
        signupUser?.fullName,
        signupUser?.countryCode,
        signupUser?.mobile
      );
      await nodemailer.signUp(
        signupUser?.email,
        signupUser?.firstName ? signupUser?.firstName : signupUser?.fullName,
        randomNumber
      );

      // const recipientNumber = `${signupUser.countryCode}${signupUser.mobile}`;
      // const msg = ` ${signupUser?.otp} is your one-time password to access your Golfy account`;

      // await userSmsLogs.create({
      //   from: "+918976554312",
      //   to: recipientNumber,
      //   message: msg,
      // });

      /*Notification for the admin */
      const adminData = await USER.findOne({ roleId: CONST.ADMIN });

      await Notification({
        title: "New User Registration Alert",
        description: `New account created with this email ${signupUser.email}`,
        from: signupUser._id,
        to: adminData?._id,
      }).save();

      await setResponseObject(
        req,
        true,
        // "Your account has been created and OTP send on your register email.",
        `Your account has been created ${signupUser?.otp} is your verification code.`,
        {
          email: signupUser?.email,
          mobile: signupUser?.mobile,
          countryCode: signupUser?.countryCode,
          isProfileCompleted: signupUser?.isProfileCompleted,
          roleId: signupUser?.roleId,
          isVerified: signupUser?.isVerified,
          firstName: signupUser?.firstName,
          lastName: signupUser?.lastName,
          fullName: signupUser?.fullName,
          token: token,
          IOSCode: signupUser?.IOSCode,
          // isFrontImgVerified: signupUser?.isFrontImgVerified,
          // isBackImgVerified: isBackImgVerified?.isBackImgVerified,
          // isLiveSelfyImgVerified: signupUser?.isLiveSelfyImgVerified,
        }
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER VERIFY OTP*/
_user.verifyOtp = async (req, res, next) => {
  try {
    let data = req.body;
    let findUser;

    if (data.email) {
      findUser = await USER.findOne({
        email: data.email.toLowerCase(),
        stateId: { $ne: CONST.DELETED },
      }).lean();
    } else {
      findUser = await USER.findOne({
        mobile: data.mobile,
        countryCode: data.countryCode,
        stateId: { $ne: CONST.DELETED },
      }).lean();
    }

    if (!findUser) {
      await setResponseObject(
        req,
        false,
        "Account not found with this credentails."
      );
      next();
      return;
    }

    // OTP verification logic

    if (findUser?.otp == parseInt(data.otp)) {
      if (Date.now() > findUser?.otpExpiration) {
        await setResponseObject(
          req,
          false,
          "OTP has expired, please request a new one."
        );
        next();
        return;
      }

      const payload = {
        userId: findUser._id,
        email: findUser.email,
        roleId: findUser.roleId,
      };
      const token = await jwt.sign(payload, process.env.JWT_SECRET);

      const updateObj = {
        isVerified: true,
        token,
        failedAttempts: 0,
        stateId: CONST.ACTIVE,
      };

      const updateUser = await USER.findOneAndUpdate(
        { _id: findUser?._id },
        updateObj,
        { new: true }
      ).select("-password -otp -otpExpiration -failedAttempts -lockoutUntil");

      await setResponseObject(
        req,
        true,
        "OTP verified successfully",
        updateUser
      );
      next();
    } else {
      // let updateObj = {
      //   failedAttempts:
      //     (findUser?.failedAttempts ? findUser?.failedAttempts : 0) + 1,
      // };

      // if (updateObj.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      //   updateObj.lockoutUntil = Date.now() + LOCKOUT_TIME;
      // }

      // const updateUser = await USER.findOneAndUpdate(
      //   { _id: findUser?._id },
      //   updateObj,
      //   { new: true }
      // );

      await setResponseObject(req, false, "Invalid OTP");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*RESEND OTP*/
_user.resendOtp = async (req, res, next) => {
  try {
    const data = req.body;

    let findUser = {};
    if (data.email && data.email != "undefined") {
      data.email = data.email.toLowerCase();
      findUser = await USER.findOne({
        email: data.email,
        stateId: { $ne: CONST.DELETED },
      });
    }
    if (data.mobile && data.mobile != "undefined") {
      findUser = await USER.findOne({
        mobile: data.mobile,
        countryCode: data.countryCode,
        stateId: { $ne: CONST.DELETED },
      });
    }

    if (!findUser) {
      await setResponseObject(req, false, "User not found");
      next();
    } else {
      const otp = generateOTP();
      data.otp = otp;
      const otpExpirationTime = Date.now() + 5 * 60000;
      data.otpExpiration = otpExpirationTime;
      let updateOtp = {};

      if (data.email && data.email != "undefined") {
        updateOtp = await USER.findOneAndUpdate(
          { _id: findUser?._id },
          { otp: otp, otpExpiration: otpExpirationTime },
          {
            new: true,
          }
        ).select("otp -_id");
      }

      if (data.mobile && data.mobile != "undefined") {
        updateOtp = await USER.findOneAndUpdate(
          { _id: findUser?._id },
          { otp: otp, otpExpiration: otpExpirationTime },
          {
            new: true,
          }
        ).select("otp -_id");
      }

      if (updateOtp) {
        let message = "";

        if (data.email && data.email != "undefined") {
          const sendMail = await nodemailer.resendOtp(
            findUser.email,
            findUser.fullName,
            otp
          );

          // message = "An OTP has been resent to your registered email.";

          message = `${updateOtp?.otp} is your resent otp.`;
        }

        if (data.mobile && data.mobile != "undefined") {
          const twilio = await TWILIO();
          const recipientNumber = `${findUser.countryCode}${findUser.mobile}`;
          const msg = `${otp} is your one-time password to access your Golfy account`;

          // send otp on mobile
          if (twilio?.accountSid && twilio?.authToken && twilio?.twilioNumber) {
            await sendSMS(recipientNumber, msg);
            next();
          }

          // message = "An OTP has been resent to your registered mobile number.";
          message = `${updateOtp?.otp} is your resent otp.`;

          await userSmsLogs.create({
            from: twilio?.twilioNumber ? twilio?.twilioNumber : "+918976554312",
            to: recipientNumber,
            message: msg,
            stateId: CONST.ACTIVE,
          });
        }

        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: message,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Error occur when send resend OTP",
        });
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADMIN LOGIN */
_user.login = async (req, res, next) => {
  try {
    let data = req.body;
    const { error } = await validateLogin(data);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });
    let condition;
    if (data?.email && data.email != "undefined") {
      condition = {
        $and: [
          { email: data?.email?.toLowerCase() },
          { stateId: { $ne: CONST.DELETED } },
        ],
      };
    }

    //find data in user model
    const findUser = await USER.findOne(condition);

    if (!findUser) {
      data.loginAt = Date.now();
      data.failedReason = "Invalid login credentials.";
      data.state = CONST.LOGIN_FAIL;
      let ip = req.socket.localAddress;
      data.userIP =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      await LOGIN_ACTIVITY.create(data);
      await setResponseObject(req, false, "Invalid login credentials.", "");
      next();
      return;
    }
    if (
      (await comparePasswords(data?.password, findUser?.password)) === false
    ) {
      data.loginAt = Date.now();
      data.failedReason = "Invalid login credentials.";
      data.state = CONST.LOGIN_FAIL;
      let ip = req.socket.localAddress;
      data.userIP =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      await LOGIN_ACTIVITY.create(data);
      await setResponseObject(req, false, "Invalid login credentials.");
      next();
    } else {
      let token_Data = {
        email: findUser.email,
        userId: findUser._id,
        roleId: findUser.roleId,
      };

      let token = jwt.sign(token_Data, process.env.JWT_SECRET);

      data.user = findUser._id;
      data.loginAt = Date.now();
      data.state = CONST.LOGIN;
      let ip = req.ip;
      data.userIP =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      await LOGIN_ACTIVITY.create(data);

      await USER.findOneAndUpdate(
        { _id: findUser._id },
        { lastVisitTime: new Date().toJSON(), token: token },
        { new: true }
      );

      findUser.token = token;
      findUser.otp = undefined;

      const {
        password,
        otp,
        lastVisitTime,
        otpExpiration,
        deviceType,
        voucherLimit,
        isTermsCondition,
        isNotify,
        firstNameArabic,
        lastNameArabic,
        dateChecked,
        failedAttempts,
        ...userResponse
      } = findUser.toObject();

      if (userResponse?.profileImg) {
        userResponse.profileImg =
          process.env.IMAGE_BASE_URL + userResponse.profileImg;
      }

      await setResponseObject(req, true, "Login successfully", userResponse);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER LOGIN */
_user.userSignin = async (req, res, next) => {
  try {
    let data = req.body;

    const { error } = await validateLogin(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });
    let ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress.split(":")[3];
    data.userIP = ip;
    let findUser;

    if (data.email) {
      let email = data.email.toLowerCase();
      findUser = await USER.findOne({
        $and: [{ email: email }, { stateId: { $ne: CONST.DELETED } }],
      });
      if (!findUser) {
        await setResponseObject(
          req,
          false,
          "Account not exist with this email"
        );
        next();
      }
    }

    if (data.countryCode && data.mobile) {
      findUser = await USER.findOne({
        $and: [
          { countryCode: data.countryCode },
          { mobile: parseInt(data.mobile) },
          { stateId: { $ne: CONST.DELETED } },
        ],
      });
      if (!findUser) {
        await setResponseObject(
          req,
          false,
          "Account not exist with this mobile"
        );
        next();
      }
    }

    // if (findUser?.roleId == CONST.ADMIN)
    if (!findUser) {
      await setResponseObject(req, false, "You'r not authorized to login", "");
      next();
    }

    if (!findUser?.password) {
      data.loginAt = Date.now();
      data.failedReason = "Invalid login credentials.";
      data.stateId = CONST.LOGIN_FAIL;
      let ip =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      data.userIP = ip;
      await LOGIN_ACTIVITY.create(data);
      await setResponseObject(req, false, "Invalid login credentials");
      next();
      return;
    } else if (
      (await comparePasswords(data?.password, findUser?.password)) === false
    ) {
      data.loginAt = Date.now();
      data.failedReason = "Invalid login credentials.";
      data.stateId = CONST.LOGIN_FAIL;
      let ip = req.socket.localAddress;
      data.userIP =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      await LOGIN_ACTIVITY.create(data);
      await setResponseObject(req, false, "Invalid login credentials");
      next();
    } else if (findUser.roleId === CONST.USER && findUser.isVerified == false) {
      let randomNumber = generateOTP();
      const otpExpirationTime = Date.now() + 5 * 60000;

      await USER.findByIdAndUpdate(
        { _id: findUser._id },
        { otp: randomNumber, otpExpiration: otpExpirationTime },
        { new: true }
      );
      await nodemailer.signUp(
        findUser.email,
        findUser.fullName || "user",
        randomNumber
      );

      data.user = findUser._id;
      data.loginAt = Date.now();
      data.failedReason = "Account not verify";
      data.state = CONST.LOGIN_FAIL;
      let ip = req.socket.localAddress;
      data.userIP =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      await LOGIN_ACTIVITY.create(data);
      await setResponseObject(
        req,
        true,
        `Account not verify,${randomNumber} is your otp,!use it and verify account.`,
        findUser
      );
      next();
    } else if (findUser.stateId == CONST.INACTIVE) {
      data.user = findUser._id;
      data.loginAt = Date.now();
      data.failedReason = "Your Account is Inactive, Please contact Admin.";
      data.state = CONST.LOGIN_FAIL;
      let ip = req.socket.localAddress;
      data.userIP =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];
      await LOGIN_ACTIVITY.create(data);
      await setResponseObject(
        req,
        false,
        "Your Account is Inactive, Please contact Admin."
      );
      next();
    } else {
      let passwordMatch = await bcrypt.compare(
        data.password,
        findUser.password
      );
      if (!passwordMatch) {
        data.user = findUser._id;
        data.loginAt = Date.now();
        data.failedReason = "Invalid login credentials.";
        data.state = CONST.LOGIN_FAIL;
        let ip = req.socket.localAddress;
        data.userIP =
          req.header("x-forwarded-for") ||
          req.socket.remoteAddress.split(":")[3];
        await LOGIN_ACTIVITY.create(data);
        await setResponseObject(req, false, "Invalid login credentials.");
        next();
      }
      let token_Data = {
        email: findUser.email,
        userId: findUser._id,
        roleId: findUser.roleId,
      };

      // create token from token data passed
      let token = jwt.sign(token_Data, process.env.JWT_SECRET);

      data.user = findUser._id;
      data.loginAt = Date.now();
      data.state = CONST.LOGIN;

      let ip = req.ip;
      data.userIP =
        req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];

      await LOGIN_ACTIVITY.create(data);
      //update last Visit Time
      await USER.findOneAndUpdate(
        { _id: findUser._id },
        { lastVisitTime: new Date().toJSON(), token: token },
        { new: true }
      );

      if (findUser?.address) {
        findUser.address = findUser.address ? findUser.address : false;
      }

      findUser.token = token;
      await setResponseObject(req, true, "Login successfully", findUser);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER LOGOUT API*/
_user.logout = async (req, res, next) => {
  try {
    await USER.updateOne(
      { _id: req.userId },
      {
        $set: {
          token: "",
        },
      }
    );
    return res.status(HTTP.SUCCESS).send({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*EDIT USER'S OWN PROFILE*/
_user.profile = async (req, res, next) => {
  try {
    let findUser = await USER.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "stores",
          let: { id: "$store" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "store",
        },
      },
      {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          profileImg: 1,
          countryCode: 1,
          mobile: 1,
          isVerified: 1,
          roleId: 1,
          isProfileCompleted: 1,
          token: 1,
          IOSCode: 1,
          isNotificationOn: 1,
          frontImg: 1,
          isFrontImgVerified: 1,
          backImg: 1,
          isBackImgVerified: 1,
          liveSelfyImg: 1,
          isLiveSelfyImgVerified: 1,
          vehicleImg: 1,
          vehicleRegistrationImg: 1,
          insuranceImg: 1,
          gender: 1,
          dob: 1,
          store: 1,
          about: 1,
        },
      },
    ]);

    if (findUser[0]?.profileImg) {
      findUser[0].profileImg =
        process.env.IMAGE_BASE_URL + findUser[0].profileImg;
    }

    if (findUser[0]?.frontImg) {
      findUser[0].frontImg = process.env.IMAGE_BASE_URL + findUser[0].frontImg;
    }

    if (findUser[0]?.backImg) {
      findUser[0].backImg = process.env.IMAGE_BASE_URL + findUser[0].backImg;
    }

    if (findUser[0]?.liveSelfyImg) {
      findUser[0].liveSelfyImg =
        process.env.IMAGE_BASE_URL + findUser[0].liveSelfyImg;
    }

    if (findUser[0]?.vehicleImg) {
      findUser[0].vehicleImg =
        process.env.IMAGE_BASE_URL + findUser[0].vehicleImg;
    }

    if (findUser[0]?.vehicleRegistrationImg) {
      findUser[0].vehicleRegistrationImg =
        process.env.IMAGE_BASE_URL + findUser[0].vehicleRegistrationImg;
    }

    if (findUser[0]?.insuranceImg) {
      findUser[0].insuranceImg =
        process.env.IMAGE_BASE_URL + findUser[0].insuranceImg;
    }

    if (findUser) {
      await setResponseObject(
        req,
        true,
        "Profile details found successfully",
        findUser[0]
      );
      next();
    } else {
      await setResponseObject(req, false, "Profile details not found", "");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*FORGOT PASSWORD*/
_user.forgotPassword = async (req, res, next) => {
  try {
    let data = req.body;
    const { error } = await validateForgotPassword(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });

    let findUser;
    if (data?.email && data?.email != "undefined") {
      findUser = await USER.findOne({
        email: data?.email,
        stateId: { $ne: CONST.DELETED },
      });

      if (!findUser) {
        return res.status(400).send({
          message: "Account not registered with this email.",
          success: false,
        });
      }

      if (findUser.stateId == CONST.INACTIVE) {
        return res.status(400).send({
          message:
            "Account inactive. You must have an active account to receive an OTP email.",
          success: false,
        });
      }

      const otp = generateOTP();
      const otpExpirationTime = Date.now() + 5 * 60000;

      const updateOtp = await USER.findOneAndUpdate(
        { email: findUser.email },
        { otp: otp, otpExpiration: otpExpirationTime },
        { new: true }
      );

      if (updateOtp) {
        await nodemailer.forgotPassword(
          findUser.email,
          findUser.firstName,
          otp
        );
        next();

        res.status(HTTP.SUCCESS).send({
          success: true,
          // message:
          //   "An OTP sent on your registered email! Use it to reset your password",
          message: `${updateOtp?.otp} is your otp.!Use it to reset your password.`,
        });
        next();
      } else {
        res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Error occurred when sending OTP",
        });
        next();
      }
    }
    if (data?.mobile && data?.countryCode) {
      findUser = await USER.findOne({
        mobile: data?.mobile,
        countryCode: data?.countryCode,
        stateId: { $ne: CONST.DELETED },
      });
      if (!findUser) {
        return res.status(400).send({
          message: "Account not registered with this mobile number.",
          success: false,
        });
      }
      if (findUser.stateId == CONST.INACTIVE) {
        return res.status(400).send({
          message:
            "Account inactive. You must have an active account to receive an OTP email.",
          success: false,
        });
      }
      const otp = generateOTP();
      const otpExpirationTime = Date.now() + 5 * 60000;

      const updateOtp = await USER.findOneAndUpdate(
        { _id: findUser._id },
        { otp: otp, otpExpiration: otpExpirationTime },
        { new: true }
      ).select("otp -_id");

      if (updateOtp) {
        const recipientNumber = `${findUser.countryCode}${findUser.mobile}`;
        const msg = ` ${updateOtp?.otp} is your one-time password to reset your password`;
        // await sendSMS(recipientNumber, msg);

        res.status(HTTP.SUCCESS).send({
          success: true,
          message:
            "An OTP sent on your registered mobile! Use it to reset your password",
        });
        next();
      } else {
        res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Error occurred when sending OTP",
        });
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADMIN FORGOT PASSWORD*/
_user.adminForgotPassword = async (req, res, next) => {
  try {
    let data = req.body;

    const { error } = await validateForgotPassword(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });

    let findUser;
    if (data?.email && data?.email != "undefined") {
      findUser = await USER.findOne({
        email: data?.email,
        stateId: { $ne: CONST.DELETED },
      });
      if (findUser?.roleId == CONST.USER) {
        return res.status(400).send({
          message: "Password reset is not allowed for this user role.",
          success: false,
        });
      }

      if (!findUser) {
        return res.status(400).send({
          message: "No account found with this email.",
          success: false,
        });
      }

      const otp = generateOTP();
      const otpExpirationTime = Date.now() + CONST.EXPIRE_MIN * 60000;

      const updateOtp = await USER.findOneAndUpdate(
        { email: findUser.email },
        { otp: otp, otpExpiration: otpExpirationTime },
        { new: true }
      ).select("_id email otp");

      //const contactMethod = data.email == 'email' ? "email" : "mobile number";

      if (updateOtp) {
        const smtp = await nodemailer.smtpCredential();
        if (smtp.host && smtp.port && smtp.email && smtp.password) {
          await nodemailer.forgotPassword(
            findUser.email,
            findUser.firstName,
            otp
          );
          next();
        }
        res.status(HTTP.SUCCESS).send({
          success: true,
          message: `Your one-time password to access your basenode account is sent on your registered email.`,
        });
        next();
      } else {
        res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Error occurred when sending OTP",
        });
        next();
      }
    }
    if (data?.mobile && data?.mobile != "undefined") {
      findUser = await USER.findOne({
        mobile: data?.mobile,
        countryCode: data?.countryCode,
        stateId: { $ne: CONST.DELETED },
      });
      if (findUser?.roleId == CONST.ADMIN) {
        return res.status(400).send({
          message: "Password reset is not allowed for this user role.",
          success: false,
        });
      }
      if (!findUser) {
        return res.status(400).send({
          message: "Account not registered with this mobile number.",
          success: false,
        });
      }
      const otp = generateOTP();
      const otpExpirationTime = Date.now() + CONST.EXPIRE_MIN * 60000;

      const updateOtp = await USER.findOneAndUpdate(
        { email: findUser.email },
        { otp: otp, otpExpiration: otpExpirationTime },
        { new: true }
      ).select("otp -_id");

      if (updateOtp) {
        const recipientNumber = `${findUser.countryCode}${findUser.mobile}`;
        const msg = ` ${updateOtp?.otp} is your one-time password to access your basenode account`;

        if (findUser.countryCode != "+971") {
          await sendSMS(recipientNumber, msg);
          res.status(HTTP.SUCCESS).send({
            success: true,
            message: `Your one-time password to access your basenode account is sent on your registered mobile number.`,
            data: {},
          });
          next();
        } else {
          const isSmsSend = await sendSMSViaSmartMessage(recipientNumber, msg);
          if (isSmsSend) {
            res.status(HTTP.SUCCESS).send({
              success: true,
              message: `Your one-time password to access your basenode account is sent on your registered mobile number.`,
              data: {},
            });
            next();
          } else {
            res.status(HTTP.SUCCESS).send({
              success: true,
              message: "There was a problem sending the OTP.",
              data: {},
            });
            next();
          }
        }
      } else {
        res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: "Error occurred when sending OTP",
        });
        next();
      }
    }
  } catch (error) {
    console.log("error", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*RESTORE PASSWORD*/
_user.restorePassword = async (req, res, next) => {
  try {
    const { email, password, mobile, countryCode } = req.body;

    if (!email || !password) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Fields can't be empty",
      });
    }

    let query = {};

    if (email) {
      query.email = email;
    } else if (mobile && countryCode) {
      query = { countryCode, mobile };
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Insufficient information to restore password",
      });
    }

    const user = await USER.findOne(query);
    if (!user) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "User not found",
      });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: PASSWORD_CANNNOT_SAME,
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );

    const updatedUser = await USER.findOneAndUpdate(
      query,
      { password: hashedPassword },
      { new: true }
    ).select("roleId -_id");

    if (updatedUser) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: "Password restored successfully",
        data: {},
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Password restore failed",
      });
    }
  } catch (error) {
    console.log("Error in restorePassword:", error);
    await setResponseObject(req, false, error.message, "");
    return next();
  }
};

/*CHANGE PASSWORD*/
_user.changePassword = async (req, res, next) => {
  try {
    let data = req.body;
    const { error } = await validateChangePassword(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });
    let findUser = await USER.findOne({ _id: req.userId });

    if (req.body.oldPassword) {
      let validOldPassword = await bcrypt.compare(
        data.oldPassword,
        findUser.password
      );
      if (validOldPassword) {
        console.log("validated");
      } else {
        return res.status(400).send({ message: "Old password doesn't match" });
      }
    }

    let comparePassword = await bcrypt.compare(
      data.password,
      findUser.password
    );

    if (comparePassword) {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: PASSWORD_CANNNOT_SAME,
      });
    } else {
      let hash = await bcrypt.hash(
        data.password,
        parseInt(process.env.SALT_ROUNDS)
      );

      data.password = hash;

      let updatePassword = await USER.findOneAndUpdate(
        { _id: req.userId },
        { password: data.password },
        { new: true }
      );

      if (updatePassword) {
        return res.status(HTTP.SUCCESS).send({
          success: true,
          message: req.body.oldPassword
            ? "Password changed successfully"
            : PASSWORD_CHANGED,
          data: updatePassword,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).send({
          success: false,
          message: ERROR_UPDATE,
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* DELETE USER */
_user.deleteAccount = async (req, res, next) => {
  try {
    const deleteData = await USER.findByIdAndUpdate(
      {
        _id: req.userId,
      },
      { stateId: CONST.DELETED },
      { new: true }
    );
    if (deleteData) {
      await setResponseObject(req, true, "Account deleted successfully");
      next();
    } else {
      await setResponseObject(req, false, "Account not deleted");
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*BAN USER */
_user.banUser = async (req, res, next) => {
  try {
    let data = req.body;
    let updateState = await USER.findOneAndUpdate(
      { _id: req.params.id },
      { stateId: CONST.BAN, reason: data?.reason },
      { new: true }
    );

    if (!updateState) {
      await setResponseObject(req, false, "User Block fail");
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "User Block successfully",
        updateState
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*EDIT USER'S OWN PROFILE*/
_user.editOwnProfile = async (req, res, next) => {
  try {
    let data = req.body;

    const { error } = validateEditProfile(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: formatErrorResponse(error.details[0].message),
      });

    // Upload profile image
    if (req.files.profileImg && req.files.profileImg.length > 0) {
      data.profileImg = new mongoose.Types.ObjectId(req.files.profileImg[0].id);
    }
    // Upload frontImg
    if (req.files.frontImg && req.files.frontImg.length > 0) {
      data.frontImg = new mongoose.Types.ObjectId(req.files.frontImg[0].id);
    }

    // Upload backImg
    if (req.files.backImg && req.files.backImg.length > 0) {
      data.backImg = new mongoose.Types.ObjectId(req.files.backImg[0].id);
    }

    // Upload liveSelfyImg
    if (req.files.liveSelfyImg && req.files.liveSelfyImg.length > 0) {
      data.liveSelfyImg = new mongoose.Types.ObjectId(
        req.files.liveSelfyImg[0].id
      );
    }

    // Upload vehicleImg
    if (req.files.vehicleImg && req.files.vehicleImg.length > 0) {
      data.vehicleImg = new mongoose.Types.ObjectId(req.files.vehicleImg[0].id);
    }

    // Upload vehicleRegistrationImg
    if (
      req.files.vehicleRegistrationImg &&
      req.files.vehicleRegistrationImg.length > 0
    ) {
      data.vehicleRegistrationImg = new mongoose.Types.ObjectId(
        req.files.vehicleRegistrationImg[0].id
      );
    }

    // Upload insuranceImg
    if (req.files.insuranceImg && req.files.insuranceImg.length > 0) {
      data.insuranceImg = new mongoose.Types.ObjectId(
        req.files.insuranceImg[0].id
      );
    }

    data.isProfileCompleted = true;
    if (data?.longitude && data?.latitude) {
      data.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }

    if (data?.address) {
      data.isAddress = true;
    }

    // if (data?.firstName && data?.lastName) {
    //   data.fullName = data?.firstName + " " + data?.lastName;
    // }

    let updateProfile = await USER.findOneAndUpdate({ _id: req.userId }, data, {
      new: true,
    });

    if (updateProfile?.profileImg) {
      updateProfile.profileImg =
        process.env.IMAGE_BASE_URL + updateProfile?.profileImg;
    }

    if (updateProfile?.frontImg) {
      updateProfile.frontImg =
        process.env.IMAGE_BASE_URL + updateProfile?.frontImg;
    }

    if (updateProfile?.backImg) {
      updateProfile.backImg =
        process.env.IMAGE_BASE_URL + updateProfile?.backImg;
    }

    if (updateProfile?.liveSelfyImg) {
      updateProfile.liveSelfyImg =
        process.env.IMAGE_BASE_URL + updateProfile?.liveSelfyImg;
    }

    if (updateProfile?.vehicleImg) {
      updateProfile.vehicleImg =
        process.env.IMAGE_BASE_URL + updateProfile?.vehicleImg;
    }

    if (updateProfile?.vehicleRegistrationImg) {
      updateProfile.vehicleRegistrationImg =
        process.env.IMAGE_BASE_URL + updateProfile?.vehicleRegistrationImg;
    }

    if (updateProfile?.insuranceImg) {
      updateProfile.insuranceImg =
        process.env.IMAGE_BASE_URL + updateProfile?.insuranceImg;
    }

    if (!updateProfile) {
      await setResponseObject(
        req,
        false,
        "Error occur while update profile details."
      );
      next();
    } else {
      await setResponseObject(
        req,
        true,
        "Profile Updated Successfully",
        updateProfile
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADD USER BY ADMIN*/
_user.addUser = async (req, res, next) => {
  try {
    let data = req.body;

    data.password = process.env.DEFAULT_PWD;
    data.password = await getHashPassword(data.password);
    let userExists = await USER.findOne({
      email: data?.email?.toLowerCase(),
      stateId: { $ne: CONST.DELETED },
    });

    if (data.mobile || data.countryCode) {
      let mobileExists = await USER.findOne({
        $and: [{ mobile: data?.mobile }, { countryCode: data?.countryCode }],
        stateId: { $ne: CONST.DELETED },
      });
      if (mobileExists) {
        return res.status(400).send({
          message: "Account already created with this mobile number",
          success: false,
        });
      }
    }

    let mess = data?.roleId == CONST.SUB_ADMIN ? "Sub admin" : "Driver";

    if (userExists) {
      await setResponseObject(
        req,
        false,
        `${mess} is already registered with this email`
      );
      next();
    } else {
      if (req?.files?.profileImg?.length) {
        data.profileImg = req.files.profileImg[0].id;
      }

      // Upload vehicleImg
      if (req?.files?.vehicleImg && req?.files?.vehicleImg.length > 0) {
        data.vehicleImg = new mongoose.Types.ObjectId(
          req.files.vehicleImg[0].id
        );
      }

      // Upload vehicleRegistrationImg
      if (
        req?.files?.vehicleRegistrationImg &&
        req?.files?.vehicleRegistrationImg.length > 0
      ) {
        data.vehicleRegistrationImg = new mongoose.Types.ObjectId(
          req.files.vehicleRegistrationImg[0].id
        );
      }

      // Upload insuranceImg
      if (req?.files?.insuranceImg && req?.files?.insuranceImg.length > 0) {
        data.insuranceImg = new mongoose.Types.ObjectId(
          req.files.insuranceImg[0].id
        );
      }

      data.isVerified = true;
      data.email = data?.email?.toLowerCase();
      data.createdBy = req.userId;
      data.isTermsCondition = true;
      data.roleId = data.roleId;
      data.stateId = CONST.ACTIVE;
      data.firstName = data?.firstName;
      data.lastName = data?.lastName;
      data.country = data?.country;

      let saveUser = await USER.create(data);
      if (!saveUser) {
        await setResponseObject(req, false, `${mess} not added`);
        next();
      } else {
        const adminData = await USER.findOne(
          { roleId: CONST.ADMIN },
          "roleId email"
        );
        await setResponseObject(
          req,
          true,
          `${mess} added successfully`,
          saveUser
        );
        const smtp = await nodemailer.smtpCredential();
        if (smtp.host && smtp.port && smtp.email && smtp.password) {
          await nodemailer.addUser(saveUser.email, process.env.DEFAULT_PWD);
        }
        next();
      }
    }
  } catch (error) {
    console.log("error", error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*GET ALL USERS*/
_user.getUsers = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
    let pageLimit =
      parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT
        ? CONST.MAX_PAGE_LIMIT
        : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    let filter = {};

    switch (req.query.state) {
      case "1":
        filter = {
          stateId: CONST.ACTIVE,
        };
        break;

      case "2":
        filter = {
          stateId: CONST.INACTIVE,
        };
        break;

      default:
        filter = {};
    }

    let searchFilters = {};
    if (req.query.search && req.query.search !== "undefined") {
      const searchTerm = req.query.search.trim(); // Trim whitespace

      if (searchTerm) {
        const escapedSearchTerm = searchTerm.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );
        searchFilters = {
          $or: [
            { firstName: { $regex: escapedSearchTerm, $options: "i" } },
            { lastName: { $regex: escapedSearchTerm, $options: "i" } },
            { fullName: { $regex: escapedSearchTerm, $options: "i" } },
            { email: { $regex: escapedSearchTerm, $options: "i" } },
            {
              $expr: {
                $regexMatch: {
                  input: { $toString: "$mobile" },
                  regex: escapedSearchTerm,
                  options: "i",
                },
              },
            },
          ],
        };
      }
    }

    let userFilter = {};
    if (req.query.roleId) {
      userFilter = {
        roleId: parseInt(req.query.roleId),
      };
    }

    let getUsers = await USER.aggregate([
      {
        $match: {
          $and: [
            {
              roleId: { $ne: CONST.ADMIN },
            },
            {
              ...userFilter,
            },
            {
              stateId: { $ne: CONST.DELETED },
            },
          ],
        },
      },
      {
        $match: filter,
      },
      {
        $match: searchFilters,
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (getUsers && getUsers[0]?.data?.length) {
      getUsers[0].data = getUsers[0].data.map((user) => {
        if (
          user.profileImg &&
          user.socialType !== "google" &&
          user.socialType !== "apple"
        ) {
          user.profileImg = process.env.IMAGE_BASE_URL + user?.profileImg;
        }
        return user;
      });

      await setResponseObject(
        req,
        true,
        "User list found successfully",
        getUsers[0].data,
        getUsers[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "User list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*GET SINGLE USER DETAIL*/
_user.getUserById = async (req, res, next) => {
  try {
    const getUser = await USER.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "stores",
          let: { id: "$store" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$_id"] },
              },
            },
          ],
          as: "store",
        },
      },
      {
        $unwind: {
          path: "$store",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    if (getUser[0]?.profileImg) {
      getUser[0].profileImg =
        process.env.IMAGE_BASE_URL + getUser[0]?.profileImg;
    }

    if (getUser[0]?.store?.logo) {
      getUser[0].store.logo =
        process.env.IMAGE_BASE_URL + getUser[0]?.store?.logo;
    }

    if (getUser[0]?.store?.coverImg) {
      getUser[0].store.coverImg =
        process.env.IMAGE_BASE_URL + getUser[0]?.store?.coverImg;
    }

    if (getUser[0]?.backImg) {
      getUser[0].backImg = process.env.IMAGE_BASE_URL + getUser[0]?.backImg;
    }

    if (getUser[0]?.frontImg) {
      getUser[0].frontImg = process.env.IMAGE_BASE_URL + getUser[0]?.frontImg;
    }

    if (getUser[0]?.liveSelfyImg) {
      getUser[0].liveSelfyImg =
        process.env.IMAGE_BASE_URL + getUser[0]?.liveSelfyImg;
    }

    if (getUser[0]?.vehicleImg) {
      getUser[0].vehicleImg =
        process.env.IMAGE_BASE_URL + getUser[0]?.vehicleImg;
    }

    if (getUser[0]?.vehicleRegistrationImg) {
      getUser[0].vehicleRegistrationImg =
        process.env.IMAGE_BASE_URL + getUser[0]?.vehicleRegistrationImg;
    }

    if (getUser[0]?.insuranceImg) {
      getUser[0].insuranceImg =
        process.env.IMAGE_BASE_URL + getUser[0]?.insuranceImg;
    }

    if (getUser) {
      return res.status(200).send({
        success: true,
        message: "User details found successfully",
        data: getUser[0],
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "User Details not found",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*EDIT USER'S PROFILE*/
_user.editUserProfile = async (req, res, next) => {
  try {
    let data = req.body;

    if (data.firstName && data.lastName) {
      data.fullName = data.firstName + " " + data.lastName;
    }

    // data.isProfileCompleted = true;
    if (req?.files?.profileImg?.length) {
      data.profileImg = req.files.profileImg[0].id;
    }

    // Upload vehicleImg
    if (req?.files?.vehicleImg && req?.files?.vehicleImg.length > 0) {
      data.vehicleImg = new mongoose.Types.ObjectId(req.files.vehicleImg[0].id);
    }

    // Upload vehicleRegistrationImg
    if (
      req?.files?.vehicleRegistrationImg &&
      req?.files?.vehicleRegistrationImg.length > 0
    ) {
      data.vehicleRegistrationImg = new mongoose.Types.ObjectId(
        req.files.vehicleRegistrationImg[0].id
      );
    }

    // Upload insuranceImg
    if (req?.files?.insuranceImg && req?.files?.insuranceImg.length > 0) {
      data.insuranceImg = new mongoose.Types.ObjectId(
        req.files.insuranceImg[0].id
      );
    }

    data.isVehicleImgVerified = true;
    data.isVehicleRegistrationVerified = true;
    data.isInsuranceVerified = true;

    let updateProfile = await USER.findOneAndUpdate(
      { _id: req.params.id },
      data,
      {
        new: true,
      }
    );

    let mess =
      updateProfile?.roleId == CONST.SUB_ADMIN ? "Sub admin" : "Driver";

    if (updateProfile) {
      await setResponseObject(
        req,
        true,
        `${mess} updated successfully`,
        updateProfile
      );
      next();
    } else {
      await setResponseObject(
        req,
        false,
        "Error occur while upadte account information"
      );
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/* SOFT DELETE USER */
_user.updateState = async (req, res, next) => {
  try {
    // Retrieve the user by ID
    const user = await USER.findById(req.params.id);
    if (!user) {
      await setResponseObject(req, false, "User  not found");
      return next();
    }

    let filter = {};
    let resp;
    const data = req.body;

    switch (req.body.stateId) {
      case "1": // ACTIVE
        if (user.stateId === 1) {
          await setResponseObject(req, false, "User  is already active");
          return next();
        }
        filter = { stateId: 1, reason: "" };
        resp = "User  account activated successfully";
        break;

      case "2": // INACTIVE
        if (user.stateId === 2) {
          await setResponseObject(req, false, "User  is already inactive");
          return next();
        }
        filter = { stateId: 2, reason: data.reason };
        resp = "User  account deactivated successfully";
        break;

      case "3": // DELETED
        if (user.stateId === 3) {
          await setResponseObject(req, false, "User  is already deleted");
          return next();
        }
        filter = { stateId: 3, reason: data.reason };
        resp = "User  account deleted successfully";
        break;

      default:
        await setResponseObject(req, false, "Invalid stateId");
        return next();
    }

    // Update the user's state
    const updateState = await USER.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: filter },
      { new: true }
    );

    if (updateState) {
      await setResponseObject(req, true, resp, updateState);
      return next();
    } else {
      await setResponseObject(req, false, resp);
      return next();
    }
  } catch (error) {
    console.log("error======>", error);
    await setResponseObject(req, false, error.message, "");
    return next();
  }
};

/*CONTACT-US FORM*/
_user.contactUs = async (req, res, next) => {
  try {
    let data = req.body;
    let from = data.from;
    let subject = data.subject;
    let text = data.text;
    const smtp = await nodemailer.smtpCredential();
    if (smtp.host && smtp.port && smtp.email && smtp.password) {
      await nodemailer.contactUs(from, subject, text);
    }
    next();
    return res.status(HTTP.SUCCESS).send({
      success: true,
      message: GENERAL_MESSAGE(
        "Your query has been successfully, we will contact you soon"
      ),
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*SEND MAIL*/
_user.sendMail = async (req, res, next) => {
  try {
    let data = req.body;
    let to = data.to;
    let subject = data.subject;
    let text = data.text;

    const smtp = await nodemailer.smtpCredential();
    if (smtp.host && smtp.port && smtp.email && smtp.password) {
      let sendMail = await nodemailer.sendMail(to, subject, text);
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: GENERAL_MESSAGE("Mail sent"),
        data: sendMail,
      });
    }
    next();
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*NOTIFY ME*/
_user.notifyMe = async (req, res, next) => {
  try {
    let user = await USER.findById({ _id: req.userId });
    user.isNotify = !user.isNotify;
    let result = await user.save();
    result.password = undefined;
    if (result) {
      return res.status(HTTP.SUCCESS).send({
        success: false,
        message: "Data Updated Successfully",
        data: result,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "Something Went Wrong",
        data: {},
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADMIN GET DASHBOARD DATA*/
_user.dashboardCount = async (req, res, next) => {
  try {
    let totalUserCount = await USER.countDocuments({
      roleId: { $eq: CONST.USER },
      stateId: { $ne: CONST.DELETED },
    });

    let totalCategoryCount = await CATEGORY_MODEL.countDocuments({
      stateId: { $ne: CONST.DELETED },
    });
    let totalBrandCount = await BRAND_MODEL.countDocuments({
      stateId: { $ne: CONST.DELETED },
    });
    let totalSubscriptionCount = await PLAN.countDocuments({
      stateId: { $ne: CONST.DELETED },
    });

    return res.status(200).send({
      message: "Dashboard count found successfully",
      success: true,
      data: {
        totalUserCount,
        totalCategoryCount,
        totalBrandCount,
        totalSubscriptionCount,
      },
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADMIN GRAPH DATA*/
_user.graphData = async (req, res, next) => {
  try {
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const collections = ["users", "categories", "brands", "plans"];
    const result = [];

    for (const month of allMonths) {
      const monthlyCounts = [month];

      for (const collectionName of collections) {
        let currentYear = req.params.year
          ? req.params.year
          : new Date().getFullYear();

        const lastDay = new Date(
          currentYear,
          allMonths.indexOf(month) + 1,
          0
        ).getDate();

        const query = {
          createdAt: {
            $gte: new Date(`${month} 01, ${currentYear}`),
            $lte: new Date(`${month} ${lastDay}, ${currentYear}`),
          },
        };
        let count;

        if (collectionName === "users") {
          count = await USER.countDocuments({
            roleId: { $ne: CONST.DELETED },
            stateId: { $ne: CONST.DELETED },
            ...query,
          });
          monthlyCounts.push(count || 0);
        }

        if (collectionName === "categories") {
          count = await CATEGORY_MODEL.countDocuments({
            stateId: { $ne: CONST.DELETED },
            ...query,
          });
          monthlyCounts.push(count || 0);
        }

        if (collectionName === "brands") {
          count = await BRAND_MODEL.countDocuments({
            stateId: { $ne: CONST.DELETED },
            ...query,
          });
          monthlyCounts.push(count || 0);
        }

        if (collectionName === "plans") {
          count = await PLAN.countDocuments({
            stateId: { $ne: CONST.DELETED },
            ...query,
          });
          monthlyCounts.push(count || 0);
        }
      }

      result.push(monthlyCounts);
    }
    return res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*ADMIN GET GRAPH ERROR DATA*/
_user.graphErrorData = async (req, res, next) => {
  try {
    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const collections = ["errorLogs"];
    const result = [];

    for (const month of allMonths) {
      const monthlyCounts = [month];
      for (const collectionName of collections) {
        const collection = mongoose.connection.collection(collectionName);
        let currentYear = req.params.year
          ? req.params.year
          : new Date().getFullYear();

        // Correctly calculate the last day of the month
        const monthIndex = allMonths.indexOf(month);
        const lastDay = new Date(currentYear, monthIndex + 1, 0).getDate();

        // Create start and end dates for the query
        const startDate = new Date(Date.UTC(currentYear, monthIndex, 1)); // Start of the month
        const endDate = new Date(
          Date.UTC(currentYear, monthIndex + 1, 0, 23, 59, 59, 999)
        ); // End of the month

        const query = {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        };
        let count;
        if (collectionName === "errorLogs") {
          count = await Error_Logs.countDocuments({
            errorCode: { $eq: 400 },
            ...query,
          });
          monthlyCounts.push(count || 0);
          count = await Error_Logs.countDocuments({
            errorCode: { $eq: 401 },
            ...query,
          });
          monthlyCounts.push(count || 0);
          count = await Error_Logs.countDocuments({
            errorCode: { $eq: 404 },
            ...query,
          });
          monthlyCounts.push(count || 0);
          count = await Error_Logs.countDocuments({
            errorCode: { $eq: 500 },
            ...query,
          });
          monthlyCounts.push(count || 0);
          count = await Error_Logs.countDocuments({
            errorCode: { $eq: 503 },
            ...query,
          });
          monthlyCounts.push(count || 0);
        } else if (collectionName === "productprices") {
          count = await paymentProductPrice.countDocuments({
            stateId: { $eq: CONST.ACTIVE },
            ...query,
          });
          monthlyCounts.push(count || 0);
        } else if (collectionName === "vouchers") {
          count = await voucherModel.countDocuments({
            isUsed: { $eq: true },
            ...query,
          });

          monthlyCounts.push(count || 0);
          count = await voucherModel.countDocuments({
            isUsed: { $eq: true },
            ...query,
          });
          monthlyCounts.push(count || 0);
        }
      }

      result.push(monthlyCounts);
    }

    return res.send({
      success: true,
      totalCount: 0,
      data: result,
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER GET DASHBOARD DATA*/
_user.userDashboardCount = async (req, res, next) => {
  try {
    let totalNotificationCount = await Notification.countDocuments({
      to: req.userId,
      stateId: { $ne: CONST.DELETED },
    });

    return res.status(200).send({
      message: "Dashboard count found successfully",
      success: true,
      data: {
        totalNotificationCount,
      },
    });
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*CREATE APP CRUSH*/
_user.createAppCrash = async (req, res, next) => {
  try {
    let data = req.body;
    console.log("data", data);
    //data.createdBy = req.userId;

    let save = await Error_Logs.create(data);
    if (!save) {
      await setResponseObject(req, false, ADD_FAILED("App Crash"));
      next();
    } else {
      await setResponseObject(req, true, ADD_SUCCESS("App Crash"), save);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*USER APP CRUSH LIST*/
_user.getUserApiLogs = async (req, res, next) => {
  try {
    const result = await Error_Logs.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $match: {
          createdBy: { $eq: new mongoose.Types.ObjectId(req.userId) },
        },
      },
    ]);

    if (result && result.length > 0) {
      await setResponseObject(req, true, FOUND_SUCCESS("Data"), result[0]);
      next();
    } else {
      await setResponseObject(req, true, "", {});
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*VERIFY BACK IMAGE */
_user.verifyBackImg = async (req, res, next) => {
  try {
    let updateState;
    let findUser = await USER.findOne({ _id: req.params.id });
    console.log("findUser", findUser);

    if (findUser.isBackImgVerified == CONST.DOC_VERIFY.APPROVED) {
      updateState = await USER.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { isBackImgVerified: CONST.DOC_VERIFY.APPROVED } },
        { new: true }
      );
      if (updateState) {
        // await Notification({
        //   title: "Product Approved",
        //   description: `Your product ${updateState?.title} has been approved by the admin and is now available to viewers.`,
        //   to: updateState?.createdBy,
        //   // notificationType: CONST.APPROVAL_NOTIFICATION,
        // }).save();

        await setResponseObject(
          req,
          true,
          "Back image approved successfully.",
          updateState
        );
        next();
      } else {
        await setResponseObject(req, false, "Back image not approved.");
        next();
      }
    } else {
      updateState = await USER.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { isBackImgVerified: CONST.DOC_VERIFY.REJECTED } },
        { new: true }
      );

      if (updateState) {
        // await Notification({
        //   title: "Product approved rejected",
        //   description: `Your content ${updateState?.title} has been rejected by the admin.`,
        //   to: updateState?.createdBy,
        //   // notificationType: CONST.APPROVAL_NOTIFICATION,
        // }).save();

        await setResponseObject(
          req,
          true,
          "Back image approval rejected successfully."
        );
        next();
      } else {
        await setResponseObject(
          req,
          false,
          "Back image approval rejected error."
        );
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*VERIFY FRONT IMAGE */
_user.verifySelfImg = async (req, res, next) => {
  try {
    let updateState;
    let findUser = await USER.findOne({ _id: req.params.id });
    if (findUser.isLiveSelfyImgVerified == CONST.DOC_VERIFY.APPROVED) {
      console.log("findUser", findUser);

      updateState = await USER.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { isLiveSelfyImgVerified: CONST.DOC_VERIFY.APPROVED } },
        { new: true }
      );
      if (updateState) {
        // await Notification({
        //   title: "Product Approved",
        //   description: `Your product ${updateState?.title} has been approved by the admin and is now available to viewers.`,
        //   to: updateState?.createdBy,
        //   // notificationType: CONST.APPROVAL_NOTIFICATION,
        // }).save();

        await setResponseObject(
          req,
          true,
          "Live selfy image approved successfully.",
          updateState
        );
        next();
      } else {
        await setResponseObject(req, false, "Live selfy image not approved.");
        next();
      }
    } else {
      updateState = await USER.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { isLiveSelfyImgVerified: CONST.DOC_VERIFY.REJECTED } },
        { new: true }
      );

      if (updateState) {
        // await Notification({
        //   title: "Product approved rejected",
        //   description: `Your content ${updateState?.title} has been rejected by the admin.`,
        //   to: updateState?.createdBy,
        //   // notificationType: CONST.APPROVAL_NOTIFICATION,
        // }).save();

        await setResponseObject(
          req,
          true,
          "Live selfy image approval rejected successfully."
        );
        next();
      } else {
        await setResponseObject(
          req,
          false,
          "Live selfy image approval rejected error."
        );
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*VERIFY BACK IMAGE */
_user.verifyFrontImg = async (req, res, next) => {
  try {
    let updateState;
    let findUser = await USER.findOne({ _id: req.params.id });
    if (findUser.isFrontImgVerified == CONST.DOC_VERIFY.APPROVED) {
      updateState = await USER.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { isFrontImgVerified: CONST.DOC_VERIFY.APPROVED } },
        { new: true }
      );
      if (updateState) {
        // await Notification({
        //   title: "Product Approved",
        //   description: `Your product ${updateState?.title} has been approved by the admin and is now available to viewers.`,
        //   to: updateState?.createdBy,
        //   // notificationType: CONST.APPROVAL_NOTIFICATION,
        // }).save();

        await setResponseObject(
          req,
          true,
          "Front image approved successfully.",
          updateState
        );
        next();
      } else {
        await setResponseObject(req, false, "Front image not approved.");
        next();
      }
    } else {
      updateState = await USER.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { isFrontImgVerified: CONST.DOC_VERIFY.REJECTED } },
        { new: true }
      );

      if (updateState) {
        // await Notification({
        //   title: "Product approved rejected",
        //   description: `Your content ${updateState?.title} has been rejected by the admin.`,
        //   to: updateState?.createdBy,
        //   // notificationType: CONST.APPROVAL_NOTIFICATION,
        // }).save();

        await setResponseObject(
          req,
          true,
          "Front image approval rejected successfully."
        );
        next();
      } else {
        await setResponseObject(
          req,
          false,
          "Front image approval rejected error."
        );
        next();
      }
    }
  } catch (error) {
    await setResponseObject(req, false, error.message);
    next();
  }
};

/*DOWNLOAD USER REPORT*/
_user.downloadUserReport = async (req, res, next) => {
  try {
    if (!fs.existsSync(dir1)) {
      fs.mkdirSync(dir1, {
        recursive: true,
      });
    }

    const start = new Date(req?.query?.startDate); // Convert to Date object
    const end = new Date(req?.query?.endDate); // Convert to Date object

    let findActivity = await USER.aggregate([
      {
        $match: {
          $and: [
            { stateId: { $ne: CONST.DELETED } },
            { roleId: { $ne: CONST.ADMIN } },
            {
              $or: [
                {
                  $and: [
                    { createdAt: { $gte: start } }, // Compare createdAt with start
                    { createdAt: { $lte: end } }, // Compare createdAt with end
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          let: { ids: { $ifNull: ["$interest", []] } },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$ids"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
              },
            },
          ],
          as: "interestDetails",
        },
      },
    ]);

    if (findActivity.length > 0) {
      async function generateExcel(findActivity) {
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("user Report");
        const data = [
          [
            "First Name",
            "Last Name",
            "Email",
            "Phone",
            "Country",
            "roleId",
            "Interest",
            "Expertise",
            "State Id",
            "Created On",
          ],
        ];

        findActivity?.forEach((userLoginData) => {
          const phoneNumber =
            userLoginData?.countryCode && userLoginData?.mobile
              ? userLoginData?.countryCode + " " + userLoginData?.mobile
              : "-";
          const interests =
            Array.isArray(userLoginData?.interestDetails) &&
            userLoginData?.interestDetails.length
              ? userLoginData.interestDetails.map((i) => i?.title).join(", ")
              : "-";
          data.push([
            userLoginData?.firstName ? userLoginData?.firstName : "-",
            userLoginData?.lastName ? userLoginData?.lastName : "-",
            userLoginData?.email ? userLoginData?.email : "-",
            phoneNumber,
            userLoginData?.country ? userLoginData?.country : "-",
            userLoginData?.roleId == CONST.USER ? "End user" : "Creator",
            interests ? interests : "-",
            userLoginData.expertise ? userLoginData.expertise : "-",
            userLoginData?.stateId == CONST.ACTIVE ? "Active" : "Inactive",
            `${moment(userLoginData?.createdAt)
              .format("DD-MMM-YYYY")
              .toUpperCase()}`,
          ]);
        });

        data.forEach((row) => {
          worksheet.addRow(row);
        });
        data[0].forEach((_, index) => {
          const maxLength = data.reduce(
            (max, row) =>
              Math.max(max, row[index] ? row[index].toString().length : 0),
            0
          );
          worksheet.getColumn(index + 1).width = maxLength + 2; // Adding some padding
        });

        // Define the file path for the Excel file
        const excelPath = `../uploads/userReport/userReport-${generateOTP(
          6
        )}.xlsx`;

        // Write the workbook to a file
        await workbook.xlsx.writeFile(excelPath);

        return excelPath;
      }

      const excelPath = await generateExcel(findActivity);
      let excelUrl = `${process.env.SERVER_API_URL}/api/${excelPath}`; // Example URL format
      excelUrl = excelUrl.replace(/\/\.\.\//g, "/");
      console.log("excelUrl", excelUrl);

      await setResponseObject(
        req,
        true,
        "Report download successfully",
        excelUrl
      );

      // Set a delay before deleting the file to allow the download to complete
      setTimeout(() => {
        fs.unlink(excelPath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully:", excelPath);
          }
        });
      }, 5000); // Wait for 5 seconds before deleting

      next();
    } else {
      await setResponseObject(
        req,
        true,
        "There is no data available for this user"
      );
      next();
    }
  } catch (error) {
    console.log(error);
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/******************************************SMS LOGS MANAGEMENT API*************************************/

/*GET SMS LOG LIST*/
_user.smsList = async (req, res, next) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || CONST.PAGE_NO;
    let pageLimit =
      parseInt(req.query.pageLimit) > CONST.MAX_PAGE_LIMIT
        ? CONST.MAX_PAGE_LIMIT
        : parseInt(req.query.pageLimit) || CONST.PAGE_LIMIT;

    let searchFilter = {};
    if (req.query.search && req.query.search !== "undefined") {
      function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      }

      const escapedSearch = escapeRegex(req.query.search);

      searchFilter = {
        to: {
          $regex: escapedSearch,
          $options: "i",
        },
      };
    }

    let getUsers = await userSmsLogs.aggregate([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $match: searchFilter,
      },
      {
        $facet: {
          data: [{ $skip: pageLimit * (pageNo - 1) }, { $limit: pageLimit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    if (getUsers && getUsers[0]?.data?.length) {
      await setResponseObject(
        req,
        true,
        "SMS data found successfully",
        getUsers[0].data,
        getUsers[0].count[0].count,
        pageNo,
        pageLimit
      );
      next();
    } else {
      await setResponseObject(req, true, "SMS list not found", []);
      next();
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*DELETE SMS LOG*/
_user.deleteSms = async (req, res, next) => {
  try {
    let bannerCheck = await userSmsLogs.findOne({ _id: req.params.id });
    if (bannerCheck) {
      let update = await userSmsLogs.findByIdAndDelete(req.params.id);
      if (update) {
        await setResponseObject(req, true, "Sms deleted successfully");
        next();
      } else {
        await setResponseObject(
          req,
          false,
          "Something went wrong please try again"
        );
        next();
      }
    } else {
      await setResponseObject(req, false, "Job not exit");
      next();
    }
  } catch (err) {
    await setResponseObject(req, false, err.message);
    next();
  }
};

/*GET SMS DETAIL*/
_user.smsDetails = async (req, res, next) => {
  try {
    let getUser = await userSmsLogs.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
    ]);

    if (getUser) {
      return res.status(200).send({
        success: true,
        message: "SMS details found successfully",
        data: getUser[0],
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "SMS Details not found",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

/*GET ALL SMS*/
_user.deleteAllSmsLog = async (req, res, next) => {
  try {
    let deleteErrorLog = await userSmsLogs.deleteMany({});

    if (deleteErrorLog) {
      return res.status(HTTP.SUCCESS).send({
        success: true,
        message: "All sms logs deleted successfully",
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).send({
        success: false,
        message: "All error logs not deleted",
      });
    }
  } catch (error) {
    await setResponseObject(req, false, error.message, "");
    next();
  }
};

module.exports = _user;
