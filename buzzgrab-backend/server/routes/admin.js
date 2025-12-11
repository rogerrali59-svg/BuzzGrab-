/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var express = require("express");
var router = express.Router();
require("express-group-routes");
const cms = require("../app/cms/controller/page.controller");
const _cms = new cms();
const _faq = require("../app/faq/controller/faq.controller");
const {
  errorLogs_,
  _emailLogs,
  _loginActivity,
} = require("../app/errorLogs/controller/logsController");
const _user = require("../app/userService/controller/userController");
const _contact = require("../app/contactUs/controller/contactUs.controller");
const _smtp = require("../app/smtp/controller/smtp.controller");

const { upload } = require("../middleware/upload");
const _tokenManager = require("../middleware/auth");
const { rateLimitChecker } = require("../middleware/rateLimitChecker");
const { CONST } = require("../helpers/constant");

const notification = require("../app/notification/controller/notification.controller");
const notification_ = new notification();
const _backup = require("../app/backup/controller/backup.controller");
const _banner = require("../app/banner/controller/banner.controller");
const adminContact = require("../app/adminContactUs /controller/adminContactUs.controller");
const category = require("../app/category/controller/category.controller");
const _category = new category();
const brand = require("../app/brand/controller/brand.controller");
const brand_ = new brand();
const _planController = require("../app/plan/controller/plan.controller");
const userSmsLogs = require("../app/userService/controller/userController");
const _dateCheck = require("../app/dateCheck/controller/dateCheck.controller");
const _product = require("../app/product/controller/product.controller");
const _store = require("../app/store/controller/controller");
const _promocode = require("../app/promoCode/controller/controller");

/* User Management */
router.group("/user", (admin) => {
  admin.post(
    "/add",
    upload().fields([
      { name: "profileImg" },
      { name: "vehicleImg" },
      { name: "vehicleRegistrationImg" },
      { name: "insuranceImg" },
    ]),
    _user.addUser
  );
  admin.put(
    "/edit/:id",
    upload().fields([
      { name: "profileImg" },
      { name: "vehicleImg" },
      { name: "vehicleRegistrationImg" },
      { name: "insuranceImg" },
    ]),
    _user.editUserProfile
  );
  admin.get("/list", _user.getUsers);
  admin.get("/view/:id", _user.getUserById);
  admin.put("/updateState/:id", _user.updateState);
  admin.put("/verifyBackImg/:id", _user.verifyBackImg);
  admin.put("/verifyFrontImg/:id", _user.verifyFrontImg);
  admin.put("/verifySelfImg/:id", _user.verifySelfImg);
  admin.put("/ban/:id", _user.banUser);
  admin.get("/downloadUserReport", _user.downloadUserReport);
});

/* Category Management */
router.group("/category", (category) => {
  category.post("/add", upload().single("image"), _category.add);
  category.get("/list", _category.list);
  category.get("/detail/:id", _category.detail);
  category.put("/update/:id", upload().single("image"), _category.update);
  category.put("/updateState/:id", _category.updateState);
  category.delete("/delete/:id", _category.delete);
});

/* Brand Management */
router.group("/brand", (brand) => {
  brand.post("/add", upload().single("image"), brand_.add);
  brand.get("/list", brand_.list);
  brand.get("/detail/:id", brand_.detail);
  brand.put("/update/:id", upload().single("image"), brand_.update);
  brand.put("/updateState/:id", brand_.updateState);
  brand.delete("/delete/:id", brand_.delete);
});

/* Subscription plan Management  */
router.group("/subscription-plan", (plan) => {
  plan.get("/list", _planController.getPlanList);
  plan.post("/add", _planController.addPlan);
  plan.get("/detail/:id", _planController.planDetail);
  plan.delete("/delete/:id", _planController.deletePlan);
  plan.put("/update/:id", _planController.updatePlan);
  plan.put("/updateState/:id", _planController.updateState);
});

/* Content Management pages */
router.group("/cms", (cms) => {
  cms.post(
    "/add",
    rateLimitChecker(CONST.MAX_REQUEST, CONST.DURATION, CONST.BLOCK_DURATION),
    upload().single("image"),
    _cms.add
  );
  cms.get("/list", _cms.list);
  cms.get("/detail/:id", _cms.detail);
  cms.put("/update/:id", upload().single("image"), _cms.update);
  cms.put("/updateState/:id", _cms.updateState);
  cms.get("/getByType", _cms.getByType);
  cms.delete("/delete/:id", _cms.delete);
});

/* Faq Management  */
router.group("/faq", (faq) => {
  faq.get("/list", _faq.faqList);
  faq.post(
    "/add",
    rateLimitChecker(CONST.MAX_REQUEST, CONST.DURATION, CONST.BLOCK_DURATION),
    _faq.addFaq
  );
  faq.get("/detail/:id", _faq.faqDetails);
  faq.delete("/delete/:id", _faq.delete);
  faq.put("/edit/:id", _faq.editFaq);
  faq.put("/updateState/:id", _faq.updateFaqState);
});

/* Logs Management  */
router.group("/logs", (logs) => {
  logs.get("/errorList", errorLogs_.getLogs);
  logs.get("/errorView/:id", errorLogs_.logDetails);
  logs.delete("/deleteAll", errorLogs_.deleteAllErrorLog);
  logs.delete("/delete/:id", errorLogs_.deleteError);
});

/* Banner Management  */
router.group("/banner", (banner) => {
  banner.post("/add", upload().single("bannerImg"), _banner.addBanner);
  banner.get("/list", _banner.listBanners);
  banner.put("/update/:id", upload().single("bannerImg"), _banner.updateBanner);
  banner.get("/detail/:id", _banner.getSingleBanner);
  banner.put("/updateState/:id", _banner.updateBannerState);
  banner.delete("/delete/:id", _banner.deleteBanner);
});

/* Email Logs Management  */
router.group("/emailLogs", (email) => {
  email.get("/list", _emailLogs.emailList);
  email.get("/view/:id", _emailLogs.emailDetails);
  email.delete("/delete/:id", _emailLogs.deleteEmail);
  email.delete("/deleteAll", _emailLogs.deleteAllEmail);
});

/* Login Logs */
router.group("/loginActivity", (loginActivity) => {
  loginActivity.get("/list", _loginActivity.loginHistoryList);
  loginActivity.get("/details/:id", _loginActivity.viewLoginDetails);
  loginActivity.delete("/deleteAll", _loginActivity.deleteAllLoginHistory);
  loginActivity.delete("/delete/:id", _loginActivity.deleteLogs);
});

/* Dashboard Management*/
router.group("/dashboard", (dashboard) => {
  dashboard.get("/count", _user.dashboardCount);
  dashboard.get("/graphData/:year", _user.graphData);
});

/* contact-us Management  */
router.group("/contactUs", (contact) => {
  contact.get("/list", _contact.list);
  contact.get("/view/:id", _contact.view);
  contact.delete("/delete/:id", _contact.delete);
  contact.put("/reply/:id", _contact.reply);
});

/* admin-contact-us Management  */
router.group("/adminContactUs", (contact) => {
  contact.post("/add", adminContact.add);
  contact.put("/update/:id", adminContact.update);
  contact.get("/list", adminContact.list);
  contact.get("/view/:id", adminContact.view);
  contact.delete("/delete/:id", adminContact.delete);
});

/* Smtp Management  */
router.group("/smtp", (smtp) => {
  smtp.post(
    "/add",
    rateLimitChecker(CONST.MAX_REQUEST, CONST.DURATION, CONST.BLOCK_DURATION),
    _smtp.addSmtp
  );
  smtp.get("/list", _smtp.smtpList);
  smtp.put("/update/:id", _smtp.editSmtp);
  smtp.delete("/delete/:id", _smtp.deleteSmtp);
  smtp.get("/view/:id", _smtp.viewSmtp);
  smtp.put("/updateState/:id", _smtp.updateState);
});

/* twilio Management  */
router.group("/twillio", (twillio) => {
  twillio.post("/add", _smtp.addTwilio);
  twillio.get("/list", _smtp.TwilioList);
  twillio.put("/update/:id", _smtp.editTwilio);
  twillio.delete("/delete/:id", _smtp.deleteTwilio);
  twillio.get("/view/:id", _smtp.viewTwilio);
  twillio.put("/updateState/:id", _smtp.updateTwilioState);
});

/* stripe Management  */
router.group("/stripe", (stripe) => {
  stripe.post(
    "/add",
    rateLimitChecker(CONST.MAX_REQUEST, CONST.DURATION, CONST.BLOCK_DURATION),
    _smtp.addStripe
  );
  stripe.get("/list", _smtp.stripeList);
  stripe.put("/update/:id", _smtp.editStripe);
  stripe.delete("/delete/:id", _smtp.deleteStripe);
  stripe.get("/view/:id", _smtp.viewStripe);
  stripe.put("/updateState/:id", _smtp.updateStripeState);
});

/* Notification Management */
router.group("/notification", (notification) => {
  notification.get("/", notification_.getAdminNotificationList);
  notification.get("/view/:id", notification_.noificationDetails);
  notification.get("/count", notification_.NotificationCount);
  notification.delete("/deleteAll", notification_.deleteAllNotification);
});

/* backup  Management */
router.group("/db", (backup) => {
  backup.get("/backup/list", _backup.listing);
  backup.get("/downloadBackup/:id", _backup.download);
  backup.get("/delete/:id", _backup.delete);
  backup.post("/backup", _backup.create);
});

/* Login Logs */
router.group("/smsLogs", (smsLogs) => {
  smsLogs.get("/list", userSmsLogs.smsList);
  smsLogs.get("/details/:id", userSmsLogs.smsDetails);
  smsLogs.delete("/deleteAll", userSmsLogs.deleteAllSmsLog);
  smsLogs.delete("/delete/:id", userSmsLogs.deleteSms);
});

/* Date check Management */
router.group("/dateCheck", (dateCheck) => {
  dateCheck.post("/add", _dateCheck.add);
  dateCheck.get("/list", _dateCheck.list);
  dateCheck.get("/view/:id", _dateCheck.details);
  dateCheck.delete("/delete/:id", _dateCheck.delete);
});

/* Store Management */
router.group("/store", (store) => {
  store.post(
    "/add",
    upload().fields([{ name: "logo" }, { name: "coverImg" }]),
    _store.add
  );
  store.put(
    "/edit/:id",
    upload().fields([{ name: "logo" }, { name: "coverImg" }]),
    _store.update
  );
  store.get("/list", _store.list);
  store.get("/details/:id", _store.detail);
  store.delete("/delete/:id", _store.delete);
  store.put("/updateState/:id", _store.updateState);
  store.get("/subAdminList", _store.subAdminList);
  store.put("/assignStore/:id", _store.assignStore);
  store.put("/unAssign/:id", _store.unAssign);
  store.get("/storeList", _store.storeList);
});

/* Product Management  */
router.group("/product", (product) => {
  product.post(
    "/add",
    upload().fields([{ name: "productImg" }]),
    _product.addProduct
  );
  product.put(
    "/edit/:id",
    upload().fields([{ name: "productImg" }]),
    _product.editProduct
  );
  product.delete("/removeImage", _product.removeImage);
  product.get("/list", _product.adminProdcutList);
  product.get("/details/:id", _product.viewProduct);
  product.delete("/delete/:id", _product.deleteProduct);
  product.put("/updateState/:id", _product.updateState);
});

/* Promocode Management  */
router.group("/promotion", (promotion) => {
  promotion.post("/add", _promocode.add);
  promotion.get("/list", _promocode.list);
  promotion.get("/detail/:id", _promocode.details);
  promotion.put("/update/:id", _promocode.update);
  promotion.put("/updateState/:id", _promocode.updateState);
  promotion.delete("/delete/:id", _promocode.delete);
});

module.exports = router;
