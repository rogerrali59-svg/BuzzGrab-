/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

export const constant = Object.freeze({


  /*******************Role****************/
  ADMIN_ROLE: 1,
  SUBADMIN_ROLE: 2,
  USER_ROLE: 3,
  DRIVER_ROLE: 4,

  /******************Gender***************/
  MALE: 1,
  FEMALE: 2,
  OTHERS: 3,

  /**************Status *********************/
  ACTIVE: 1,
  INACTIVE: 2,
  DELETED: 3,
  BLOCK: 4,
  DEACTIVE: 5,

  /**********************CMS Pages ****************************/

  ABOUT_US: 1,
  TERM_CONDITION: 2,
  PRIVACY_POLICY: 3,

  /****************Email Queue****************/

  EMAIL_SUCCESS: 1,
  EMAIL_FAILED: 2,
  EMAIL_PENDING: 3,

  /*****************Login Activity*************/

  LOGIN: 1,
  LOGIN_FAIL: 2,


  /*****************Subscription type and duration*****************/

  DOLLAR: "$",

  SUBSCRIPTION_MONTH: 1,
  SUBSCRIPTION_THREE_MONTH: 2,
  SUBSCRIPTION_SIX_MONTH: 3,
  SUBSCRIPTION_YEAR: 4,


  /******************************COPY RIGHTS *******/
  COMPANY_NAME: "OZVID Technologies Pvt. Ltd.",
  COMPANY_LINK: "https://ozvid.com/",
  PROJECT_NAME: "BuzzGrab",


  DOC_VERIFY_APPROVED: 2,
  DOC_VERIFY_REJECTED: 3,

  PRODUCT_PENDING: 1,
  PRODUCT_ACTIVE: 2,
  PRODUCT_INACTIVE: 3,
  PRODUCT_DELETED: 4,
  PRODUCT_OUT_OF_STOCK: 5,

});

export const Paginations = Object.freeze({
  DEFAULT_PAGE: 1,
  PER_PAGE: 10,
  PER_PAGE_FIVE: 5
});
