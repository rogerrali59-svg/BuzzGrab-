// To parse this JSON data, do
//
//     final orderModel = orderModelFromJson(jsonString);

import 'dart:convert';

OrderModel orderModelFromJson(String str) =>
    OrderModel.fromJson(json.decode(str));

String orderModelToJson(OrderModel data) => json.encode(data.toJson());

class OrderModel {
  List<OrderDataModel>? data;
  Meta? meta;
  dynamic status;

  OrderModel({
    this.data,
    this.meta,
    this.status,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) => OrderModel(
        data: json["data"] == null
            ? []
            : List<OrderDataModel>.from(
                json["data"]!.map((x) => OrderDataModel.fromJson(x))),
        meta: json["meta"] == null ? null : Meta.fromJson(json["meta"]),
        status: json["status"],
      );

  Map<String, dynamic> toJson() => {
        "data": data == null
            ? []
            : List<dynamic>.from(data!.map((x) => x.toJson())),
        "meta": meta?.toJson(),
        "status": status,
      };
}

class OrderDataModel {
  dynamic id;
  dynamic orderId;
  dynamic status;
  dynamic finalAmount;
  DeliveryAddress? restaurant;
  DeliveryAddress? deliveryAddress;

  OrderDataModel({
    this.id,
    this.orderId,
    this.status,
    this.finalAmount,
    this.restaurant,
    this.deliveryAddress,
  });

  factory OrderDataModel.fromJson(Map<String, dynamic> json) => OrderDataModel(
        id: json["id"],
        orderId: json["order_id"],
        finalAmount: json["final_amount"],
        status: json["status"],
        restaurant: json["restaurant"] == null
            ? null
            : DeliveryAddress.fromJson(json["restaurant"]),
        deliveryAddress: json["delivery_address"] == null
            ? null
            : DeliveryAddress.fromJson(json["delivery_address"]),
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "order_id": orderId,
        "status": status,
        "final_amount": finalAmount,
        "restaurant": restaurant?.toJson(),
        "delivery_address": deliveryAddress?.toJson(),
      };
}

class DeliveryAddress {
  dynamic id;
  dynamic fullName;
  dynamic address;
  dynamic latitude;
  dynamic longitude;
  dynamic restaurantName;

  DeliveryAddress({
    this.id,
    this.fullName,
    this.address,
    this.latitude,
    this.longitude,
    this.restaurantName,
  });

  factory DeliveryAddress.fromJson(Map<String, dynamic> json) =>
      DeliveryAddress(
        id: json["id"],
        fullName: json["full_name"],
        address: json["address"],
        latitude: json["latitude"],
        longitude: json["longitude"],
        restaurantName: json["restaurant_name"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "full_name": fullName,
        "address": address,
        "latitude": latitude,
        "longitude": longitude,
        "restaurant_name": restaurantName,
      };
}

class Meta {
  dynamic pageCount;
  dynamic totalResults;
  dynamic currentPageNo;
  dynamic limit;
  bool? lastPage;

  Meta({
    this.pageCount,
    this.totalResults,
    this.currentPageNo,
    this.limit,
    this.lastPage,
  });

  factory Meta.fromJson(Map<String, dynamic> json) => Meta(
        pageCount: json["page_count"],
        totalResults: json["total_results"],
        currentPageNo: json["current_page_no"],
        limit: json["limit"],
        lastPage: json["last_page"],
      );

  Map<String, dynamic> toJson() => {
        "page_count": pageCount,
        "total_results": totalResults,
        "current_page_no": currentPageNo,
        "limit": limit,
        "last_page": lastPage,
      };
}
