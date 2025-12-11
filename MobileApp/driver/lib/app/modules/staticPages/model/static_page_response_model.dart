class StaticPageResponseModel {
  Data? data;
  int? status;

  StaticPageResponseModel({this.data, this.status});

  StaticPageResponseModel.fromJson(Map<String, dynamic> json) {
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
    status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['status'] = this.status;
    return data;
  }
}

class Data {
  int? typeId;
  String? title;
  String? content;

  Data({this.typeId, this.title, this.content});

  Data.fromJson(Map<String, dynamic> json) {
    typeId = json['type_id'];
    title = json['title'];
    content = json['description'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type_id'] = this.typeId;
    data['title'] = this.title;
    data['description'] = this.content;
    return data;
  }
}
