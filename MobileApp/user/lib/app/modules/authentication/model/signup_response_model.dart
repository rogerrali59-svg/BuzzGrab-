import 'dart:convert';

UserResponseModel userResponseModelFromJson(String str) =>
    UserResponseModel.fromJson(json.decode(str));

String userResponseModelToJson(UserResponseModel data) =>
    json.encode(data.toJson());

class UserResponseModel {
  UserData? data;
  dynamic status;
  dynamic message;

  UserResponseModel({
    this.data,
    this.status,
    this.message,
  });

  factory UserResponseModel.fromJson(Map<String, dynamic> json) =>
      UserResponseModel(
        data: json["data"] == null ? null : UserData.fromJson(json["data"]),
        status: json["status"],
        message: json["message"],
      );

  Map<String, dynamic> toJson() => {
        "data": data?.toJson(),
        "status": status,
        "message": message,
      };
}

class UserData {
  dynamic id;
  dynamic token;
  dynamic profilePic;
  BankDetails? bankDetails;
  VehicleDetails? vehicleDetails;
  dynamic password;
  DateTime? lastLogin;
  dynamic isSuperuser;
  dynamic email;
  dynamic isStaff;
  dynamic isActive;
  DateTime? dateJoined;
  DateTime? createdOn;
  DateTime? updatedOn;
  dynamic username;
  dynamic fullName;
  dynamic restaurantName;
  dynamic firstName;
  dynamic lastName;
  dynamic mobileNo;
  dynamic countryIsoCode;
  dynamic countryCode;
  dynamic verificationDocument;
  dynamic drivingLicence;
  dynamic roleId;
  dynamic status;
  dynamic address;
  dynamic latitude;
  dynamic longitude;
  dynamic tempOtp;
  dynamic gender;
  dynamic isVerified;
  dynamic isAdminVerified;
  dynamic isAddress;
  dynamic isProfileSetup;
  dynamic notificationEnable;
  dynamic emailNotification;
  dynamic smsNotification;
  dynamic sessionId;
  dynamic dob;
  dynamic language;
  dynamic isProfileCompleted;
  dynamic createdBy;
  List<dynamic>? groups;
  List<dynamic>? userPermissions;
  List<dynamic>? restaurantImages;

  UserData({
    this.id,
    this.token,
    this.profilePic,
    this.bankDetails,
    this.vehicleDetails,
    this.password,
    this.isAddress,
    this.lastLogin,
    this.isSuperuser,
    this.email,
    this.isStaff,
    this.isActive,
    this.dateJoined,
    this.dob,
    this.createdOn,
    this.updatedOn,
    this.username,
    this.gender,
    this.fullName,
    this.restaurantName,
    this.firstName,
    this.lastName,
    this.mobileNo,
    this.countryIsoCode,
    this.countryCode,
    this.verificationDocument,
    this.drivingLicence,
    this.roleId,
    this.status,
    this.isProfileCompleted,
    this.address,
    this.latitude,
    this.longitude,
    this.tempOtp,
    this.isVerified,
    this.isAdminVerified,
    this.isProfileSetup,
    this.notificationEnable,
    this.emailNotification,
    this.smsNotification,
    this.sessionId,
    this.language,
    this.createdBy,
    this.groups,
    this.userPermissions,
    this.restaurantImages,
  });

  factory UserData.fromJson(Map<String, dynamic> json) => UserData(
        id: json["id"],
        token: json["token"],
    isAddress: json["isAddress"],
    dob: json["dob"],
    isProfileCompleted: json["isProfileCompleted"],
        profilePic: json["profileImg"],
        bankDetails: json["bank_details"] == null
            ? null
            : BankDetails.fromJson(json["bank_details"]),
        vehicleDetails: json["vehicle_details"] == null
            ? null
            : VehicleDetails.fromJson(json["vehicle_details"]),
        password: json["password"],
        lastLogin: json["last_login"] == null
            ? null
            : DateTime.parse(json["last_login"]),
        isSuperuser: json["is_superuser"],
        email: json["email"],
    gender: json["gender"],
        isStaff: json["is_staff"],
        isActive: json["is_active"],
        dateJoined: json["date_joined"] == null
            ? null
            : DateTime.parse(json["date_joined"]),
        createdOn: json["created_on"] == null
            ? null
            : DateTime.parse(json["created_on"]),
        updatedOn: json["updated_on"] == null
            ? null
            : DateTime.parse(json["updated_on"]),
        username: json["username"],
        fullName: json["fullName"],
        restaurantName: json["restaurant_name"],
        firstName: json["first_name"],
        lastName: json["last_name"],
        mobileNo: json["mobile"],
        countryIsoCode: json["IOSCode"],
        countryCode: json["countryCode"],
        verificationDocument: json["verification_document"],
        drivingLicence: json["driving_licence"],
        roleId: json["role_id"],
        status: json["status"],
        address: json["address"],
        latitude: json["latitude"],
        longitude: json["longitude"],
        tempOtp: json["temp_otp"],
        isVerified: json["isVerified"],
        isAdminVerified: json["is_admin_verified"],
        isProfileSetup: json["is_profile_setup"],
        notificationEnable: json["notification_enable"],
        emailNotification: json["email_notification"],
        smsNotification: json["sms_notification"],
        sessionId: json["session_id"],
        language: json["language"],
        createdBy: json["created_by"],
        groups: json["groups"] == null
            ? []
            : List<dynamic>.from(json["groups"]!.map((x) => x)),
        userPermissions: json["user_permissions"] == null
            ? []
            : List<dynamic>.from(json["user_permissions"]!.map((x) => x)),
        restaurantImages: json["restaurant_images"] == null
            ? []
            : List<dynamic>.from(json["restaurant_images"]!.map((x) => x)),
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "token": token,
        "profileImg": profilePic,
        "isAddress": isAddress,
        "isProfileCompleted": isProfileCompleted,
        "gender": gender,
        "bank_details": bankDetails?.toJson(),
        "vehicle_details": vehicleDetails?.toJson(),
        "password": password,
        "last_login": lastLogin?.toIso8601String(),
        "is_superuser": isSuperuser,
        "email": email,
        "is_staff": isStaff,
        "is_active": isActive,
        "date_joined": dateJoined?.toIso8601String(),
        "created_on": createdOn?.toIso8601String(),
        "updated_on": updatedOn?.toIso8601String(),
        "username": username,
        "fullName": fullName,
        "restaurant_name": restaurantName,
        "first_name": firstName,
        "last_name": lastName,
        "mobile": mobileNo,
        "IOSCode": countryIsoCode,
        "countryCode": countryCode,
        "verification_document": verificationDocument,
        "driving_licence": drivingLicence,
        "role_id": roleId,
        "status": status,
        "address": address,
        "latitude": latitude,
        "longitude": longitude,
        "temp_otp": tempOtp,
        "isVerified": isVerified,
        "is_admin_verified": isAdminVerified,
        "is_profile_setup": isProfileSetup,
        "notification_enable": notificationEnable,
        "email_notification": emailNotification,
        "sms_notification": smsNotification,
        "session_id": sessionId,
        "language": language,
        "created_by": createdBy,
        "groups":
            groups == null ? [] : List<dynamic>.from(groups!.map((x) => x)),
        "user_permissions": userPermissions == null
            ? []
            : List<dynamic>.from(userPermissions!.map((x) => x)),
        "restaurant_images": restaurantImages == null
            ? []
            : List<dynamic>.from(restaurantImages!.map((x) => x)),
      };
}

class BankDetails {
  dynamic id;
  DateTime? createdOn;
  DateTime? updatedOn;
  dynamic accountNumber;
  dynamic cardNumber;
  dynamic cvv;
  dynamic expiryDate;
  dynamic routingNumber;
  dynamic bankName;
  dynamic user;

  BankDetails({
    this.id,
    this.createdOn,
    this.updatedOn,
    this.accountNumber,
    this.cardNumber,
    this.cvv,
    this.expiryDate,
    this.routingNumber,
    this.bankName,
    this.user,
  });

  factory BankDetails.fromJson(Map<String, dynamic> json) => BankDetails(
        id: json["id"],
        createdOn: json["created_on"] == null
            ? null
            : DateTime.parse(json["created_on"]),
        updatedOn: json["updated_on"] == null
            ? null
            : DateTime.parse(json["updated_on"]),
        accountNumber: json["account_number"],
        cardNumber: json["card_number"],
        cvv: json["cvv"],
        expiryDate: json["expiry_date"],
        routingNumber: json["routing_number"],
        bankName: json["bank_name"],
        user: json["user"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "created_on": createdOn?.toIso8601String(),
        "updated_on": updatedOn?.toIso8601String(),
        "account_number": accountNumber,
        "card_number": cardNumber,
        "cvv": cvv,
        "expiry_date": expiryDate,
        "routing_number": routingNumber,
        "bank_name": bankName,
        "user": user,
      };
}

class VehicleDetails {
  dynamic id;
  DateTime? createdOn;
  DateTime? updatedOn;
  dynamic registrationCertificate;
  dynamic insurance;
  dynamic pollution;
  dynamic registrationNumber;
  dynamic user;

  VehicleDetails({
    this.id,
    this.createdOn,
    this.updatedOn,
    this.registrationCertificate,
    this.insurance,
    this.pollution,
    this.registrationNumber,
    this.user,
  });

  factory VehicleDetails.fromJson(Map<String, dynamic> json) => VehicleDetails(
        id: json["id"],
        createdOn: json["created_on"] == null
            ? null
            : DateTime.parse(json["created_on"]),
        updatedOn: json["updated_on"] == null
            ? null
            : DateTime.parse(json["updated_on"]),
        registrationCertificate: json["registration_certificate"],
        insurance: json["insurance"],
        pollution: json["pollution"],
        registrationNumber: json["registration_number"],
        user: json["user"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "created_on": createdOn?.toIso8601String(),
        "updated_on": updatedOn?.toIso8601String(),
        "registration_certificate": registrationCertificate,
        "insurance": insurance,
        "pollution": pollution,
        "registration_number": registrationNumber,
        "user": user,
      };
}
