
import 'package:buzzgrab/export.dart';
import '../controller/notification_controller.dart';


class ProfileBinding extends Bindings {
  @override
  void dependencies() {

    Get.lazyPut<TrackingScrollController>(
      () => TrackingScrollController(),
    );
    Get.lazyPut<NotificationController>(
      () => NotificationController(),
    );

  }
}
