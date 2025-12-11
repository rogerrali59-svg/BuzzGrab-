class BannerListResponseModel {
  bool? success;
  dynamic message;
  List<BannerDataModel>? data;
  dynamic copyrighths;
  dynamic dateChecked;

  BannerListResponseModel(
      {this.success,
        this.message,
        this.data,
        this.copyrighths,
        this.dateChecked});

  BannerListResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <BannerDataModel>[];
      json['data'].forEach((v) {
        data!.add(new BannerDataModel.fromJson(v));
      });
    }
    copyrighths = json['copyrighths'];
    dateChecked = json['dateChecked'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    data['copyrighths'] = this.copyrighths;
    data['dateChecked'] = this.dateChecked;
    return data;
  }
}

class BannerDataModel {
  dynamic sId;
  dynamic bannerImg;
  dynamic stateId;
  dynamic createdBy;
  dynamic createdAt;
  dynamic updatedAt;
  dynamic iV;

  BannerDataModel(
      {this.sId,
        this.bannerImg,
        this.stateId,
        this.createdBy,
        this.createdAt,
        this.updatedAt,
        this.iV});

  BannerDataModel.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    bannerImg = json['bannerImg'];
    stateId = json['stateId'];
    createdBy = json['createdBy'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['bannerImg'] = this.bannerImg;
    data['stateId'] = this.stateId;
    data['createdBy'] = this.createdBy;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}
