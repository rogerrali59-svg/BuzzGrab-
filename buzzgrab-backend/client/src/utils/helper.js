/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { constant, Paginations } from "./constant";


// Email regrex
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


// Restict alpha
export const restrictAlpha = (e) => {
  const re = /[0-9A-F:]+/g;
  if (!re.test(e.key)) {
    e.preventDefault();
  }
};


// Restric numeric
export const restrictNum = (e) => {
  const re = /[0-9A-F:]+/g;
  if (re.test(e.key)) {
    e.preventDefault();
  }
};


// Truncate
export const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};


// Serial number
export const serialNumber = (page, index) => {
  if (page) {
    return (page - 1) * Paginations?.PER_PAGE + index + 1;
  }
};


// For editor validation 
export const isRichTextEmpty = (value) => {
  const stripped = value.replace(/<[^>]*>/g, '').trim();
  return stripped === "";
};


// DOB Format
// export const formatDOB = (dob) => {
//   if (!dob) return "";
//   const [day, month, year] = dob.split("-");
//   return `${year}-${month}-${day}`;
// };


export const formatDOB = (dob) => {
  if (!dob) return "";
  const [month, day, year] = dob.split("-");
  return `${year}-${month}-${day}`;
};


// Size for like ML, L
export const sizeRegex = /^\d+(\.\d+)?\s*(ml)$/i;

export const toBackendDOB = (dob) => {
  if (!dob) return "";
  const [year, month, day] = dob.split("-");
  return `${month}-${day}-${year}`;
};


export function formatCurrency(amount, currency = "USD") {
  // Ensure amount is a number and round to 2 decimal places
  const formattedAmount = Number(Number(amount)?.toFixed(2)) ?? 0;

  // Format as specified currency
  const currencyFormatted = formattedAmount?.toLocaleString("en-US", {
    style: "currency",
    currency: currency,
  });

  return currencyFormatted;
}