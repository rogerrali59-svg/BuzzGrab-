import 'dart:convert';

ForgotPasswordModel forgotPasswordModelFromJson(String str) => ForgotPasswordModel.fromJson(json.decode(str));

String forgotPasswordModelToJson(ForgotPasswordModel data) => json.encode(data.toJson());

class ForgotPasswordModel {
  String? message;
  String? copyrights;

  ForgotPasswordModel({
    this.message,
    this.copyrights,
  });

  factory ForgotPasswordModel.fromJson(Map<String, dynamic> json) => ForgotPasswordModel(
    message: json["message"],
    copyrights: json["copyrights"],
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "copyrights": copyrights,
  };
}
