import 'package:buzzgrab/app/core/widgets/custom_flashbar.dart';
import 'package:get/get.dart';
import 'package:permission_handler/permission_handler.dart';

class PermissionController extends GetxController {
  RxBool locationGranted = false.obs;
  RxBool cameraGranted = false.obs;

  bool get allGranted => locationGranted.value && cameraGranted.value;

  @override
  void onInit() {
    super.onInit();
    checkPermissions();
  }

  Future<void> checkPermissions() async {
    locationGranted.value = await Permission.location.isGranted;
    cameraGranted.value = await Permission.camera.isGranted;
  }

  Future<void> requestPermission(Permission permission) async {
    final status = await permission.request();

    if (status.isGranted) {
      await checkPermissions();
    } else if (status.isPermanentlyDenied) {
      await openAppSettings();
    } else {
      toast(
        "Please allow permission to continue.",
      );
    }
  }
}
