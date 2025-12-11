class UserDataResponseModel {
  int? id;
  dynamic fullName;
  dynamic email;
  dynamic dateOfBirth;
  dynamic gender;
  dynamic contactNo;
  dynamic address;
  dynamic latitude;
  dynamic longitude;
  dynamic city;
  dynamic country;
  dynamic profileFile;
  dynamic zipcode;
  dynamic language;
  dynamic tos;
  dynamic roleId;
  dynamic isOtpVerified;
  dynamic otp;
  int? stateId;
  int? typeId;
  dynamic timezone;
  String? createdOn;

  UserDataResponseModel(
      {this.id,
      this.fullName,
      this.email,
      this.dateOfBirth,
      this.gender,
      this.contactNo,
      this.address,
      this.latitude,
      this.longitude,
      this.city,
      this.profileFile,
      this.country,
      this.otp,
      this.isOtpVerified,
      this.zipcode,
      this.language,
      this.tos,
      this.roleId,
      this.stateId,
      this.typeId,
      this.timezone,
      this.createdOn});

  UserDataResponseModel.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    fullName = json['full_name'];
    email = json['email'];
    dateOfBirth = json['date_of_birth'];
    gender = json['gender'];
    contactNo = json['contact_no'];
    address = json['address'];
    latitude = json['latitude'];
    profileFile = json['profile_file'];
    longitude = json['longitude'];
    isOtpVerified = json['is_otp_verified'];
    otp = json['otp'];
    city = json['city'];
    country = json['country'];
    zipcode = json['zipcode'];
    language = json['language'];
    tos = json['tos'];
    roleId = json['role_id'];
    stateId = json['state_id'];
    typeId = json['type_id'];
    timezone = json['timezone'];
    createdOn = json['created_on'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['full_name'] = this.fullName;
    data['email'] = this.email;
    data['date_of_birth'] = this.dateOfBirth;
    data['gender'] = this.gender;
    data['contact_no'] = this.contactNo;
    data['address'] = this.address;
    data['latitude'] = this.latitude;
    data['profile_file'] = this.profileFile;
    data['longitude'] = this.longitude;
    data['is_otp_verified'] = this.isOtpVerified;
    data['otp'] = this.otp;
    data['city'] = this.city;
    data['country'] = this.country;
    data['zipcode'] = this.zipcode;
    data['language'] = this.language;
    data['tos'] = this.tos;
    data['role_id'] = this.roleId;
    data['state_id'] = this.stateId;
    data['type_id'] = this.typeId;
    data['timezone'] = this.timezone;
    data['created_on'] = this.createdOn;
    return data;
  }
}
