import 'dart:io';
import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:buzzgrab/app/core/widgets/custom_appbar.dart';
import 'package:buzzgrab/app/core/widgets/custom_flashbar.dart';
import 'package:buzzgrab/app/modules/authentication/views/success_screen.dart';
import 'package:camera/camera.dart';
import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../../core/values/app_colors.dart';
import '../controllers/id_verification_controller.dart';

class IDVerificationScreen extends StatelessWidget {
  final controller = Get.put(IDVerificationController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(),
      body: GetBuilder<IDVerificationController>(
        builder: (_) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "ID Verification",
                  style: TextStyle(
                      color: Colors.black,
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),

                const Text(
                  "We need to verify your age before you can purchase alcohol",
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 20),
                const Text(
                  "Select ID Type",
                  style: TextStyle(color: Colors.black),
                ),
                const SizedBox(height: 10),

                // 🔽 ID TYPE DROPDOWN
                DropdownButtonFormField<String>(
                  decoration: InputDecoration(
                    hintText: "Select ID Type",
                    // labelStyle: const TextStyle(color: Colors.grey),
                    // filled: true,
                    fillColor: Colors.grey.shade100,

                    // 🔹 Always Grey Border
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide:
                          BorderSide(color: Colors.grey.shade300, width: 1),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide(
                          color: Colors.grey.shade300, width: 1), // stays grey
                    ),
                    errorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide:
                          BorderSide(color: Colors.grey.shade300, width: 1),
                    ),
                    focusedErrorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide:
                          BorderSide(color: Colors.grey.shade300, width: 1),
                    ),

                    // 🔹 Vertically Center Content
                    contentPadding:
                        const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                  ),
                  icon:
                      Icon(Icons.arrow_drop_down, color: Colors.grey.shade600),
                  borderRadius: BorderRadius.circular(10),
                  items: controller.idTypes
                      .map((e) => DropdownMenuItem(
                            value: e,
                            child: Text(
                              e,
                              style: const TextStyle(fontSize: 16),
                            ),
                          ))
                      .toList(),
                  onChanged: (v) => controller.setIdType(v ?? ""),
                ),
                const SizedBox(height: 20),

                buildUploadBox(
                  title: "Upload Front Photo",
                  subtitle: "of your ID",
                  uploadedText: "Front Photo Uploaded",
                  file: controller.frontPhoto.value,
                  onPressed: () {
                    if (controller.selectedIdType.value == '' ||
                        controller.selectedIdType.value == null) {
                      toast('Kindly Select Document Type');
                    } else {
                      pickImage(controller.setFrontPhoto);
                    }
                  },
                  onChangePressed: () =>
                      pickImage(controller.setFrontPhoto).then(
                    (value) {
                      if (value != null) {
                        toast('Changed Successfully');
                      }
                    },
                  ),
                ),

                const SizedBox(height: 20),

                buildUploadBox(
                  title: "Upload Back Photo",
                  subtitle: "of your ID",
                  uploadedText: "Back Photo Uploaded",
                  file: controller.backPhoto.value,
                  onPressed: () {
                    if (controller.selectedIdType.value == '' ||
                        controller.selectedIdType.value == null) {
                      toast('Kindly Select Document Type');
                    } else {
                      pickImage(controller.setBackPhoto);
                    }
                  },
                  onChangePressed: () =>
                      pickImage(controller.setBackPhoto)?.then(
                    (value) {
                      if (value != null) {
                        toast('Changed Successfully');
                      }
                    },
                  ),
                ),

                const SizedBox(height: 20),

                buildUploadBox(
                    title: "Live Selfie",
                    subtitle: "Face Verification",
                    uploadedText: "Selfie Uploaded",
                    file: controller.selfie.value,
                    onPressed: () {
                      if (controller.selectedIdType.value == '' ||
                          controller.selectedIdType.value == null) {
                        toast('Kindly Select Document Type');
                      } else {
                        Get.to(() => LiveSelfieCameraScreen(
                              onCapture: (file) => controller.setSelfie(file),
                            ));
                      }
                    },
                    onChangePressed: () {
                      Get.to(() => LiveSelfieCameraScreen(
                            onCapture: (file) => controller.setSelfie(file),
                          ))?.then(
                        (value) {
                          if (value != null) {
                            toast('Changed Successfully');
                          }
                        },
                      );
                    }),

                const SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: controller.isAllCompleted
                        ? () {
                            if (controller.frontPhoto.value == null ||
                                controller.frontPhoto.value == '') {
                            } else if (controller.backPhoto.value == null ||
                                controller.backPhoto.value == '') {
                            } else if (controller.selfie.value == null ||
                                controller.selfie.value == '') {
                              toast('Kindly Add selfy');
                            } else {
                              // Get.to(SuccessScreen());
                              controller.callAddVerificationDocumentApi();
                            }


                          }
                        : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorAppColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: const Text(
                      "Submit for Verification",
                      style: TextStyle(fontSize: 16, color: Colors.white),
                    ),
                  ),
                ),

                const SizedBox(height: 10),
                const Text(
                  "Your information is secure and will only be used for verification purposes",
                  style: TextStyle(color: Colors.grey, fontSize: 12),
                  textAlign: TextAlign.center,
                )
              ],
            ),
          );
        },
      ),
    );
  }

  Widget buildUploadBox({
    required String title, // e.g. "Front Photo"
    required String subtitle, // e.g. "of your ID"
    required String uploadedText, // e.g. "Front Photo Uploaded"
    required File? file,
    required VoidCallback onPressed,
    VoidCallback? onChangePressed,
  }) {
    return DottedBorder(
      borderType: BorderType.RRect,
      color: Colors.grey.shade200,
      strokeWidth: 1,
      dashPattern: [10, 5],
      padding: EdgeInsets.all(10),
      radius: Radius.circular(8),
      child: Container(
        width: Get.width,
        padding: const EdgeInsets.all(10),
        child: file == null
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Icon(Icons.upload_file, size: 36, color: Colors.grey),
                  const SizedBox(height: 10),

                  // Two-line text
                  Text(title, style: const TextStyle(fontSize: 16)),
                  Text(subtitle,
                      style:
                          TextStyle(fontSize: 14, color: Colors.grey.shade600)),
                  const SizedBox(height: 14),

                  // Custom Outlined Container Button
                  GestureDetector(
                    onTap: onPressed,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 10, horizontal: 18),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: Colors.grey.shade300,
                          width: 1,
                        ),
                      ),
                      child: const Text(
                        "Choose File",
                        style: TextStyle(color: Colors.black),
                      ),
                    ),
                  ),
                ],
              )
            : Column(
                children: [

                  const Icon(Icons.check_circle_outline_rounded,
                      color: Colors.green, size: 30),
                  const SizedBox(height: 8),
                  Text(
                    uploadedText,
                    style: const TextStyle(color: Colors.black, fontSize: 16),
                  ),
                ],
              ).paddingSymmetric(vertical: margin_10),
      ),
    );
  }

  // 📸 PICK IMAGE HELPER
  Future pickImage(Function(File) callback) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      callback(File(image.path));
    }
  }

  Future pickCameraImage(Function(File) callback) async {
    // 1️⃣ Permission check
    var status = await Permission.camera.request();

    if (status.isDenied) {
      Get.snackbar("Permission Required", "Camera permission is needed");
      return;
    }

    if (status.isPermanentlyDenied) {
      openAppSettings();
      return;
    }

    // 2️⃣ Open FRONT camera
    final ImagePicker picker = ImagePicker();

    final XFile? image = await picker.pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.front,
      maxWidth: 600,
      maxHeight: 600,
      imageQuality: 90,
    );

    if (image != null) {
      callback(File(image.path));
    }
  }
}

class LiveSelfieCameraScreen extends StatefulWidget {
  final Function(File) onCapture;

  LiveSelfieCameraScreen({required this.onCapture});

  @override
  State<LiveSelfieCameraScreen> createState() => _LiveSelfieCameraScreenState();
}

class _LiveSelfieCameraScreenState extends State<LiveSelfieCameraScreen> {
  CameraController? controller;
  late List<CameraDescription> cameras;
  bool isReady = false;

  @override
  void initState() {
    super.initState();
    initCamera();
  }

  Future<void> initCamera() async {
    cameras = await availableCameras();

    final front = cameras.firstWhere(
      (cam) => cam.lensDirection == CameraLensDirection.front,
    );

    controller = CameraController(
      front,
      ResolutionPreset.medium,
      enableAudio: false,
    );

    await controller!.initialize();

    if (!mounted) return;

    setState(() => isReady = true);
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Live Selfie")),
      body: isReady
          ? Stack(
              children: [
                CameraPreview(controller!),
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: FloatingActionButton(
                      child: Icon(Icons.camera),
                      onPressed: () async {
                        final pic = await controller!.takePicture();
                        widget.onCapture(File(pic.path));
                        Get.back();
                      },
                    ),
                  ),
                )
              ],
            )
          : Center(child: CircularProgressIndicator()),
    );
  }
}
