import 'package:permission_handler/permission_handler.dart';

import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../../core/utils/image_picker_and_cropper.dart';
import '../../../core/utils/projectutils/validator.dart';
import '../../../core/widgets/annotated_region_widget.dart';
import '../../../core/widgets/country_picker.dart';
import '../../../core/widgets/image_picker_dialog.dart';
import '../../profile/controller/editProfile_controller.dart';
import '../controllers/edit_profile_controller.dart';
import 'document_viewer.dart';

class EditProfileScreen extends GetView<EditProfileController> {
  final controller = Get.put(EditProfileController());

  @override
  Widget build(BuildContext context) {
    lightChromeUI();
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: CustomAppBar(
          appBarTitleText: keyEditProfile.tr,
        ),
        body: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                child: Form(
                  key: controller.formKey,
                  child: Column(
                    children: [
                      SizedBox(
                        height: margin_10,
                      ),
                      Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(radius_12),
                          border: Border.all(
                            color: Color(0xFFe8e8e9),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            heading(
                                title: keyPersonalInformation.tr, icon: avatar),
                            SizedBox(
                              height: height_10,
                            ),
                            Stack(
                              alignment: Alignment.center,
                              children: [
                                Obx(
                                  () => Center(
                                    child: controller
                                            .profileImage.value.isNotEmpty
                                        ? controller.profileImage.value
                                                .toString()
                                                .contains("http")
                                            ? _networkImage()
                                            : _selectedImage()
                                        : Center(
                                            child: Container(
                                              height: height_85,
                                              width: height_85,
                                              decoration: BoxDecoration(
                                                border: Border.all(
                                                    color: colorAppColor,
                                                    width: width_2),
                                                borderRadius:
                                                    BorderRadius.circular(
                                                        height_100),
                                                image: DecorationImage(
                                                  image:
                                                      AssetImage(icon_person),
                                                  fit: BoxFit.cover,
                                                ),
                                              ),
                                            ).paddingAll(margin_5),
                                          ),
                                  ),
                                ),
                                Obx(() => controller.profileImage.isEmpty
                                    ? Positioned(
                                        right: margin_100,
                                        bottom: margin_5,
                                        child: InkWell(
                                          onTap: () {
                                            Get.bottomSheet(ImagePickerDialog(
                                              galleryFunction: () {
                                                Get.back();
                                                controller.updateImageFile(
                                                    imageFromGallery());
                                              },
                                              cameraFunction: () async {
                                                Get.back();
                                                final status = await Permission
                                                    .camera.status;
                                                if (status.isGranted == true) {
                                                  controller.updateImageFile(
                                                      imageFromCamera());
                                                } else {
                                                  await Permission.camera
                                                      .request()
                                                      .then((value) {
                                                    if (value.isGranted ==
                                                        true) {
                                                      controller.updateImageFile(
                                                          imageFromCamera());
                                                    } else {
                                                      if (status
                                                          .isPermanentlyDenied) {
                                                        toast(
                                                            'Camera permission denied, Please enable to use camera.');
                                                        Future.delayed(
                                                            Duration(
                                                                seconds: 1),
                                                            () {
                                                          openAppSettings();
                                                        });
                                                      }
                                                    }
                                                  }).onError(
                                                          (error, stackTrace) {
                                                    debugPrint('error $error');
                                                  });
                                                }
                                              },
                                            ));
                                          },
                                          child: AssetImageWidget(
                                            imageUrl: ic_camera,
                                            imageHeight: height_25,
                                            imageWidth: height_25,
                                          ),
                                        ),
                                      )
                                    : emptySizeBox()),
                              ],
                            ).paddingOnly(top: margin_0),
                            SizedBox(
                              height: height_5,
                            ),
                            TextFieldWidget(
                              tvHeading: 'Full Name',
                              fillColor: lightFieldColor,
                              maxLength: 20,
                              textController: controller.firstNameController,
                              inputAction: TextInputAction.next,
                              inputType: TextInputType.text,
                              hint: 'Full Name',
                              validate: (value) => FieldChecker.fieldChecker(
                                  value: value, message: keyFirstName.tr),
                              courserColor: colorAppColor,
                              focusNode: controller.firstNameFocusNode,
                            ).paddingOnly(bottom: margin_5),

                            TextFieldWidget(
                              tvHeading: keyEmail.tr,
                              hint: keyEnterEmail.tr,
                              fillColor: lightFieldColor,
                              readOnly: true,
                              textController: controller.emailController,
                              inputType: TextInputType.emailAddress,
                              color: Colors.white,
                              validate: (value) =>
                                  EmailValidator.validateEmail(value),
                              focusNode: controller.emailFocusNode,
                            ).paddingOnly(bottom: margin_5),
                            _phoneWidget(),
                          ],
                        ).marginAll(margin_20),
                      ),
                      SizedBox(
                        height: height_20,
                      ),
                      Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(radius_12),
                          border: Border.all(
                            color: Color(0xFFe8e8e9),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            heading(
                                title: keyVehicleInformation.tr, icon: vehicle),

                            SizedBox(
                              height: height_10,
                            ),

                        TextFieldWidget(
                          hint: "Doc",
                          tvHeading: keyDriverLicense.tr,
                          readOnly: true,
                          fillColor: lightFieldColor,
                          textController: controller.drivingLicenseController,
                          inputType: TextInputType.text,
                          onTap: () {
                            String url = controller.drivingLicenseController.text.trim();

                            if (url.isEmpty) {
                              // Open picker if no url present
                              controller.pickFile(
                                onFilePicked: (file) {
                                  controller.drivingLicenseFile = file;
                                  controller.drivingLicenseController.text = file.path.split('/').last;
                                },
                              );
                              return;
                            }

                            Get.defaultDialog(
                              title: keyDriverLicense.tr,
                              titleStyle: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                              middleText: "Do you want to view this document?",
                              middleTextStyle: const TextStyle(fontSize: 15),

                              // Remove default buttons so we can use custom UI
                              confirm: Column(
                                children: [
                                  const SizedBox(height: 10),

                                  // OPEN BUTTON (Filled)
                                  ElevatedButton(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: colorAppColor,        // <-- your app theme color
                                      minimumSize: const Size(double.infinity, 40),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    onPressed: () {
                                      Get.back();
                                      Get.to(() => DocumentViewerScreen(
                                        url: url,
                                        title: keyDriverLicense.tr,
                                      ));
                                    },
                                    child: const Text("Open", style: TextStyle(color: Colors.white)),
                                  ),

                                  const SizedBox(height: 8),

                                  // CANCEL BUTTON (Outlined / You can change if needed)
                                  OutlinedButton(
                                    style: OutlinedButton.styleFrom(
                                      side: BorderSide(color: colorAppColor),
                                      minimumSize: const Size(double.infinity, 40),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    onPressed: () => Get.back(),
                                    child: Text(
                                      "Cancel",
                                      style: TextStyle(color: colorAppColor),                                        ),
                                  ),
                                ],
                              ),
                            );


                            },


                          suffixIcon: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [

                              const SizedBox(width: 6),

                              GestureDetector(
                                onTap: () {
                                  controller.pickFile(
                                    onFilePicked: (file) {
                                      controller.drivingLicenseFile = file;
                                      controller.drivingLicenseController.text = file.path.split('/').last;
                                    },
                                  );
                                },
                                child: Transform.rotate(
                                  angle: 0.5,
                                  child: const Icon(Icons.attach_file, color: Colors.black26, size: 20),
                                ),
                              ),
                              const SizedBox(width: 8),
                            ],
                          ),
                        ),
                            SizedBox(
                              height: height_10,
                            ),


                            TextFieldWidget(
                              hint: "Doc",
                              tvHeading: keyVehicleRegistrationNumber.tr,
                              readOnly: true,
                              fillColor: lightFieldColor,
                              textController: controller.registrationCertController,
                              inputType: TextInputType.text,
                              onTap: () {
                                String url = controller.registrationCertController.text.trim();

                                if (url.isEmpty) {
                                  // Open picker if no url present
                                  controller.pickFile(
                                    onFilePicked: (file) {
                                      controller.registrationNoFile = file;
                                      controller.registrationCertController.text = file.path.split('/').last;
                                    },
                                  );
                                  return;
                                }

                                Get.defaultDialog(
                                  title: keyVehicleInformation.tr,
                                  titleStyle: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                  middleText: "Do you want to view this document?",
                                  middleTextStyle: const TextStyle(fontSize: 15),

                                  // Remove default buttons so we can use custom UI
                                  confirm: Column(
                                    children: [
                                      const SizedBox(height: 10),

                                      // OPEN BUTTON (Filled)
                                      ElevatedButton(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: colorAppColor,        // <-- your app theme color
                                          minimumSize: const Size(double.infinity, 40),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                        ),
                                        onPressed: () {
                                          Get.back();
                                          Get.to(() => DocumentViewerScreen(
                                            url: url,
                                            title: keyVehicleInformation.tr,
                                          ));
                                        },
                                        child: const Text("Open", style: TextStyle(color: Colors.white)),
                                      ),

                                      const SizedBox(height: 8),

                                      // CANCEL BUTTON (Outlined / You can change if needed)
                                      OutlinedButton(
                                        style: OutlinedButton.styleFrom(
                                          side: BorderSide(color: colorAppColor),
                                          minimumSize: const Size(double.infinity, 40),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                        ),
                                        onPressed: () => Get.back(),
                                        child: Text(
                                          "Cancel",
                                          style: TextStyle(color: colorAppColor),                                        ),
                                      ),
                                    ],
                                  ),
                                );


                              },

                              suffixIcon: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [


                                  // space
                                  const SizedBox(width: 6),

                                  // 📂 PICKER ICON - always visible
                                  GestureDetector(
                                    onTap: () {
                                      controller.pickFile(
                                        onFilePicked: (file) {
                                          controller.registrationNoFile = file;
                                          controller.registrationCertController.text = file.path.split('/').last;
                                        },
                                      );
                                    },
                                    child: Transform.rotate(
                                      angle: 0.5,
                                      child: const Icon(Icons.attach_file, color: Colors.black26, size: 20),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                ],
                              ),
                            ),



                            SizedBox(height: height_10),


                            TextFieldWidget(
                              hint: "Doc",
                              tvHeading: keyInsuranceCertificate.tr,
                              readOnly: true,
                              fillColor: lightFieldColor,
                              textController: controller.insuranceCertificateController,
                              inputType: TextInputType.text,
                              onTap: () {
                                String url = controller.insuranceCertificateController.text.trim();

                                if (url.isEmpty) {
                                  // Open picker if no url present
                                  controller.pickFile(
                                    onFilePicked: (file) {
                                      controller.insuranceCertificateFile = file;
                                      controller.insuranceCertificateController.text = file.path.split('/').last;
                                    },
                                  );
                                  return;
                                }

                                Get.defaultDialog(
                                  title: keyInsuranceCertificate.tr,
                                  titleStyle: const TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                                  middleText: "Do you want to view this document?",
                                  middleTextStyle: const TextStyle(fontSize: 15),

                                  // Remove default buttons so we can use custom UI
                                  confirm: Column(
                                    children: [
                                      const SizedBox(height: 10),

                                      // OPEN BUTTON (Filled)
                                      ElevatedButton(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: colorAppColor,        // <-- your app theme color
                                          minimumSize: const Size(double.infinity, 40),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                        ),
                                        onPressed: () {
                                          Get.back();
                                          Get.to(() => DocumentViewerScreen(
                                            url: url,
                                            title: keyInsuranceCertificate.tr,
                                          ));
                                        },
                                        child: const Text("Open", style: TextStyle(color: Colors.white)),
                                      ),

                                      const SizedBox(height: 8),

                                      // CANCEL BUTTON (Outlined / You can change if needed)
                                      OutlinedButton(
                                        style: OutlinedButton.styleFrom(
                                          side: BorderSide(color: colorAppColor),
                                          minimumSize: const Size(double.infinity, 40),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                        ),
                                        onPressed: () => Get.back(),
                                        child: Text(
                                          "Cancel",
                                          style: TextStyle(color: colorAppColor),                                        ),
                                      ),
                                    ],
                                  ),
                                );



                              }, // disable default pick on tap (optional)

                              // ----------- SUFFIX AREA HANDLING -----------
                              suffixIcon: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [


                                  // space
                                  const SizedBox(width: 6),

                                  // 📂 PICKER ICON - always visible
                                  GestureDetector(
                                    onTap: () {
                                      controller.pickFile(
                                        onFilePicked: (file) {
                                          controller.insuranceCertificateFile = file;
                                          controller.insuranceCertificateController.text = file.path.split('/').last;
                                        },
                                      );
                                    },
                                    child: Transform.rotate(
                                      angle: 0.5,
                                      child: const Icon(Icons.attach_file, color: Colors.black26, size: 20),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                ],
                              ),
                            ),

                            SizedBox(height: height_10),
                          ],
                        ).marginAll(margin_20),
                      ),
                      SizedBox(
                        height: height_20,
                      ),

                      MaterialButtonWidget(
                        buttonRadius: radius_10,
                        onPressed: () {
                          // if (formKey.currentState!.validate()) {
                          //   if (controller.profileImage.isEmpty) {
                          //     toast(keySelectProfile.tr);
                          //   } else {
                              controller.updateProfile();
                          //   }
                          // }
                        },
                        buttonText: keySaveChanges.tr,
                        textColor: Colors.white,
                      ).marginOnly(top: margin_15)
                    ],
                  ).paddingOnly(
                      left: margin_15, right: margin_15, bottom: margin_10),
                ),
              );
            },
          ),
        ),
      ),
    );
  }

  /// Common method for picking/viewing docs
  void handleDocumentSelection({
    required TextEditingController controller,
    required Function(dynamic file) onFilePicked,
    String? viewTitle,
  }) {
    String url = controller.text.trim();

    // If no URL, pick file
    if (url.isEmpty) {
      pickFile(
        onFilePicked: (file) {
          onFilePicked(file);
          controller.text = file.path.split('/').last;
        },
      );
      return;
    }

    // If URL exists, ask to view it
    Get.defaultDialog(
      title: viewTitle ?? "Document",
      middleText: "Do you want to view this document?",
      textConfirm: "Open",
      onConfirm: () async {
        Get.back();
        Get.to(() => DocumentViewerScreen(url: url, title: viewTitle ?? "Document"));
      },
      textCancel: "Cancel",
    );
  }



  _phoneWidget() {
    return Obx(
      () => CountryPicker(
        enabled: true,
        readOnly: false,
        borderColor: true,
        tvHeading: keyPhoneNumber.tr,
        fillColor: lightFieldColor,
        selectedCountry: controller.selectedCountry.value,
        textController: controller.phoneController,
        countryController: controller.countryController,
        focusNode: controller.phoneFocusNode,
        onCountryChanged: (country) {
          controller.selectedCountry.value = country;
          controller.selectedCountry.refresh();
        },
        onChange: (phone) {
          if (phone.number == "0") {
            controller.phoneController.text = "";
          }
        },
        mobileNumberTextController: '',
      ),
    );
  }

  Widget _networkImage() {
    return Obx(() {
      if (controller.profileImage.value.isEmpty) {
        // If no image, show default asset
        return AssetImageWidget(
          imageUrl: iconProfiles,
          imageHeight: height_100,
          imageWidth: height_100,
          radiusAll: height_100,
          imageFitType: BoxFit.contain,
        ).paddingAll(margin_8);
      } else {
        // Show network image with cross icon
        return Container(
          padding: EdgeInsets.all(margin_8),
          child: Stack(
            alignment: Alignment.center,
            children: [
              /// Circular clipped network image
              GestureDetector(
                onTap: () {
                  print("klasjdjas : ${controller.profileImage.value}");
                },
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(radius_100),
                  child: NetworkImageWidget(
                    imageurl: controller.profileImage.value,
                    imageFitType: BoxFit.cover,
                    placeHolder: icon_person,

                    imageHeight: height_100,
                    imageWidth: height_100,
                    radiusAll: radius_100,
                  ),
                ),
              ),

              /// Cross button to clear image
              Positioned(
                bottom: margin_5,
                right: margin_5,
                child: GestureDetector(
                  onTap: () {
                    Get.bottomSheet(ImagePickerDialog(
                      galleryFunction: () {
                        Get.back();
                        controller.updateImageFile(imageFromGallery());
                      },
                      cameraFunction: () async {
                        Get.back();
                        final status = await Permission.camera.status;
                        if (status.isGranted == true) {
                          controller.updateImageFile(imageFromCamera());
                        } else {
                          await Permission.camera.request().then((value) {
                            if (value.isGranted == true) {
                              controller.updateImageFile(imageFromCamera());
                            } else {
                              if (status.isPermanentlyDenied) {
                                toast(
                                    'Camera permission denied, Please enable to use camera.');
                                Future.delayed(Duration(seconds: 1), () {
                                  openAppSettings();
                                });
                              }
                            }
                          }).onError((error, stackTrace) {
                            debugPrint('error $error');
                          });
                        }
                      },
                    ));
                  },
                  child: AssetImageWidget(
                    imageUrl: ic_camera,
                    imageHeight: height_25,
                    imageWidth: height_25,
                  ),
                ),
              ),
            ],
          ),
        );
      }
    });
  }

  Widget _selectedImage() {
    if (controller.profileImage.value.isEmpty) {
      return AssetImageWidget(
        imageUrl: iconProfiles,
        imageHeight: height_100,
        imageWidth: height_100,
        radiusAll: height_100,
        imageFitType: BoxFit.contain,
      ).paddingAll(margin_8);
    } else {
      return Obx(() => Stack(
            children: [
              /// The clipped image
              ClipRRect(
                borderRadius: BorderRadius.circular(radius_100),
                child: Image.file(
                  File(controller.profileImage.value.toString()),
                  fit: BoxFit.cover,
                  height: height_100,
                  width: height_100,
                ),
              ).paddingAll(margin_8),

              /// Positioned cross icon button to clear image
              Positioned(
                bottom: margin_5,
                right: margin_5,
                child: InkWell(
                  onTap: () {
                    // Clear the selected image
                    controller.profileImage.value = '';
                  },
                  child: Container(
                    height: 30,width: 30,
                    decoration: BoxDecoration(
                      color: colorAppColor,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Icon(
                        Icons.edit,
                        size: 20,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ));
    }
  }

  Future<void> _openURL(String url) async {
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      Get.snackbar("Error", "Cannot open URL");
    }
  }







  heading({title, icon}) {
    return Row(
      children: [
        AssetImageWidget(
          imageUrl: icon,
          color: colorAppColor,
          imageHeight: height_40,
          imageWidth: height_40,
        ).marginOnly(right: margin_10),
        TextView(
            text: title,
            textStyle: TextStyle(
                fontSize: font_16,
                fontWeight: FontWeight.w600,
                fontFamily: "Inter")),
      ],
    );
  }


}
