
import 'dart:convert';

NotificationModel notificationModelFromJson(String str) => NotificationModel.fromJson(json.decode(str));
String notificationModelToJson(NotificationModel data) => json.encode(data.toJson());

class NotificationModel {
  List<NotificationData>? data;
  Meta? meta;

  NotificationModel({
    this.data,
    this.meta,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) => NotificationModel(
    data: json["data"] == null ? [] : List<NotificationData>.from(json["data"]!.map((x) => NotificationData.fromJson(x))),
    meta: json["meta"] == null ? null : Meta.fromJson(json["meta"]),
  );

  Map<String, dynamic> toJson() => {
    "data": data == null ? [] : List<dynamic>.from(data!.map((x) => x.toJson())),
    "meta": meta?.toJson(),
  };
}

class NotificationData {
  dynamic id;
  dynamic createdBy;
  dynamic createdOn;
  dynamic updatedOn;
  dynamic title;
  dynamic description;
  dynamic isRead;
  dynamic notificationType;
  dynamic objId;
  dynamic createdFor;

  NotificationData({
    this.id,
    this.createdBy,
    this.createdOn,
    this.updatedOn,
    this.title,
    this.description,
    this.isRead,
    this.notificationType,
    this.objId,
    this.createdFor,
  });

  factory NotificationData.fromJson(Map<String, dynamic> json) => NotificationData(
    id: json["id"],
    createdBy: json["created_by"] == null ? null : CreatedBy.fromJson(json["created_by"]),
    createdOn: json["created_on"] == null ? null : DateTime.parse(json["created_on"]),
    updatedOn: json["updated_on"],
    title: json["title"],
    description: json["description"],
    isRead: json["is_read"],
    notificationType: json["notification_type"],
    objId: json["obj_id"],
    createdFor: json["created_for"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "created_by": createdBy?.toJson(),
    "created_on": createdOn,
    "updated_on": updatedOn,
    "title": title,
    "description": description,
    "is_read": isRead,
    "notification_type": notificationType,
    "obj_id": objId,
    "created_for": createdFor,
  };
}

class CreatedBy {
  dynamic id;
  dynamic restaurantName;
  dynamic address;
  dynamic latitude;
  dynamic longitude;
  dynamic profilePic;

  CreatedBy({
    this.id,
    this.restaurantName,
    this.address,
    this.latitude,
    this.longitude,
    this.profilePic,
  });

  factory CreatedBy.fromJson(Map<String, dynamic> json) => CreatedBy(
    id: json["id"],
    restaurantName: json["restaurant_name"],
    address: json["address"],
    latitude: json["latitude"],
    longitude: json["longitude"],
    profilePic: json["profile_pic"],
  );

  Map<String, dynamic> toJson() => {
    "id": id,
    "restaurant_name": restaurantName,
    "address": address,
    "latitude": latitude,
    "longitude": longitude,
    "profile_pic": profilePic,
  };
}

class Meta {
  dynamic pageCount;
  dynamic totalResults;
  dynamic currentPageNo;
  dynamic limit;
  dynamic lastPage;

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
