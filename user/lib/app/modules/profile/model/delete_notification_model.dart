import 'dart:convert';

DeleteAllNotificationModel deleteAllNotificationModelFromJson(String str) => DeleteAllNotificationModel.fromJson(json.decode(str));

String deleteAllNotificationModelToJson(DeleteAllNotificationModel data) => json.encode(data.toJson());

class DeleteAllNotificationModel {
  String? message;
  int? status;

  DeleteAllNotificationModel({
    this.message,
    this.status,
  });

  factory DeleteAllNotificationModel.fromJson(Map<String, dynamic> json) => DeleteAllNotificationModel(
    message: json["message"],
    status: json["status"],
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "status": status,
  };
}
