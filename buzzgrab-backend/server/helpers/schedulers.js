/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const {
  Notification,
} = require("../app/notification/model/notification.model");
const { USER } = require("../app/userService/model/userModel");
const { CONST } = require('../helpers/constant');
let nodemailer = require("../helpers/nodemailer");
const moment = require('moment');
const cron = require("node-cron");
const { sendNotification } = require("./fcmPushNotification");


function formatErrorResponse(error) {
  // Ensure the error object and its structure are valid
  // Remove all double quotes from the message
  let message = error.replace(/"/g, "");

  // Capitalize the first letter of the message
  message = message.charAt(0).toUpperCase() + message.slice(1);

  // Return the formatted message inside a response object
  return message;
}

async function reminderExpiredProduct(userId) {
  try {
    const today = moment().startOf('day'); // Set to start of the day
    const tomorrow = moment(today).add(1, 'days'); // Set to start of the next day

    const reminders = await Reminder.find({
      remindAt: {
        $gte: today.toDate(),
        $lt: tomorrow.toDate(),
      },
      stateId: CONST.ACTIVE,
      createdBy: userId
    });

    if (reminders.length > 0) {
      for (const reminder of reminders) {
        const product = await PRODUCT.findOne({ _id: reminder.productId })

        const user = await USER.findOne({ _id: userId })
        const reminderDate = moment(reminder.remindAt).startOf('day');

        if (reminderDate.isSame(today, 'day')) {

          console.log('In the notificaton case')


          const adminData = await USER.findOne({ roleId: CONST.ADMIN });

          // await Notification({
          //   title: "Reminder Expires Today",
          //   description: `Your product has expires today.`,
          //   from: adminData._id,
          //   to: reminder.createdBy,
          //   type: CONST.NOTIFICATION_STATE.STATE_ID.REMINDER,
          // }).save();
          let findUser = await USER.findOne({ _id: reminder.createdBy })
          await Notification({
            title: "Reminder Expires Today",
            description: `Your product has expires today.`,
            from: reminder.createdBy,
            to: adminData._id,
            type: CONST.NOTIFICATION_STATE.STATE_ID.REMINDER,
          }).save();

          // Push Notification (assumes the user has a device token stored)
          if (findUser.deviceToken && findUser.isNotificationOn == CONST.NOTIFICATION_ON) {
            await sendNotification(
              findUser.deviceToken,
              "Reminder Expires Today",
              "Your product has expires today.",
              CONST.NOTIFICATION_STATE.STATE_ID.EXPIRE_SUBSCRIPTION
            );
          }

          const smtp = await nodemailer.smtpCredential();
          if (smtp.host && smtp.port && smtp.email && smtp.password) {
            await nodemailer.reminderExpireProduct(
                product.name,
                product.image,
                product.expireDate,
                user.firstName,
                user.email
              );
          }
          
          // Update the stateId for the reminder after sending the notification
          await Reminder.findByIdAndUpdate(
            reminder._id,
            { $set: { stateId: CONST.CLOSE } }
          );

        }
      }
    } else {

    }
  } catch (error) {
    console.error('Error updating expired products:', error);
  }
}

//Cron job to reminder expired
cron.schedule('0 0 * * *', async () => {
  try {
    const users = await USER.find({ roleId: { $ne: CONST.ADMIN } });

    for (const user of users) {
      try {
        await reminderExpiredProduct(user._id);
      } catch (userError) {
        console.error(`Error processing user ${user._id}:`, userError);
      }
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

//Cron job to buy subscription expired
cron.schedule('0 0 * * *', async () => {
  try {
    // Get the current date
    const currentDate = new Date();
    // Reset time to midnight (00:00:00) to ignore time
    currentDate.setHours(0, 0, 0, 0);

    // Get the current date in YYYY-MM-DD format
    const currentDateString = currentDate.toISOString().split('T')[0];

    // Find subscriptions that expire today
    const expiringSubscriptions = await SUBSCRIPTION_MODEL.find({
      status: 'active',
      isNotificationSend: false
    });


    // Filter subscriptions to find those expiring today
    const subscriptionsExpiringToday = expiringSubscriptions.filter(subscription => {
      const endDate = new Date(subscription.endDate * 1000); // Convert Unix timestamp to Date
      endDate.setHours(0, 0, 0, 0); // Reset time to midnight
      const endDateString = endDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      return endDateString === currentDateString; // Compare dates
    });


    // Send notifications for each expiring subscription
    for (const subscription of subscriptionsExpiringToday) {
      const adminData = await USER.findOne({ roleId: CONST.ADMIN });
      const user = await USER.findOne({ _id: subscription.createdBy })
      const planData = await PLAN.findOne({ _id: subscription.planId })
      await Notification({
        title: "Subscription Expires Today",
        description: `Your subscription (${subscription.subscriptionId}) expires today.`,
        from: adminData._id,
        to: subscription._id,
        type: CONST.NOTIFICATION_STATE.STATE_ID.EXPIRE_SUBSCRIPTION,
      }).save();
       
      
      // Push Notification (assumes the user has a device token stored)
      if (user.deviceToken && user.isNotificationOn == CONST.NOTIFICATION_ON) {
        await sendNotification(
          user.deviceToken,
          "Subscription Expires Today",
          `Your subscription (${subscription.subscriptionId}) expires today.`,
          CONST.NOTIFICATION_STATE.STATE_ID.EXPIRE_SUBSCRIPTION
        );
      }

      const endDate = new Date(subscription.endDate * 1000); // Convert Unix timestamp to Date
      endDate.setUTCHours(0, 0, 0, 0); // Reset time to midnight in UTC
      const endDateString = endDate.toISOString().split('T')[0];
      await nodemailer.subscriptionExpire(
        user.email,
        planData.name,
        subscription.amount,
        endDateString
      );
      await SUBSCRIPTION_MODEL.updateOne({ _id: subscription._id }, { $set: { isNotificationSend: true } })
    }

    console.log(`Checked subscriptions expiring today. Found: ${subscriptionsExpiringToday.length}`);
  } catch (error) {
    console.error('Error checking expiring subscriptions:', error);
  }
});

//Cron job to product expired
cron.schedule('0 0 * * * ', async () => {
  try {
    const today = moment().startOf('day'); // Set to start of the day

    // Find products that are active and have an expireDate that has passed
    const expiredProducts = await PRODUCT.find({
      expireDate: { $lt: today.toDate() }, // Check if expireDate is less than today
      stateId: CONST.ACTIVE,
    });

    if (expiredProducts.length > 0) {
      for (const product of expiredProducts) {
        // Update the stateId to CONST.EXPIRE for expired products
        await PRODUCT.findByIdAndUpdate(
          product._id,
          { $set: { stateId: CONST.EXPIRE } }
        );
      }
    }
  } catch (error) {
    console.error('Error checking expiring subscriptions:', error);
  }
});



module.exports.formatErrorResponse = formatErrorResponse;


