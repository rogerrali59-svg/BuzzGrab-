/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

class ResponseModel {
  bool? success;
  String? message;
  int? isNotificationEnabled;
  bool? isFavourite;
  String? copyrighths;


  ResponseModel(
      {this.success,
      this.message,
      this.isNotificationEnabled,
      this.copyrighths});

  ResponseModel.fromJson(Map json) {
    success = json['success'];
    message = json['message'];
    isFavourite = json['is_favourite'];
    isNotificationEnabled = json['is_notify'];
    copyrighths = json['copyrighths'];
  }

  Map toJson() {
    final Map data = {};
    data['success'] = success;
    data['message'] = message;
    data['is_favourite'] = isFavourite;
    data['is_notify'] = isNotificationEnabled;
    data['copyrighths'] = copyrighths;
    return data;
  }
}
