/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const winston = require("winston");
// Create a logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "../combined.log" }),
    new winston.transports.Console(),
  ],
});

// Handle uncaught exceptions
process.on("uncaughtException", (ex) => {
  logger.error(ex.message, ex);
  console.log(ex.message, ex);
  return ex;
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (ex) => {
  throw ex;
});
