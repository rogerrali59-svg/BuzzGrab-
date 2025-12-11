/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { Badge } from "react-bootstrap";
import { constant } from "./constant";

export const CheckAdminState = (state) => {
  switch (state) {
    case constant.ACTIVE:
      return <Badge bg="success">Active</Badge>;
    case constant?.INACTIVE:
      return <Badge bg="warning">In-Active</Badge>;
    case constant?.DELETED:
      return <Badge bg="danger">Delete</Badge>;
    case constant?.DEACTIVE:
      return <Badge bg="primary">Deactive</Badge>;
    case constant?.BLOCK:
      return <Badge bg="danger">Block</Badge>;
    default:
      break;
  }
};


/**
 * Login activity status
 * @param {*} stateId 
 * @returns 
 */
export const LoginActivityStatus = (stateId) => {
  if (stateId == constant.LOGIN) {
    return <Badge bg="success">Login</Badge>;
  }
  else if (stateId == constant.LOGIN_FAIL) {
    return <Badge bg="danger">Fail</Badge>;
  }
  else {
    return "N/A";
  }
};



/**
 * Email queue status
 * @param {*} stateId 
 * @returns 
 */
export const EmailQueueStatus = (stateId) => {
  if (stateId == constant.EMAIL_SUCCESS) {
    return <Badge bg="success">Success</Badge >;
  }
  else if (stateId == constant.EMAIL_FAILED) {
    return <Badge bg="danger">Failed</Badge>;
  }
  else if (stateId == constant.EMAIL_PENDING) {
    return <Badge bg="info">Pending</Badge>;
  }
  else {
    return "N/A";
  }
};


/**
 * CMS type 
 * @param {*} value 
 * @returns 
 */
export const cmsType = (value) => {
  if (value == constant.TERM_CONDITION) {
    return <Badge bg="primary">Terms & Conditions</Badge>;
  }
  else if (value == constant.PRIVACY_POLICY) {
    return <Badge bg="info">Privacy Policy</Badge>;
  }
  else if (value == constant.ABOUT_US) {
    return <Badge bg="secondary">About Us</Badge>;
  }
};


/**
 * Gender type
 * @param {*} state 
 * @returns 
 */
export const GenderType = (state) => {
  switch (state) {
    case constant.MALE:
      return <span>Male</span>;
    case constant?.FEMALE:
      return <span>Female</span>;
    case constant?.OTHERS:
      return <span>Others</span>;
    default:
      break;
  }
};


/**
 * Subscription type 
 * @param {*} value 
 * @returns 
 */
export const subscriptionType = (value) => {
  if (value == constant.SUBSCRIPTION_MONTH) {
    return <Badge bg="primary">Monthly</Badge>;
  }
  else if (value == constant.SUBSCRIPTION_SIX_MONTH) {
    return <Badge bg="info">Quarterly</Badge>;
  }
  else if (value == constant.SUBSCRIPTION_THREE_MONTH) {
    return <Badge bg="warning">Half-Yearly</Badge>;
  }
  else if (value == constant.SUBSCRIPTION_YEAR) {
    return <Badge bg="secondary">Yearly</Badge>;
  }
};

export const ProductStatus = (state) => {
  switch (state) {
    case constant?.PRODUCT_PENDING:
      return <Badge bg="info">Pending</Badge>;
    case constant.PRODUCT_ACTIVE:
      return <Badge bg="success">Active</Badge>;
    case constant?.PRODUCT_INACTIVE:
      return <Badge bg="warning">In-Active</Badge>;
    case constant?.PRODUCT_DELETED:
      return <Badge bg="danger">Delete</Badge>;
    case constant?.PRODUCT_OUT_OF_STOCK:
      return <Badge bg="danger">Out of stock</Badge>;

    default:
      break;
  }
};