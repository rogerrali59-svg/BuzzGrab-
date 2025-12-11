/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

enum ViewType { bottomNav, drawer }

const GOOGLE_PLACES_API_KEY = "AIzaSyCqhzWY8M87aT6Ys_9kC1X1nFIhaAiYaKo";
// const GOOGLE_PLACES_API_KEY = "";

const constEmail = 1;
const constPhone = 2;

const HOME = 1;
const WORK = 2;
const OTHER = 3;

const constPrivacyPolicy = 0;
const constTermAndCondition = 1;

/// track order const
const STATE_PENDING = 0;
const STATE_ACCEPT = 1;
const STATE_REJECT = 2;
const STATE_ASSIGN = 3;
const STATE_DECLINE = 4;
const STATE_PICKUP = 5;
const STATE_ON_THE_WAY = 6;
const STATE_ARRIVAL = 7;
const STATE_DELIEVERED = 8;
const STATE_CANCELLED = 9;
const STATE_RETURNED = 10;

const PENDING_BOOKING = 1;
const ACCEPTED_BOOKING = 2;
const ONGOING_BOOKING = 3;
const REJECTED_BOOKING = 4;
const CANCELLED_BOOKING = 5;
const COMPLETE_BOOKING = 6;
const PICKUP_BOOKING = 8;
const DROP_BOOKING = 9;

/// Google const

const double initialMapZoomLevel = 12;
const double animateMapZoomLevel = 14;

/// Notification
const ADMIN_NOTIFICATION = 1;
const USER_REGISTRATION_NOTIFICATION = 2;
const DRIVER_NOTIFICATION = 3;
const CUSTOMER_NOTIFICATION = 4;
const QUERY_TICKET_NOTIFICATION = 5;
const NEW_BOOKING_REQUEST = 6;

/// Driver side
const BOOKING_CONFIRMED = 7;
const PARCEL_PICKED_UP = 8;
const PARCEL_DROPPED = 9;
const DELIVERY_STARTED = 10;
const DELIVERY_ENDED = 11;
const BOOKING_CANCELLED = 12;
const BOOKING_UPDATED = 13;
const NEW_MESSAGE = 14;
const REVIEW_ADDED = 15;

const ADMIN = 1;
const PROVIDER = 3;
const CUSTOMER = 2;

const FREELANCE = 1;
const COMPANY = 2;
const ENGLISH = 'en';
const FRENCH = 'fr';
const PORTUGUESE = 'pt';

const ACCEPT_ORDER = 8;
const REJECT_ORDER = 7;

// ORDER STATUS
const ORDER_PENDING = 1;
const ORDER_ACCEPTED = 2;
const ORDER_READY_FOR_PICKUP = 3;
const ORDER_OUT_FOR_DELIVERY = 4;
const ORDER_COMPLETED = 5;
const ORDER_CANCELLED = 6;
const ORDER_REJECT = 7;
const ORDER_ACCEPTED_BY_DRIVER = 8;

// PRODUCT CATEGORY
const BEER = 1;
const WINES = 2;
const SPIRITS = 3;
const SNACKS = 4;

const RESTAURANT = 3;
const DRIVER = 4;

// PAYMENT TYPE
const PAYMENT_ONLINE = 1;
const PAYMENT_CASH = 2;
