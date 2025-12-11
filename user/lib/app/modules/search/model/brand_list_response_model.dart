class BrandListResponseModel {
  bool? success;
  dynamic message;
  List<BrandDataModel>? data;
  dynamic copyrighths;
  dynamic dateChecked;

  BrandListResponseModel(
      {this.success,
        this.message,
        this.data,
        this.copyrighths,
        this.dateChecked});

  BrandListResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <BrandDataModel>[];
      json['data'].forEach((v) {
        data!.add(new BrandDataModel.fromJson(v));
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

class BrandDataModel {
  dynamic sId;
  dynamic title;

  BrandDataModel({this.sId, this.title});

  BrandDataModel.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    return data;
  }
}
