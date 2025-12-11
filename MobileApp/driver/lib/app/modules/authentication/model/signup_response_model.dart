import 'dart:convert';

// Main UserResponseModel class
UserResponseModel userResponseModelFromJson(String str) =>
    UserResponseModel.fromJson(json.decode(str));

String userResponseModelToJson(UserResponseModel data) =>
    json.encode(data.toJson());

class UserResponseModel {
  bool? success;
  String? message;
  UserData? data;

  UserResponseModel({
    this.success,
    this.message,
    this.data,
  });

  factory UserResponseModel.fromJson(Map<String, dynamic> json) =>
      UserResponseModel(
        success: json["success"],
        message: json["message"],
        data: json["data"] == null ? null : UserData.fromJson(json["data"]),
      );

  Map<String, dynamic> toJson() => {
    "success": success,
    "message": message,
    "data": data?.toJson(),
  };
}

// UserData class that holds user-specific data
class UserData {
  String? id;
  String? token;
  String? firstName;
  String? lastName;
  String? countryCode;
  String? mobile;
  String? email;
  dynamic dob;
  bool? isVerified;
  bool? isNotify;
  int? isNotificationOn;
  bool? isProfileCompleted;
  bool? isDocumentVerified;
  String? uniqueUserId;
  DateTime? createdAt;
  DateTime? updatedAt;
  String? fullName;
  String? reason;
  String? profileImg;
  String? insuranceImg;
  String? vehicleImg;
  String? vehicleRegistrationImg;
  Location? location;

  UserData({
    this.id,
    this.token,
    this.firstName,
    this.lastName,
    this.countryCode,
    this.mobile,
    this.email,
    this.dob,
    this.isVerified,
    this.isNotify,
    this.isNotificationOn,
    this.isProfileCompleted,
    this.isDocumentVerified,
    this.uniqueUserId,
    this.createdAt,
    this.updatedAt,
    this.fullName,
    this.reason,
    this.profileImg,
    this.insuranceImg,
    this.vehicleImg,
    this.vehicleRegistrationImg,
    this.location,
  });

  factory UserData.fromJson(Map<String, dynamic> json) => UserData(
    id: json["_id"],
    token: json["token"],
    firstName: json["firstName"],
    lastName: json["lastName"],
    countryCode: json["countryCode"],
    mobile: json["mobile"],
    email: json["email"],
    dob: json["dob"],
    isVerified: json["isVerified"],
    isNotify: json["isNotify"],
    isNotificationOn: json["isNotificationOn"],
    isProfileCompleted: json["isProfileCompleted"],
    isDocumentVerified: json["isDocumentVerified"],
    uniqueUserId: json["uniqueUserId"],
    createdAt: json["createdAt"] == null ? null : DateTime.parse(json["createdAt"]),
    updatedAt: json["updatedAt"] == null ? null : DateTime.parse(json["updatedAt"]),
    fullName: json["fullName"],
    reason: json["reason"],
    profileImg: json["profileImg"],
    insuranceImg: json["insuranceImg"],
    vehicleImg: json["vehicleImg"],
    vehicleRegistrationImg: json["vehicleRegistrationImg"],
    location: json["location"] == null ? null : Location.fromJson(json["location"]),
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "token": token,
    "firstName": firstName,
    "lastName": lastName,
    "countryCode": countryCode,
    "mobile": mobile,
    "email": email,
    "dob": dob,
    "isVerified": isVerified,
    "isNotify": isNotify,
    "isNotificationOn": isNotificationOn,
    "isProfileCompleted": isProfileCompleted,
    "isDocumentVerified": isDocumentVerified,
    "uniqueUserId": uniqueUserId,
    "createdAt": createdAt?.toIso8601String(),
    "updatedAt": updatedAt?.toIso8601String(),
    "fullName": fullName,
    "reason": reason,
    "profileImg": profileImg,
    "insuranceImg": insuranceImg,
    "vehicleImg": vehicleImg,
    "vehicleRegistrationImg": vehicleRegistrationImg,
    "location": location?.toJson(),
  };
}

// Location class for storing geolocation data
class Location {
  String? type;
  List<double>? coordinates;

  Location({
    this.type,
    this.coordinates,
  });

  factory Location.fromJson(Map<String, dynamic> json) => Location(
    type: json["type"],
    coordinates: List<double>.from(json["coordinates"].map((x) => x.toDouble())),
  );

  Map<String, dynamic> toJson() => {
    "type": type,
    "coordinates": coordinates,
  };
}
