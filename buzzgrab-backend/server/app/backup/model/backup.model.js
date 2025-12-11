/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const mongoose = require("mongoose");
const backupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    size: {
      type: String,
    },
    path: {
      type: String,
    },
    link:{
      type:String,
    },
    baseFolder: {
      type: String,
    },
    folder: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.DB_BACKUP_MODEL = mongoose.model("db-backup", backupSchema);

