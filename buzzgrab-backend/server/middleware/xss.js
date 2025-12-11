/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */
const xss = require('xss');

function sanitizeMiddleware(req, res, next) {

  // Ensure req.body is an object
  if (typeof req.body === 'object' && req.body !== null) {
    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // Ensure req.query is an object
  if (typeof req.query === 'object' && req.query !== null) {
    for (let key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        req.query[key] = xss(req.query[key]);
      }
    }
  }

  // Ensure req.params is an object
  if (typeof req.params === 'object' && req.params !== null) {
    for (let key in req.params) {
      if (req.params.hasOwnProperty(key)) {
        req.params[key] = xss(req.params[key]);
      }
    }
  }

  // Call the next middleware or route handler
  next();
}

module.exports = sanitizeMiddleware;