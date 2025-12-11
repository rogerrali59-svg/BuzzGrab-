
import 'package:alcoholdeliverydriver/app/modules/profile/model/notification_response_model.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/remote_service/network/dio_client.dart';

// ======== CONTROLLER ==========
class NotificationController extends GetxController {

  RxList<NotificationData> notifications = <NotificationData>[].obs;

  @override
  void onInit() {
    getNotifications();
    super.onInit();
  }

  getNotifications() async {
    await DioClient()
        .get('/notification', skipAuth: false)
        .then((v) {
      notifications.clear();
      NotificationModel notificationModel = NotificationModel.fromJson(v);
      notifications.addAll(notificationModel.data ?? []);
    }).onError((e, s) {
      debugPrint("Error: $e");
    });
  }

  Future<void> clearAllNotifications() async {
    try {
      final response = await DioClient().delete(
        '/notification/deleteAll',
        skipAuth: false,
      );

      debugPrint("Clear Notification Response: $response");

      await getNotifications();
      Get.snackbar(
        "Success",
        "All notifications cleared",
        snackPosition: SnackPosition.BOTTOM,
      );
    } catch (e) {
      debugPrint("Error deleting notifications: $e");

      Get.snackbar(
        "Error",
        "Unable to clear notifications",
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.redAccent,
        colorText: Colors.white,
      );
    }
  }


}
