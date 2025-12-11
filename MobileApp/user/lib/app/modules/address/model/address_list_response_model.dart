import 'package:buzzgrab/app/modules/address/model/add_address_response_model.dart';

class AddressListResponseModel {
  bool? success;
  String? message;
  List<AddressDataModel>? data;
  String? copyrighths;
  String? dateChecked;

  AddressListResponseModel(
      {this.success,
        this.message,
        this.data,
        this.copyrighths,
        this.dateChecked});

  AddressListResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <AddressDataModel>[];
      json['data'].forEach((v) {
        data!.add(new AddressDataModel.fromJson(v));
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

