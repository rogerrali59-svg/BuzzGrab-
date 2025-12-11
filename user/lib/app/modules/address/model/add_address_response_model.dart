class AddAddressResponseModel {
  bool? success;
  dynamic message;
  AddressDataModel? data;
  dynamic copyrighths;
  dynamic dateChecked;

  AddAddressResponseModel(
      {this.success,
        this.message,
        this.data,
        this.copyrighths,
        this.dateChecked});

  AddAddressResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new AddressDataModel.fromJson(json['data']) : null;
    copyrighths = json['copyrighths'];
    dateChecked = json['dateChecked'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['copyrighths'] = this.copyrighths;
    data['dateChecked'] = this.dateChecked;
    return data;
  }
}

class AddressDataModel {
  dynamic name;
  dynamic countryCode;
  dynamic mobile;
  dynamic house;
  dynamic building;
  dynamic landMark;
  dynamic createdBy;
  bool? isDefault;
  Location? location;
  dynamic stateId;
  dynamic sId;
  dynamic createdAt;
  dynamic updatedAt;
  dynamic iV;

  AddressDataModel(
      {this.name,
        this.countryCode,
        this.mobile,
        this.house,
        this.building,
        this.landMark,
        this.createdBy,
        this.isDefault,
        this.location,
        this.stateId,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  AddressDataModel.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    countryCode = json['countryCode'];
    mobile = json['mobile'];
    house = json['house'];
    building = json['building'];
    landMark = json['landMark'];
    createdBy = json['createdBy'];
    isDefault = json['isDefault'];
    location = json['location'] != null
        ? new Location.fromJson(json['location'])
        : null;
    stateId = json['stateId'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['countryCode'] = this.countryCode;
    data['mobile'] = this.mobile;
    data['house'] = this.house;
    data['building'] = this.building;
    data['landMark'] = this.landMark;
    data['createdBy'] = this.createdBy;
    data['isDefault'] = this.isDefault;
    if (this.location != null) {
      data['location'] = this.location!.toJson();
    }
    data['stateId'] = this.stateId;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Location {
  dynamic type;
  List<double>? coordinates;

  Location({this.type, this.coordinates});

  Location.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    coordinates = json['coordinates'].cast<double>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['coordinates'] = this.coordinates;
    return data;
  }
}
