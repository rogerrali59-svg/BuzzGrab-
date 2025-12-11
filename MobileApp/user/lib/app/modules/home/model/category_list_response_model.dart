class CategoryListResponseModel {
  bool? success;
  dynamic message;
  List<CategoryDataModel>? data;
  dynamic copyrighths;
  dynamic dateChecked;

  CategoryListResponseModel(
      {this.success,
        this.message,
        this.data,
        this.copyrighths,
        this.dateChecked});

  CategoryListResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <CategoryDataModel>[];
      json['data'].forEach((v) {
        data!.add(new CategoryDataModel.fromJson(v));
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

class CategoryDataModel {
  dynamic sId;
  dynamic title;
  dynamic description;
  dynamic image;
  dynamic createdAt;

  CategoryDataModel({this.sId, this.title,this.description,this.image,this
  .createdAt});

  CategoryDataModel.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    title = json['title'];
    description = json['description'];
    image = json['image'];
    createdAt = json['createdAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['title'] = this.title;
    data['description'] = this.description;
    data['image'] = this.image;
    data['createdAt'] = this.createdAt;
    return data;
  }
}

