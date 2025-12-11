// To parse this JSON data, do
//
//     final orderDetailsModel = orderDetailsModelFromJson(jsonString);

import 'dart:convert';

OrderDetailsModel orderDetailsModelFromJson(String str) =>
    OrderDetailsModel.fromJson(json.decode(str));

String orderDetailsModelToJson(OrderDetailsModel data) =>
    json.encode(data.toJson());

class OrderDetailsModel {
  Data? data;
  dynamic status;

  OrderDetailsModel({
    this.data,
    this.status,
  });

  factory OrderDetailsModel.fromJson(Map<String, dynamic> json) =>
      OrderDetailsModel(
        data: json["data"] == null ? null : Data.fromJson(json["data"]),
        status: json["status"],
      );

  Map<String, dynamic> toJson() => {
        "data": data?.toJson(),
        "status": status,
      };
}

class Data {
  dynamic id;
  Restaurant? restaurant;
  CreatedBy? createdBy;
  List<CartItem>? cartItems;
  DeliveryAddress? deliveryAddress;
  CreatedBy? driver;
  DateTime? createdOn;
  DateTime? updatedOn;
  dynamic orderId;
  dynamic flatAmount;
  dynamic discountAmount;
  dynamic additionalCharges;
  dynamic platformFee;
  dynamic finalAmount;
  dynamic status;
  dynamic otp;
  dynamic isPaid;
  dynamic coupon;

  Data({
    this.id,
    this.restaurant,
    this.createdBy,
    this.cartItems,
    this.deliveryAddress,
    this.driver,
    this.createdOn,
    this.updatedOn,
    this.orderId,
    this.flatAmount,
    this.discountAmount,
    this.additionalCharges,
    this.platformFee,
    this.finalAmount,
    this.status,
    this.otp,
    this.isPaid,
    this.coupon,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
        id: json["id"],
        restaurant: json["restaurant"] == null
            ? null
            : Restaurant.fromJson(json["restaurant"]),
        createdBy: json["created_by"] == null
            ? null
            : CreatedBy.fromJson(json["created_by"]),
        cartItems: json["cart_items"] == null
            ? []
            : List<CartItem>.from(
                json["cart_items"]!.map((x) => CartItem.fromJson(x))),
        deliveryAddress: json["delivery_address"] == null
            ? null
            : DeliveryAddress.fromJson(json["delivery_address"]),
        driver:
            json["driver"] == null ? null : CreatedBy.fromJson(json["driver"]),
        createdOn: json["created_on"] == null
            ? null
            : DateTime.parse(json["created_on"]),
        updatedOn: json["updated_on"] == null
            ? null
            : DateTime.parse(json["updated_on"]),
        orderId: json["order_id"],
        flatAmount: json["flat_amount"],
        discountAmount: json["discount_amount"],
        additionalCharges: json["additional_charges"],
        platformFee: json["platform_fee"],
        finalAmount: json["final_amount"],
        status: json["status"],
        otp: json["otp"],
        isPaid: json["is_paid"],
        coupon: json["coupon"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "restaurant": restaurant?.toJson(),
        "created_by": createdBy?.toJson(),
        "cart_items": cartItems == null
            ? []
            : List<dynamic>.from(cartItems!.map((x) => x.toJson())),
        "delivery_address": deliveryAddress?.toJson(),
        "driver": driver?.toJson(),
        "created_on": createdOn?.toIso8601String(),
        "updated_on": updatedOn?.toIso8601String(),
        "order_id": orderId,
        "flat_amount": flatAmount,
        "discount_amount": discountAmount,
        "additional_charges": additionalCharges,
        "platform_fee": platformFee,
        "final_amount": finalAmount,
        "status": status,
        "otp": otp,
        "is_paid": isPaid,
        "coupon": coupon,
      };
}

class CartItem {
  dynamic id;
  Product? product;
  Coupon? coupon;
  DateTime? createdOn;
  DateTime? updatedOn;
  dynamic quantity;

  CartItem({
    this.id,
    this.product,
    this.coupon,
    this.createdOn,
    this.updatedOn,
    this.quantity,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) => CartItem(
        id: json["id"],
        product:
            json["product"] == null ? null : Product.fromJson(json["product"]),
        coupon: json["coupon"] == null ? null : Coupon.fromJson(json["coupon"]),
        createdOn: json["created_on"] == null
            ? null
            : DateTime.parse(json["created_on"]),
        updatedOn: json["updated_on"] == null
            ? null
            : DateTime.parse(json["updated_on"]),
        quantity: json["quantity"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "product": product?.toJson(),
        "coupon": coupon?.toJson(),
        "created_on": createdOn?.toIso8601String(),
        "updated_on": updatedOn?.toIso8601String(),
        "quantity": quantity,
      };
}

class Coupon {
  dynamic id;
  dynamic couponCode;
  dynamic title;
  dynamic discount;

  Coupon({
    this.id,
    this.couponCode,
    this.title,
    this.discount,
  });

  factory Coupon.fromJson(Map<String, dynamic> json) => Coupon(
        id: json["id"],
        couponCode: json["coupon_code"],
        title: json["title"],
        discount: json["discount"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "coupon_code": couponCode,
        "title": title,
        "discount": discount,
      };
}

class Product {
  dynamic id;
  dynamic name;
  dynamic category;
  dynamic description;

  Product({
    this.id,
    this.name,
    this.category,
    this.description,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json["id"],
        name: json["name"],
        category: json["category"],
        description: json["description"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "name": name,
        "category": category,
        "description": description,
      };
}

class CreatedBy {
  dynamic id;
  dynamic fullName;
  dynamic countryCode;
  dynamic mobileNo;
  dynamic latitude;
  dynamic longitude;
  dynamic image;

  CreatedBy({
    this.id,
    this.fullName,
    this.countryCode,
    this.mobileNo,
    this.latitude,
    this.longitude,
    this.image,
  });

  factory CreatedBy.fromJson(Map<String, dynamic> json) => CreatedBy(
        id: json["id"],
        fullName: json["full_name"],
        countryCode: json["country_code"],
        mobileNo: json["mobile_no"],
        latitude: json["latitude"],
        longitude: json["longitude"],
        image: json["image"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "full_name": fullName,
        "country_code": countryCode,
        "mobile_no": mobileNo,
        "latitude": latitude,
        "longitude": longitude,
        "image": image,
      };
}

class DeliveryAddress {
  dynamic id;
  DateTime? createdOn;
  DateTime? updatedOn;
  dynamic title;
  dynamic fullName;
  dynamic email;
  dynamic countryIsoCode;
  dynamic countryCode;
  dynamic mobileNo;
  dynamic address;
  dynamic latitude;
  dynamic longitude;
  dynamic user;

  DeliveryAddress({
    this.id,
    this.createdOn,
    this.updatedOn,
    this.title,
    this.fullName,
    this.email,
    this.countryIsoCode,
    this.countryCode,
    this.mobileNo,
    this.address,
    this.latitude,
    this.longitude,
    this.user,
  });

  factory DeliveryAddress.fromJson(Map<String, dynamic> json) =>
      DeliveryAddress(
        id: json["id"],
        createdOn: json["created_on"] == null
            ? null
            : DateTime.parse(json["created_on"]),
        updatedOn: json["updated_on"] == null
            ? null
            : DateTime.parse(json["updated_on"]),
        title: json["title"],
        fullName: json["full_name"],
        email: json["email"],
        countryIsoCode: json["country_iso_code"],
        countryCode: json["country_code"],
        mobileNo: json["mobile_no"],
        address: json["address"],
        latitude: json["latitude"],
        longitude: json["longitude"],
        user: json["user"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "created_on": createdOn?.toIso8601String(),
        "updated_on": updatedOn?.toIso8601String(),
        "title": title,
        "full_name": fullName,
        "email": email,
        "country_iso_code": countryIsoCode,
        "country_code": countryCode,
        "mobile_no": mobileNo,
        "address": address,
        "latitude": latitude,
        "longitude": longitude,
        "user": user,
      };
}

class Restaurant {
  dynamic restaurantId;
  dynamic restaurantName;
  dynamic address;
  dynamic latitude;
  dynamic longitude;
  dynamic image;

  Restaurant({
    this.restaurantId,
    this.restaurantName,
    this.address,
    this.latitude,
    this.longitude,
    this.image,
  });

  factory Restaurant.fromJson(Map<String, dynamic> json) => Restaurant(
        restaurantId: json["restaurant_id"],
        restaurantName: json["restaurant_name"],
        address: json["address"],
        latitude: json["latitude"],
        longitude: json["longitude"],
        image: json["image"],
      );

  Map<String, dynamic> toJson() => {
        "restaurant_id": restaurantId,
        "restaurant_name": restaurantName,
        "address": address,
        "latitude": latitude,
        "longitude": longitude,
        "image": image,
      };
}

OrderDetailsModel getStaticOrderDetails() {
  return OrderDetailsModel(
    status: "success",
    data: Data(
      id: 1,
      orderId: "ORD12345",
      flatAmount: 200,
      discountAmount: 20,
      additionalCharges: 10,
      platformFee: 5,
      finalAmount: 195,
      status: "Pending",
      otp: 5678,
      isPaid: true,
      createdOn: DateTime.now(),
      updatedOn: DateTime.now(),

      /// ------------ Restaurant ------------
      restaurant: Restaurant(
        restaurantId: 101,
        restaurantName: "Food Palace",
        address: "123 Street, City",
        latitude: "23.456",
        longitude: "72.789",
        image: "https://dummyimage.com/200x200",
      ),

      /// ------------ User Who Created Order ------------
      createdBy: CreatedBy(
        id: 11,
        fullName: "Rahul Sharma",
        countryCode: "+91",
        mobileNo: "9876543210",
        latitude: "23.456",
        longitude: "72.789",
        image: "https://dummyimage.com/150",
      ),

      /// ------------ Driver ------------
      driver: CreatedBy(
        id: 21,
        fullName: "Karan Singh",
        countryCode: "+91",
        mobileNo: "9876540000",
        latitude: "24.123",
        longitude: "73.321",
        image: "https://dummyimage.com/150",
      ),

      /// ------------ Delivery Address ------------
      deliveryAddress: DeliveryAddress(
        id: 301,
        fullName: "Rahul Sharma",
        mobileNo: "9876543210",
        email: "test@gmail.com",
        address: "Home no. 221B, Near Green Park",
        title: "Home",
        countryCode: "+91",
        countryIsoCode: "IN",
        latitude: "23.44",
        longitude: "72.88",
        createdOn: DateTime.now(),
        updatedOn: DateTime.now(),
      ),

      /// ------------ Cart Items ------------
      cartItems: [
        CartItem(
          id: 1,
          quantity: 2,
          createdOn: DateTime.now(),
          product: Product(
            id: 501,
            name: "Paneer Pizza",
            category: "Veg",
            description: "Cheesy paneer pizza with extra toppings",
          ),
        ),
        CartItem(
          id: 2,
          quantity: 1,
          createdOn: DateTime.now(),
          product: Product(
            id: 502,
            name: "Veg Burger",
            category: "Veg",
            description: "Crispy aloo tikki burger",
          ),
        ),
      ],
    ),
  );
}




