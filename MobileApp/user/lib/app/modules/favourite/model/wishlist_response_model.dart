import '../../cart/model/cart_list_response_model.dart';
import '../../home/model/load_chat_response_model.dart';

class WishListResponseModel {
  bool? success;
  dynamic message;
  List<WishlistDataModel>? data;
  Meta? mMeta;
  dynamic copyrighths;
  dynamic dateChecked;

  WishListResponseModel(
      {this.success,
        this.message,
        this.data,
        this.mMeta,
        this.copyrighths,
        this.dateChecked});

  WishListResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <WishlistDataModel>[];
      json['data'].forEach((v) {
        data!.add(new WishlistDataModel.fromJson(v));
      });
    }
    mMeta = json['_meta'] != null ? new Meta.fromJson(json['_meta']) : null;
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
    if (this.mMeta != null) {
      data['_meta'] = this.mMeta!.toJson();
    }
    data['copyrighths'] = this.copyrighths;
    data['dateChecked'] = this.dateChecked;
    return data;
  }
}

class WishlistDataModel {
  dynamic sId;
  dynamic productId;
  dynamic createdBy;
  bool? isWishlist;
  dynamic createdAt;
  dynamic updatedAt;
  dynamic iV;
  ProductDetails? productDetails;

  WishlistDataModel(
      {this.sId,
        this.productId,
        this.createdBy,
        this.isWishlist,
        this.createdAt,
        this.updatedAt,
        this.iV,
        this.productDetails});

  WishlistDataModel.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    productId = json['productId'];
    createdBy = json['createdBy'];
    isWishlist = json['isWishlist'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
    productDetails = json['productDetails'] != null
        ? new ProductDetails.fromJson(json['productDetails'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['productId'] = this.productId;
    data['createdBy'] = this.createdBy;
    data['isWishlist'] = this.isWishlist;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    if (this.productDetails != null) {
      data['productDetails'] = this.productDetails!.toJson();
    }
    return data;
  }
}



