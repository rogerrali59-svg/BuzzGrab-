/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

const cron = require("node-cron");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const { exec } = require("child_process");
const process= require("process")
let dotenv = require("dotenv");
dotenv.config();

// Ensure the backupDump directory exists
const uploadsDir = path.join(__dirname, "../../uploads/backupDump");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create directory if it doesn't exist
}

// Schedule the cron job to run every minute
cron.schedule('0 0 * * *', async () => {

  // Get the current date and time in YYYY-MM-DD-HH-mm format
  const timestamp = moment().format('YYYY-MM-DD-HH-mm'); // Include time to avoid overwriting
  const dumpPath = path.join(uploadsDir, `mongodump-${timestamp}.gz`); // Use .gz extension for gzip

  console.log('Timestamp:', timestamp);
  console.log('Dump path:', dumpPath);

  // Command to create a MongoDB dump
  const command = `mongodump --db basenode --gzip --archive=${dumpPath} --verbose > dump.log 2>&1`;

  console.log('Command to execute:', command);

  // Execute the command
  exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error creating MongoDB dump: ${error.message}`);
          return;
      }
      if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
      }
      console.log(`MongoDB dump created successfully at: ${dumpPath}`);
      console.log(`stdout: ${stdout}`); // Log stdout for additional info

      // Clean up old dumps after successful creation of a new one
      cleanupOldDumps();
  });
});

console.log('Cron job scheduled to run every day at midnight.');

// Function to clean up old dump files, keeping only the latest 10
function cleanupOldDumps() {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`);
      return;
    }

    // Filter for .gz files and sort them by creation time
    const dumpFiles = files
      .filter((file) => file.endsWith(".gz"))
      .sort((a, b) => {
        return (
          fs.statSync(path.join(uploadsDir, a)).mtime -
          fs.statSync(path.join(uploadsDir, b)).mtime
        );
      });

    // Check if we have more than 10 dump files
    if (dumpFiles.length > 10) {
      const filesToDelete = dumpFiles.slice(0, dumpFiles.length - 10);
      const deletePromises = filesToDelete.map((file) => {
        return new Promise((resolve, reject) => {
          const filePath = path.join(uploadsDir, file);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${file}: ${err.message}`);
              reject(err);
            } else {
              console.log(`Deleted old dump file: ${file}`);
              resolve();
            }
          });
        });
      });

      // Wait for all deletions to complete
      Promise.all(deletePromises)
        .then(() => {
          console.log("Cleanup completed: old dump files deleted.");
        })
        .catch((err) => {
          console.error(`Error during cleanup: ${err.message}`);
        });
    } else {
      console.log(
        "No old dump files to delete. Current count:",
        dumpFiles.length
      );
    }
  });
}


//use this command inside the terminal
// mongorestore --archive=/home/local/TOXSL/ashish.singh/Desktop/Toxsl/NEXT_LEVEL/nextlevel-node-2090/uploads/backupDump/mongodump-2025-01-31-10-37.gz --gzip
