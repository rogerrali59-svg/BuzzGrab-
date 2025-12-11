// To parse this JSON data, do
//
//     final newOrderModel = newOrderModelFromJson(jsonString);

import 'dart:convert';

import '../load_chat_response_model.dart';

NewOrderModel newOrderModelFromJson(String str) =>
    NewOrderModel.fromJson(json.decode(str));

String newOrderModelToJson(NewOrderModel data) => json.encode(data.toJson());

class NewOrderModel {
  List<NewOrderData>? data;
  Meta? meta;
  dynamic status;

  NewOrderModel({
    this.data,
    this.meta,
    this.status,
  });

  factory NewOrderModel.fromJson(Map<String, dynamic> json) => NewOrderModel(
        data: json["data"] == null
            ? []
            : List<NewOrderData>.from(
                json["data"]!.map((x) => NewOrderData.fromJson(x))),
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

class NewOrderData {
  dynamic id;
  Restaurant? restaurant;
  dynamic finalAmount;
  dynamic status;

  NewOrderData({
    this.id,
    this.restaurant,
    this.finalAmount,
    this.status,
  });

  factory NewOrderData.fromJson(Map<String, dynamic> json) => NewOrderData(
        id: json["id"],
        restaurant: json["restaurant"] == null
            ? null
            : Restaurant.fromJson(json["restaurant"]),
        finalAmount: json["final_amount"],
        status: json["status"],
      );

  Map<String, dynamic> toJson() => {
        "id": id,
        "restaurant": restaurant?.toJson(),
        "final_amount": finalAmount,
        "status": status,
      };
}

class Restaurant {
  dynamic restaurantId;
  dynamic restaurantName;
  dynamic address;

  Restaurant({
    this.restaurantId,
    this.restaurantName,
    this.address,
  });

  factory Restaurant.fromJson(Map<String, dynamic> json) => Restaurant(
        restaurantId: json["restaurant_id"],
        restaurantName: json["restaurant_name"],
        address: json["address"],
      );

  Map<String, dynamic> toJson() => {
        "restaurant_id": restaurantId,
        "restaurant_name": restaurantName,
        "address": address,
      };
}
