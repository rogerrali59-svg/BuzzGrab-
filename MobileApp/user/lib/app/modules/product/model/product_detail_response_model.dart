class ProductDetailResponseModel {
  bool? success;
  dynamic message;
  ProductDetailDataModel? data;
  dynamic copyrighths;
  dynamic dateChecked;

  ProductDetailResponseModel(
      {this.success,
        this.message,
        this.data,
        this.copyrighths,
        this.dateChecked});

  ProductDetailResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new ProductDetailDataModel.fromJson(json['data']) : null;
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

class ProductDetailDataModel {
  dynamic sId;
  dynamic productName;
  dynamic description;
  dynamic ingredients;
  List<ProductImg>? productImg;
  dynamic price;
  dynamic size;
  dynamic category;
  dynamic brand;
  CreatedBy? createdBy;
  Location? location;
  dynamic address;
  dynamic stateId;
  dynamic averageRating;
  dynamic createdAt;
  dynamic updatedAt;
  dynamic isWishlist;
  dynamic iV;
  dynamic mrp;
  dynamic quantity;
  CategoryDetails? categoryDetails;
  CategoryDetails? brandDetails;

  ProductDetailDataModel(
      {this.sId,
        this.productName,
        this.description,
        this.ingredients,
        this.productImg,
        this.price,
        this.size,
        this.category,
        this.isWishlist,
        this.brand,
        this.createdBy,
        this.location,
        this.quantity,
        this.address,
        this.stateId,
        this.averageRating,
        this.createdAt,
        this.updatedAt,
        this.iV,
        this.mrp,
        this.categoryDetails,
        this.brandDetails});

  ProductDetailDataModel.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    productName = json['productName'];
    description = json['description'];
    quantity = json['quantity'];
    ingredients = json['ingredients'];
    isWishlist = json['isWishlist'];
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
    createdBy = json['createdBy'] != null
        ? new CreatedBy.fromJson(json['createdBy'])
        : null;
    location = json['location'] != null
        ? new Location.fromJson(json['location'])
        : null;
    address = json['address'];
    stateId = json['stateId'];
    averageRating = json['averageRating'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    mrp = json['mrp'];
    iV = json['__v'];
    categoryDetails = json['categoryDetails'] != null
        ? new CategoryDetails.fromJson(json['categoryDetails'])
        : null;
    brandDetails = json['brandDetails'] != null
        ? new CategoryDetails.fromJson(json['brandDetails'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['productName'] = this.productName;
    data['isWishlist'] = this.isWishlist;
    data['description'] = this.description;
    data['quantity'] = this.quantity;
    data['mrp'] = this.mrp;
    data['ingredients'] = this.ingredients;
    if (this.productImg != null) {
      data['productImg'] = this.productImg!.map((v) => v.toJson()).toList();
    }
    data['price'] = this.price;
    data['size'] = this.size;
    data['category'] = this.category;
    data['brand'] = this.brand;
    if (this.createdBy != null) {
      data['createdBy'] = this.createdBy!.toJson();
    }
    if (this.location != null) {
      data['location'] = this.location!.toJson();
    }
    data['address'] = this.address;
    data['stateId'] = this.stateId;
    data['averageRating'] = this.averageRating;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    if (this.categoryDetails != null) {
      data['categoryDetails'] = this.categoryDetails!.toJson();
    }
    if (this.brandDetails != null) {
      data['brandDetails'] = this.brandDetails!.toJson();
    }
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

class CreatedBy {
  dynamic sId;
  dynamic fullName;
  dynamic firstName;
  dynamic lastName;

  CreatedBy({this.sId, this.fullName, this.firstName, this.lastName});

  CreatedBy.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    fullName = json['fullName'];
    firstName = json['firstName'];
    lastName = json['lastName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['fullName'] = this.fullName;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
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

class CategoryDetails {
  dynamic sId;
  dynamic title;

  CategoryDetails({this.sId, this.title});

  CategoryDetails.fromJson(Map<String, dynamic> json) {
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