/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

const { USER } = require("../app/userService/model/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { CONST } = require("./constant");
const logger = require("winston");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.DB_URL);

const createAdmin = async () => {
  const payload = {
    fullName: "Admin",
    firstName: "Admin",
    lastName: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(
      process.env.ADMIN_EMAIL_PWD,
      parseInt(process.env.SALT_ROUNDS)
    ),
    roleId: CONST.ADMIN,
    stateId: CONST.ACTIVE,
    isVerified: true,
    isTermsCondition: true,
    isProfileCompleted: true,
  };

  const isEXists = await USER.findOne({
    email: payload.email,
    roleId: CONST.ADMIN,
  });
  if (isEXists) {
    logger.info(`Admin already created`);
    return; // exit the function here
  } else {
    const createAdmin = await USER.create(payload);
    if (createAdmin) {
      logger.info(`Admin created successfully`);
    } else {
      logger.info(`Admin not created`);
    }
  }
};

const seed = async () => {
  await createAdmin();
  logger.info("Seeding completed successfully");
};

module.exports = seed;
