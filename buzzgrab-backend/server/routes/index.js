/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var express = require("express");
var router = express.Router();

require("express-group-routes");

const { upload } = require("../middleware/upload");
const { CONST } = require("../helpers/constant");
const { rateLimitChecker } = require("../middleware/rateLimitChecker");
const mongoose = require("mongoose");
const handleResponse = require("../middleware/handleResponse");
const _tokenManager = require("../middleware/auth");
const { errorLogs_ } = require("../app/errorLogs/controller/logsController");
const USER_CONTROLLER = require("../app/userService/controller/userController");
const FAQ_CONTROLLER = require("../app/faq/controller/faq.controller");
const CONTACT_CONTROLLER = require("../app/contactUs/controller/contactUs.controller");
const cms = require("../app/cms/controller/page.controller");
const cms_ = new cms();
const _faq = require("../app/faq/controller/faq.controller");
const adminContact = require("../app/adminContactUs /controller/adminContactUs.controller");
const category = require("../app/category/controller/category.controller");
const _category = new category();
const brand = require("../app/brand/controller/brand.controller");
const _brand = new brand();
const _dateCheck = require("../app/dateCheck/controller/dateCheck.controller");
const notification = require("../app/notification/controller/notification.controller");
const notification_ = new notification();
const _banner = require("../app/banner/controller/banner.controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: CONST.PROJECT_NAME,
    serverStatus: "Server is running Properly",
    project_description: CONST.PROJECT_DESCRIPTION,
    swaggerUrl: CONST.SWAGGER_URL, // Adjust if your swagger route is different
  });
});

// Server status endpoint (optional, for API health check)
router.get("/status", function (req, res) {
  res.json({ status: "Server is running Properly" });
});

/**connecting to mongodb GridFSBucket */
let bucket;
(() => {
  mongoose.connection.on("connected", () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "filesBucket",
    });
  });
})();

/**UPLODAS */

/** @Get saved image from bucketFile */
router.get("/getImg/:fileId", async function (req, res, next) {
  try {
    const { fileId } = req.params;

    // Check if file exists in the bucket
    const file = await bucket
      .find({ _id: new mongoose.Types.ObjectId(fileId) })
      .toArray();

    if (file.length === 0) {
      return res.status(404).json({ error: { text: "File not found" } });
    }

    // Set headers if the user wants to download the image
    if (req.query.isDownloaded == "true") {
      res.set("Content-Type", file[0].contentType); // Ensure the correct content type (e.g. image/png, image/jpeg)
      res.set(
        "Content-Disposition",
        `attachment; filename=${file[0].filename}`
      );
    } else {
      // Set headers for regular image viewing (not downloading)
      res.set("Content-Type", file[0].contentType); // Same as above for image content
    }

    // Create a stream to read from the bucket
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );

    // Pipe the stream to the response (send the file as chunks)
    downloadStream.pipe(res);

    downloadStream.on("error", function (err) {
      res.status(500).send({ error: { text: "Error streaming file", err } });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: { text: `Unable to download file`, error } });
  }
});

// delete a file by id
router.delete(
  "/delete/file/:fileId",
  _tokenManager.authenticate,
  async (req, res) => {
    try {
      const { fileId } = req.params;
      await bucket.delete(new mongoose.Types.ObjectId(fileId));
      return res
        .status(200)
        .json({ message: { text: "File deleted successfully" } });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ error: { text: `Unable to download file`, error } });
    }
  }
);

/*** AUTHENTICATION ***/
router.group("/auth", (auth) => {
  auth.post("/signup", USER_CONTROLLER.signup, handleResponse.RESPONSE);
  auth.post(
    "/social/login",
    USER_CONTROLLER.socialLogin,
    handleResponse.RESPONSE
  );
  auth.post("/login", USER_CONTROLLER.login, handleResponse.RESPONSE);
  auth.post("/userLogin", USER_CONTROLLER.userSignin, handleResponse.RESPONSE);
  auth.put("/verifyOtp", USER_CONTROLLER.verifyOtp, handleResponse.RESPONSE);
  auth.put("/resendOtp", USER_CONTROLLER.resendOtp, handleResponse.RESPONSE);
  auth.put(
    "/forgotPassword",
    USER_CONTROLLER.forgotPassword,
    handleResponse.RESPONSE
  );
  auth.put(
    "/admin/forgotPassword",
    USER_CONTROLLER.adminForgotPassword,
    handleResponse.RESPONSE
  );
  auth.put(
    "/resetPassword",
    USER_CONTROLLER.restorePassword,
    handleResponse.RESPONSE
  );
  auth.get(
    "/profile",
    _tokenManager.authenticate,
    USER_CONTROLLER.profile,
    handleResponse.RESPONSE
  );
  auth.put(
    "/editProfile",
    _tokenManager.authenticate,
    upload().fields([
      { name: "profileImg" },
      { name: "frontImg" },
      { name: "backImg" },
      { name: "liveSelfyImg" },
      { name: "vehicleImg" },
      { name: "vehicleRegistrationImg" },
      { name: "insuranceImg" },
    ]),
    USER_CONTROLLER.editOwnProfile,
    handleResponse.RESPONSE
  );
  auth.put(
    "/changePassword",
    _tokenManager.authenticate,
    USER_CONTROLLER.changePassword,
    handleResponse.RESPONSE
  );
  auth.post(
    "/logout",
    _tokenManager.authenticate,
    USER_CONTROLLER.logout,
    handleResponse.RESPONSE
  );
  auth.put(
    "/notifyMe",
    _tokenManager.authenticate,
    USER_CONTROLLER.notifyMe,
    handleResponse.RESPONSE
  );
  auth.put(
    "/deleteAccount",
    _tokenManager.authenticate,
    USER_CONTROLLER.deleteAccount,
    handleResponse.RESPONSE
  );
});

/**CONTENT MANAGEMENT */
router.group("/pages", (auth) => {
  auth.get("/cms/:typeId", cms_.getByType, handleResponse.RESPONSE);
  auth.get("/faq", FAQ_CONTROLLER.faqList, handleResponse.RESPONSE);
});

/**CONTACT-US */
router.group("/contactUs", (contact) => {
  contact.post(
    "/add",
    rateLimitChecker(CONST.MAX_REQUEST, CONST.DURATION, CONST.BLOCK_DURATION),
    CONTACT_CONTROLLER.add,
    handleResponse.RESPONSE
  );
});

/**ADMIN-CONTACT-US */
router.group("/user/contactUs", (contact) => {
  contact.get("/list", adminContact.listContact, handleResponse.RESPONSE);
});

/*Crash Management  */
router.group("/apiLogs", (apiLogs) => {
  apiLogs.post(
    "/createCrash",
    errorLogs_.createAppCrash,
    handleResponse.RESPONSE
  );
  apiLogs.get("/crashList", errorLogs_.getUserApiLogs, handleResponse.RESPONSE);
});

/* Faq Management  */
router.group("/faq", (faq) => {
  faq.get("/list", _faq.faqList, handleResponse.RESPONSE);
});

/* Notification Management  */
router.group("/notification", (notification) => {
  notification.get(
    "/",
    notification_.getUserNotification,
    _tokenManager.authenticate,
    handleResponse.RESPONSE
  );
  notification.get(
    "/view/:id",
    _tokenManager.authenticate,
    notification_.noificationDetails
  );
  notification.get(
    "/count",
    _tokenManager.authenticate,
    notification_.NotificationCount
  );
  notification.delete(
    "/deleteAll",
    _tokenManager.authenticate,
    notification_.deleteAllNotification,
    handleResponse.RESPONSE
  );
  notification.put(
    "/toggle",
    _tokenManager.authenticate,
    notification_.toggleNotification,
    handleResponse.RESPONSE
  );
});

/* Date check Management */
router.group("/dateCheck", (dateCheck) => {
  dateCheck.get("/list", _dateCheck.activeDateCheck, handleResponse.RESPONSE);
});

/* Category Management */
router.group("/category", (category) => {
  category.get("/activeList", _category.activeList, handleResponse.RESPONSE);
});

/* Brand Management */
router.group("/brand", (brand) => {
  brand.get("/activeList", _brand.activeList, handleResponse.RESPONSE);
});

/* Banner Management  */
router.group("/banner", (banner) => {
  banner.get("/activeBanners", _banner.activeBanners, handleResponse.RESPONSE);
});

module.exports = router;
