/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

class AuthRequestModel {
  static logCrashErrorReq({
    error,
    packageVersion,
    phoneModel,
    ip,
    stackTrace,
  }) {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['error'] = error;
    data['link'] = packageVersion;
    data['referer_link'] = phoneModel;
    data['user_ip'] = ip;
    data['description'] = stackTrace;
    return data;
  }
}
