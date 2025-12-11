/** 
@copyright : ToXsl Technologies Pvt. Ltd. 
@author     : Shiv Charan Panjeta 

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");
var cors = require("cors");
const mongoose = require("mongoose");
//mongoose.set("debug", true);
var swaggerAuthRouter = require("./routes/swaggerAuth"); // Add this line

/**Routes file  */
var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");
var userRouter = require("./routes/users");
var driverRouter = require("./routes/driver");

const { Error_Logs } = require("./app/errorLogs/model/logModal");
const handleResponse = require("./middleware/handleResponse");
const _tokenManager = require("./middleware/auth");
const { rateLimitChecker } = require("./middleware/rateLimitChecker");
const sanitizeMiddleware = require("./middleware/xss");
const activity = require("./app/activity/controller/activity.controller");
const seed = require("./helpers/seed");

const helmet = require("helmet");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/**
 * Middlewares
 */

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/public", express.static(path.join(__dirname, "/public/")));
app.use("/api/uploads", express.static(path.join(__dirname, "../uploads/")));
app.use(
  "/api/backupDump",
  express.static(path.join(__dirname, "../backupDump/"))
);
app.use("/api/swagger/", swaggerAuthRouter);

app.use(express.json());

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(logger("dev"));
app.use(cookieParser());
app.use(activity);
app.use(sanitizeMiddleware);
app.use(rateLimitChecker(400, 60, 60));
app.use(helmet());
seed();

app.use(
  "/api/uploads/backupDump",
  express.static(path.join(__dirname, "../uploads/backupDump/"))
);
app.use("/api", indexRouter);

app.use(
  "/api/admin",
  _tokenManager.admin,
  adminRouter,
  handleResponse.RESPONSE
);

app.use(
  "/api/users",
  _tokenManager.auth,
  userRouter,
  handleResponse.RESPONSE
);

app.use(
  "/api/driver",
  _tokenManager.driver,
  driverRouter,
  handleResponse.RESPONSE
);
require("./config/db/dbConfig");
require("./helpers/schedulers");
require("./helpers/logger");
require("./helpers/DBbackup");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(async function (err, req, res, next) {
  const ipAddress =
    req.header("x-forwarded-for") || req.socket.remoteAddress.split(":")[3];

  const errorLogs = {
    apiEndpoint: req.originalUrl,
    methodUsed: req.method,
    ip: ipAddress,
    url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    apiEndpoint: req.originalUrl,
    headers: req.headers,
    body: req.body,
    response: req.newRespData,
  };

  const payload = {
    errorCode: err ? err.statusCode || 400 : 400,
    errorName: req?.newRespData?.message
      ? req?.newRespData?.message
      : err?.message,
    description: err?.stack,
    ip: ipAddress,
    apiEndpoint: req.originalUrl,
    methodUsed: req.method,
    userAgent: req.headers["user-agent"],
  };

  const errorData = { ...errorLogs, ...payload };
  try {
    await Error_Logs.create(errorData);
  } catch (error) {
    console.error("Error logging failed:", error);
  }

  if (err.statusCode === 404) {
    return res.status(404).send({ message: "Api Not Found !" });
  }
});

module.exports = app;
