class LocationResponseModel {
  dynamic name;
  dynamic street;
  dynamic isoCountryCode;
  dynamic country;
  dynamic postalCode;
  dynamic administrativeArea;
  dynamic subadministrativeArea;
  dynamic locality;
  dynamic sublocality;
  dynamic thoroughfare;
  dynamic subthoroughfare;

  LocationResponseModel(
      {this.name,
        this.street,
        this.isoCountryCode,
        this.country,
        this.postalCode,
        this.administrativeArea,
        this.subadministrativeArea,
        this.locality,
        this.sublocality,
        this.thoroughfare,
        this.subthoroughfare});

  LocationResponseModel.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    street = json['street'];
    isoCountryCode = json['iso_country_code'];
    country = json['country'];
    postalCode = json['postal_code'];
    administrativeArea = json['administrative_area'];
    subadministrativeArea = json['subadministrative_area'];
    locality = json['locality'];
    sublocality = json['sublocality'];
    thoroughfare = json['thoroughfare'];
    subthoroughfare = json['subthoroughfare'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['street'] = this.street;
    data['iso_country_code'] = this.isoCountryCode;
    data['country'] = this.country;
    data['postal_code'] = this.postalCode;
    data['administrative_area'] = this.administrativeArea;
    data['subadministrative_area'] = this.subadministrativeArea;
    data['locality'] = this.locality;
    data['sublocality'] = this.sublocality;
    data['thoroughfare'] = this.thoroughfare;
    data['subthoroughfare'] = this.subthoroughfare;
    return data;
  }
}
