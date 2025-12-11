import 'package:intl_phone_field/countries.dart';

class RememberMeModel {
  String? email;
  String? mobile;
  String? password;
  String? countryCode;
  String? countryIsoCode;
  Country? selectedCountry;

  RememberMeModel({
    this.email,
    this.mobile,
    this.password,
    this.countryIsoCode,
    this.countryCode,
  });

  RememberMeModel.fromJson(Map<String, dynamic> json) {
    email = json['email'];
    countryCode = json['countryCode'];
    countryIsoCode = json['countryIsoCode'];
    mobile = json['mobile'];
    password = json['password'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['email'] = email;
    data['mobile'] = mobile;
    data['password'] = password;
    data['countryIsoCode'] = countryIsoCode;
    data['countryCode'] = countryCode;
    return data;
  }
}
