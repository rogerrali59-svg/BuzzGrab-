/**
 *
 *@copyright : OZVID Technologies Pvt Ltd. < www.ozvid.com >
 *@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of OZVID Technologies Pvt Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
// var FCM = require("fcm-push");
const {
  Notification,
} = require("../app/notification/model/notification.model");
const { CONST } = require("../helpers/constant");
var FCM = require("fcm-push");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const serviceAccount = require("./../config/fcmNotificationsKey.json"); // Replace with the path to your service account JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const fcm = admin.messaging();

dotenv.config();

module.exports = {
  sendNotification: async (deviceToken, title, description, type, body) => {
    try {
      const message = {
        token: deviceToken, // Use token if sending to a single device
        data: {
          title: title ? title : "",
          body: body ? body : "",
          description: description ? description : "",
          type: type ? type?.toString() : "",
        },
        notification: {
          title: title ? title : "",
          body: body ? body : "",
        },
      };
     

      const response = await fcm.send(message);
      console.log("Successfully sent message:", response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
};
