class CartListResponseModel {
  bool? success;
  dynamic message;
  CartDataModel? data;
  dynamic copyrighths;
  dynamic dateChecked;

  CartListResponseModel(
      {this.success,
        this.message,
        this.data,
        this.copyrighths,
        this.dateChecked});

  CartListResponseModel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new CartDataModel.fromJson(json['data']) : null;
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

class CartDataModel {
  List<CartList>? cartList;
  dynamic subTotal;
  dynamic orderTotal;
  dynamic total;
  dynamic cartCount;

  CartDataModel(
      {this.cartList,
        this.subTotal,
        this.orderTotal,
        this.total,
        this.cartCount});

  CartDataModel.fromJson(Map<String, dynamic> json) {
    if (json['data'] != null) {
      cartList = <CartList>[];
      json['data'].forEach((v) {
        cartList!.add(new CartList.fromJson(v));
      });
    }
    subTotal = json['subTotal'];
    orderTotal = json['orderTotal'];
    total = json['total'];
    cartCount = json['cartCount'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.cartList != null) {
      data['data'] = this.cartList!.map((v) => v.toJson()).toList();
    }
    data['subTotal'] = this.subTotal;
    data['orderTotal'] = this.orderTotal;
    data['total'] = this.total;
    data['cartCount'] = this.cartCount;
    return data;
  }
}

class CartList {
  dynamic sId;
  dynamic quantity;
  dynamic price;
  dynamic size;
  bool? promotionApplied;
  ProductDetails? productDetails;

  CartList(
      {this.sId,
        this.quantity,
        this.price,
        this.size,
        this.promotionApplied,
        this.productDetails});

  CartList.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    quantity = json['quantity'];
    price = json['price'];
    size = json['size'];
    promotionApplied = json['promotionApplied'];
    productDetails = json['productDetails'] != null
        ? new ProductDetails.fromJson(json['productDetails'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['quantity'] = this.quantity;
    data['price'] = this.price;
    data['size'] = this.size;
    data['promotionApplied'] = this.promotionApplied;
    if (this.productDetails != null) {
      data['productDetails'] = this.productDetails!.toJson();
    }
    return data;
  }
}

class ProductDetails {
  dynamic sId;
  dynamic productName;
  dynamic description;
  List<ProductImg>? productImg;
  dynamic price;
  dynamic size;
  dynamic stateId;
  dynamic quantity;

  ProductDetails(
      {this.sId,
        this.productName,
        this.description,
        this.productImg,
        this.price,
        this.size,
        this.stateId,
        this.quantity});

  ProductDetails.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    productName = json['productName'];
    description = json['description'];
    if (json['productImg'] != null) {
      productImg = <ProductImg>[];
      json['productImg'].forEach((v) {
        productImg!.add(new ProductImg.fromJson(v));
      });
    }
    price = json['price'];
    size = json['size'];
    stateId = json['stateId'];
    quantity = json['quantity'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['productName'] = this.productName;
    data['description'] = this.description;
    if (this.productImg != null) {
      data['productImg'] = this.productImg!.map((v) => v.toJson()).toList();
    }
    data['price'] = this.price;
    data['size'] = this.size;
    data['stateId'] = this.stateId;
    data['quantity'] = this.quantity;
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