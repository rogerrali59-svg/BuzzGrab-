import 'package:get/get_rx/src/rx_types/rx_types.dart';

class ProductListResponseModel {
  bool? success;
  dynamic message;
  List<ProductDataModel>? data;
  Meta? mMeta;
  dynamic copyrighths;
  dynamic dateChecked;

  ProductListResponseModel(
      {this.success,
        this.message,
        this.data,
        this.mMeta,
        this.copyrighths,
        this.dateChecked});

  ProductListResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <ProductDataModel>[];
      json['data'].forEach((v) {
        data!.add(new ProductDataModel.fromJson(v));
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

class ProductDataModel {
  dynamic sId;
  dynamic productName;
  dynamic description;
  dynamic ingredients;
  List<ProductImg>? productImg;
  dynamic price;
  dynamic mrp;
  dynamic quantity;
  dynamic size;
  dynamic category;
  dynamic brand;
  dynamic createdBy;
  Location? location;
  dynamic address;
  dynamic stateId;
  dynamic averageRating;
  dynamic createdAt;
  dynamic updatedAt;
  dynamic iV;
  // dynamic isWishlist;

  RxBool isWishlist = false.obs;

  ProductDataModel(
      {this.sId,
        this.productName,
        this.description,
        this.ingredients,
        this.productImg,
        this.mrp,
        this.price,
        this.quantity,
        this.size,
        this.category,
        this.brand,
        this.createdBy,
        this.location,
        this.address,
        this.stateId,
        this.averageRating,
        this.createdAt,
        this.updatedAt,
        bool? isWishlist,
        this.iV}){
    this.isWishlist.value = isWishlist ?? false;
  }

  ProductDataModel.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    mrp = json['mrp'];
    productName = json['productName'];
    description = json['description'];
    ingredients = json['ingredients'];
    quantity = json['quantity'];
    if (json['productImg'] != null) {
      productImg = <ProductImg>[];
      json['productImg'].forEach((v) {
        productImg!.add(new ProductImg.fromJson(v));
      });
    }
    price = json['price'];
    size = json['size'];
    category = json['category'];
    brand = json['brand'];
    createdBy = json['createdBy'];
    location = json['location'] != null
        ? new Location.fromJson(json['location'])
        : null;
    address = json['address'];
    stateId = json['stateId'];
    averageRating = json['averageRating'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
    // isWishlist = json['isWishlist'];
    isWishlist.value = json['isWishlist'] == true;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['productName'] = this.productName;
    data['mrp'] = this.mrp;
    data['quantity'] = this.quantity;
    data['description'] = this.description;
    data['ingredients'] = this.ingredients;
    if (this.productImg != null) {
      data['productImg'] = this.productImg!.map((v) => v.toJson()).toList();
    }
    data['price'] = this.price;
    data['size'] = this.size;
    data['category'] = this.category;
    data['brand'] = this.brand;
    data['createdBy'] = this.createdBy;
    if (this.location != null) {
      data['location'] = this.location!.toJson();
    }
    data['address'] = this.address;
    data['stateId'] = this.stateId;
    data['averageRating'] = this.averageRating;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['isWishlist'] = this.isWishlist;
    data['__v'] = this.iV;
    return data;
  }
}

class ProductImg {
  dynamic url;
  dynamic type;
  dynamic sId;

  ProductImg({this.url, this.type, this.sId});

  ProductImg.fromJson(Map<String, dynamic> json) {
    url = json['url'];
    type = json['type'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['url'] = this.url;
    data['type'] = this.type;
    data['_id'] = this.sId;
    return data;
  }
}

class Location {
  dynamic type;
  List<int>? coordinates;

  Location({this.type, this.coordinates});

  Location.fromJson(Map<String, dynamic> json) {
    type = json['type'];
    coordinates = json['coordinates'].cast<int>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['type'] = this.type;
    data['coordinates'] = this.coordinates;
    return data;
  }
}

class Meta {
  dynamic totalCount;
  dynamic pageCount;
  dynamic currentPage;
  dynamic perPage;

  Meta({this.totalCount, this.pageCount, this.currentPage, this.perPage});

  Meta.fromJson(Map<String, dynamic> json) {
    totalCount = json['totalCount'];
    pageCount = json['pageCount'];
    currentPage = json['currentPage'];
    perPage = json['perPage'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['totalCount'] = this.totalCount;
    data['pageCount'] = this.pageCount;
    data['currentPage'] = this.currentPage;
    data['perPage'] = this.perPage;
    return data;
  }
}
