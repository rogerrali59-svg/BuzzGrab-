/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

const jwt = require("jsonwebtoken");
const { CONST } = require("../helpers/constant");
const dotenv = require("dotenv");
const { USER } = require("../app/userService/model/userModel");
dotenv.config();

const _tokenManager = {};

const { RateLimiterMemory } = require("rate-limiter-flexible");

const getToken = function (req) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Handle token presented as a Bearer token in the Authorization header
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

/*Common middleware*/
_tokenManager.authenticate = async (req, res, next) => {
  if (req.headers["authorization"]) {
    let token = getToken(req);
    const secret = process.env.JWT_SECRET || "Development";
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        // Custom error handling for expired/invalid tokens
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your session has expired. Please log in again.",
          });
        } else if (err.name === "JsonWebTokenError") {
          // Handles other JWT errors like invalid signature
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "Invalid token. Please contact support.", // Custom message for invalid token
          });
        } else {
          // Handle other potential errors
          console.error("JWT Verification Error:", err);
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "An unexpected error occurred. Please contact support.", // Generic error message
          });
        }
      }

      if (decoded) {
        const checkUser = await USER.findOne({
          _id: decoded.userId,
        });

        if (!checkUser) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }

        if (checkUser?.stateId == CONST.DELETED) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your account has been deleted",
          });
        }
        if (checkUser?.stateId == CONST.INACTIVE) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your account is inactive, Contact admin",
          });
        }
        if (checkUser?.token == "") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        req.user = checkUser;
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        req.email = decoded.email;
        req.token = token;
        next();
      } else {
        return res.status(403).json({
          success: false,
          dateCheck: CONST.dateCheck,
          message: "Invalid token",
        });
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      dateCheck: CONST.dateCheck,
      message: "Authentication token not provided",
    });
  }
};

/*Admin middleware*/
_tokenManager.admin = (req, res, next) => {
  if (req.headers["authorization"]) {
    let token = getToken(req);

    const secret = process.env.JWT_SECRET || "Development";

    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        // Custom error handling for expired/invalid tokens
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your session has expired. Please log in again.",
          });
        } else if (err.name === "JsonWebTokenError") {
          // Handles other JWT errors like invalid signature
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "Invalid token. Please contact support.", // Custom message for invalid token
          });
        } else {
          // Handle other potential errors
          console.error("JWT Verification Error:", err);
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "An unexpected error occurred. Please contact support.", // Generic error message
          });
        }
      }
      if (decoded) {
        const checkUser = await USER.findOne({
          _id: decoded.userId,
        });

        if (!checkUser) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }

        // if (
        //   checkUser.roleId != CONST.ADMIN ||
        //   checkUser.roleId != CONST.SUB_ADMIN
        // ) {
        //   return res.status(401).send({
        //     statusCode: 401,
        //     success: false,
        //     message: "unauthorized access",
        //   });
        // }

        if (checkUser.token == "") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }

        req.user = checkUser;
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        req.email = decoded.email;
        //req.customerId = decoded.customerId;
        next();
      } else {
        return res.status(403).json({
          success: false,
          dateCheck: CONST.dateCheck,
          message: "Invalid token",
        });
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      dateCheck: CONST.dateCheck,
      message: "Authentication token not provided",
    });
  }
};

/*Driver middleware*/
_tokenManager.driver = async (req, res, next) => {
  if (req.headers["authorization"]) {
    let token = getToken(req);
    const secret = process.env.JWT_SECRET || "Development";
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        // Custom error handling for expired/invalid tokens
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your session has expired. Please log in again.",
          });
        } else if (err.name === "JsonWebTokenError") {
          // Handles other JWT errors like invalid signature
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "Invalid token. Please contact support.", // Custom message for invalid token
          });
        } else {
          // Handle other potential errors
          console.error("JWT Verification Error:", err);
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "An unexpected error occurred. Please contact support.", // Generic error message
          });
        }
      }

      if (decoded) {
        const checkUser = await USER.findOne({
          _id: decoded.userId,
        });

        if (checkUser.roleId != CONST.DRIVER) {
          return res.status(401).json({
            statusCode: 401,
            success: false,
            message: "Unauthorized access.",
          });
        }

        if (!checkUser) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        if (checkUser?.stateId == CONST.DELETED) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your account has been deleted",
          });
        }
        if (checkUser?.stateId == CONST.INACTIVE) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your account is inactive, Contact admin",
          });
        }
        if (checkUser?.token == "") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        req.user = checkUser;
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        req.email = decoded.email;
        req.token = token;
        next();
      } else {
        return res.status(403).json({
          success: false,
          dateCheck: CONST.dateCheck,
          message: "Invalid token",
        });
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      dateCheck: CONST.dateCheck,
      message: "Authentication token not provided",
    });
  }
};

/*User middleware*/
_tokenManager.auth = async (req, res, next) => {
  if (req.headers["authorization"]) {
    let token = getToken(req);
    const secret = process.env.JWT_SECRET || "Development";
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        // Custom error handling for expired/invalid tokens
        if (err.name === "TokenExpiredError") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your session has expired. Please log in again.",
          });
        } else if (err.name === "JsonWebTokenError") {
          // Handles other JWT errors like invalid signature
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "Invalid token. Please contact support.", // Custom message for invalid token
          });
        } else {
          // Handle other potential errors
          console.error("JWT Verification Error:", err);
          return res.status(403).send({
            statusCode: 403,
            success: false,
            message: "An unexpected error occurred. Please contact support.", // Generic error message
          });
        }
      }

      if (decoded) {
        const checkUser = await USER.findOne({
          _id: decoded.userId,
        });

        if (!checkUser) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }

        if (checkUser.roleId != CONST.USER) {
          return res.status(401).json({
            statusCode: 401,
            success: false,
            message: "Unauthorized access.",
          });
        }

        if (checkUser?.stateId == CONST.DELETED) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your account has been deleted",
          });
        }
        if (checkUser?.stateId == CONST.INACTIVE) {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Your account is inactive, Contact admin",
          });
        }
        if (checkUser?.token == "") {
          return res.status(401).send({
            statusCode: 401,
            success: false,
            message: "Session expired",
          });
        }
        req.user = checkUser;
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        req.email = decoded.email;
        req.token = token;
        next();
      } else {
        return res.status(403).json({
          success: false,
          dateCheck: CONST.dateCheck,
          message: "Invalid token",
        });
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      dateCheck: CONST.dateCheck,
      message: "Authentication token not provided",
    });
  }
};

module.exports = _tokenManager;
