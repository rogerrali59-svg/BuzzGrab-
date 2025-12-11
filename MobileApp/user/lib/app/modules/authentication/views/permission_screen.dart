import 'package:buzzgrab/app/core/values/app_colors.dart';
import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:buzzgrab/export.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:permission_handler/permission_handler.dart';
import '../controllers/permission_controller.dart';

class PermissionScreen extends StatelessWidget {
  PermissionScreen({super.key});

  final controller = Get.put(PermissionController());

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () {
        Get.offAllNamed(AppRoutes.logIn);
        return Future.value(true);
      },
      child: Scaffold(
        appBar: CustomAppBar(
          onTap: () {
            Get.offAllNamed(AppRoutes.logIn);
          },
        ),
        backgroundColor: Colors.white,
        body: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              SizedBox(
                height: height_50,
              ),
              const Text(
                "Permissions Required",
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              const Text(
                "We need a few permissions to provide you the best experience",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.black54, fontSize: 14),
              ),
              const SizedBox(height: 32),

              // Location Tile
              Obx(() => _buildPermissionTile(
                    icon: Icons.location_on_outlined,
                    title: "Location Access",
                    subtitle: "To show nearby stores and delivery options",
                    granted: controller.locationGranted.value,
                    buttonLabel: "Allow Location",
                    onPressed: () =>
                        controller.requestPermission(Permission.location),
                  )),

              const SizedBox(height: 18),

              // Camera Tile
              Obx(() => _buildPermissionTile(
                    icon: Icons.camera_alt_outlined,
                    title: "Camera Access",
                    subtitle: "To verify your ID and age for alcohol purchase",
                    granted: controller.cameraGranted.value,
                    buttonLabel: "Allow Camera",
                    onPressed: () =>
                        controller.requestPermission(Permission.camera),
                  )),

              const SizedBox(height: 25),

              // Continue Button
              Obx(() {
                if (!controller.allGranted) {
                  return const SizedBox.shrink(); // hide button
                }

                return SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: () {
                      Get.toNamed(AppRoutes.locationPickerScreen);
                      // navigate next
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorAppColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      "Continue",
                      style: TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ),
                );
              })
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPermissionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool granted,
    required String buttonLabel,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                  height: height_40,
                  width: height_40,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: colorAppColor.withOpacity(.1),
                  ),
                  child: Icon(icon, color: Colors.blue)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title,
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 6),
                    Text(subtitle,
                        style: const TextStyle(
                            color: Colors.black54, fontSize: 13)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 15),
          granted
              ? Row(
                  children: const [
                    Icon(Icons.info_outline_rounded,
                        color: Colors.green, size: 18),
                    SizedBox(width: 6),
                    Text("Permission Granted",
                        style: TextStyle(color: Colors.green, fontSize: 14)),
                  ],
                )
              : SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: onPressed,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorAppColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      buttonLabel,
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                ),
        ],
      ),
    );
  }
}
