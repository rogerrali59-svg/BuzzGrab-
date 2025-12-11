/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const Activity = require('../model/activity.model');

const activityLogger = async (req, res, next) => {

  const logActivity = async (statusCode, errorMessage = null) => {
    const activityData = {
      date: Date.now(),
      error: errorMessage || (statusCode >= 400 ? `API hit failed with status ${statusCode}` : `API hit successfully with status ${statusCode}`),
      url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      method: req.method,
      reqMethod: JSON.stringify(req.body),
      userIP: req.socket.remoteAddress.split(":")[3] || req.headers['x-forwarded-for'] || req?.ip?.replace(/^::ffff:/, ''),
      email: req.body.email
    };

    try {
      await Activity.create(activityData);
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  };

  try {
    await next();
  } catch (error) {
    const errorMessage = `Server error: ${error.name} - ${error.message}`;
    await logActivity(500, errorMessage);
  }

};

module.exports = activityLogger;