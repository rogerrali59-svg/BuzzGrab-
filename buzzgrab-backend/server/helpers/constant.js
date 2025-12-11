/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

// constant values set for date check, failure status, crypt token
module.exports.CONST = {
  backupFileName: "backup_",
  FileNAmeSliceFrom: 0,
  FileNAmeSliceTo: 10,
  backupDirPath: "../backupDump/",
  PAGE_NO: 1,
  PAGE_LIMIT: 10,
  MAX_PAGE_LIMIT: 50,
  EXPIRE_MIN: 5,
  MAX_REQUEST: 10,
  DURATION: 60,
  BLOCK_DURATION: 60,

  ADMIN: 1,
  SUB_ADMIN: 2,
  USER: 3,
  DRIVER: 4,

  EXPIRE_DATE: 1,
  PAO: 2,

  ACTIVE: 1,
  INACTIVE: 2,
  DELETED: 3,
  BAN: 4,

  MALE: 1,
  FEMALE: 2,
  OTHERS: 3,

  ABOUT: 1,
  TERMS: 2,
  PRIVACY: 3,
  CANCEL_POLICY: 4,
  OTHER_PAGE: 6,

  SUCCESS: 1,
  FAILED: 2,
  ERROR: 2,

  WEB: 1,
  ANDROID: 2,
  IOS: 3,

  LOGIN: 1,
  LOGIN_FAIL: 2,

  TRUE: 1,
  FALSE: 2,

  SAVE: 1,
  UN_SAVE: 2,

  NOTIFICATION_OFF: 1,
  NOTIFICATION_ON: 2,

  NEW: 0,
  REPLIED: 1,

  PRODUCT_STATE_ID: {
    PENDING: 1,
    ACTIVE: 2,
    INACTIVE: 3,
    DELETED: 4,
    OUT_OF_STOCK: 5,
  },

  NOTIFICATION_STATE: {
    STATE_ID: {
      ACTIVE: 0,
      INACTIVE: 1,
      DELETED: 2,
    },
  },

  ALL: 1,
  AUTO: 2,
  MANUAL: 3,

  LANGUAGE: {
    STATE_ID: {
      HINDI: 1,
      ENGLISH: 2,
      SPANISH: 3,
    },
  },

  NOTIFICATION_STATE: {
    STATE_ID: {
      ACTIVE: 0,
      INACTIVE: 1,
      DELETED: 2,
      ADMIN: 3,
      USER: 4,
    },
  },

  CHAT: {
    STATE_ID: {
      ACTIVE: 1,
      INACTIVE: 2,
      DELETED: 3,
    },
  },

  SUBSCRIPTION_TYPE: {
    BASIC: 1,
    PREMIUM: 2,
    GOLD: 3,
  },

  DURATION_TYPE: {
    MONTHLY: 1,
    YEARLY: 2,
    QUARTERLY: 3,
  },

  ERROR_TYPE: {
    API: 1,
    APP: 2,
    WEB: 3,
  },

  CATEGORY: 1,
  PROVIDER: 3,

  PLAN_TYPE: {
    MONTH: 1,
    THREE_MONTH: 2,
    SIX_MONTH: 3,
    YEAR: 4,
  },

  ORDER_STATEID: {
    PENDING: 1,
    READY: 2,
    SHIPPED: 3,
    COMPLETED: 4,
    CANCELED: 5,
    UNDERPROCESS: 6,
    ORDERDELETED: 7,
  },

  ONLINE: 1,
  OFFLINE: 2,

  PROMOTION: 1,
  CASHBACK: 2,

  DOC_VERIFY: {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
  },

  /************************** Project Setup **************************/

  PROJECT_NAME: "BuzzGrab",
  PROJECT_DESCRIPTION:"A complete platform consisting of a customer app, driver app, and admin web panel to manage alcohol ordering and delivery. It enables easy online ordering, age-verified deliveries, real-time tracking, automated workflows, efficient driver and inventory management, and full operational visibility—ensuring safe, compliant, and convenient delivery for all users.",
  SWAGGER_URL: "/api/swagger",

  /************************** Project Setup **************************/
};
