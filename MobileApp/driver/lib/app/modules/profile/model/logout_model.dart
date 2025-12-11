import 'dart:convert';

LogoutModel logoutModelFromJson(String str) => LogoutModel.fromJson(json.decode(str));

String logoutModelToJson(LogoutModel data) => json.encode(data.toJson());

class LogoutModel {
  String? message;
  bool? success;
  String? copyrights;

  LogoutModel({
    this.message,
    this.success,
    this.copyrights,
  });

  factory LogoutModel.fromJson(Map<String, dynamic> json) => LogoutModel(
    message: json["message"],
    success: json["success"],
    copyrights: json["copyrights"],
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "success": success,
    "copyrights": copyrights,
  };
}
