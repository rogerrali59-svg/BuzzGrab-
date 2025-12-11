import 'package:permission_handler/permission_handler.dart';

import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../../core/utils/helper_widget.dart';
import '../../../core/utils/image_picker_and_cropper.dart';
import '../../../core/utils/projectutils/validator.dart';
import '../../../core/widgets/annotated_region_widget.dart';
import '../../../core/widgets/country_picker.dart';
import '../../../core/widgets/image_picker_dialog.dart';
import 'account_submit_screen.dart';

class RegisterScreen extends GetView<RegisterController> {
  final controller = Get.find<RegisterController>();

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegionWidget(
      statusBarBrightness: Brightness.light,
      statusBarColor: Colors.white,
      child: WillPopScope(
        onWillPop: () async {
          if (controller.currentPageIndex.value > 0) {
            controller.currentPageIndex.value--;
          } else {
            if (controller.isLogin.value == true) {
              Get.offAllNamed(AppRoutes.logIn);
            } else {
              Get.back();
            }
          }
          return true; // allow pop
        },
        child: SafeArea(
          child: Scaffold(
            backgroundColor: Colors.white,
            body: SafeArea(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Expanded(
                        child: SingleChildScrollView(
                          child: Column(
                            children: [
                              SizedBox(
                                height: height_30,
                              ),
                              Row(
                                children: [
                                  GestureDetector(
                                      onTap: () {
                                        if (controller.currentPageIndex.value >
                                            0) {
                                          controller.currentPageIndex.value--;
                                        } else {
                                          if (controller.isLogin.value ==
                                              true) {
                                            Get.offAllNamed(AppRoutes.logIn);
                                          } else {
                                            Get.back();
                                          }
                                        }
                                      },
                                      child: AssetImageWidget(
                                        imageUrl: ic_back,
                                        imageHeight: height_35,
                                      )),
                                  SizedBox(
                                    width: width_10,
                                  ),
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      TextView(
                                          text: keyCreateAccount.tr,
                                          textStyle: TextStyle(
                                              fontSize: font_16,
                                              fontWeight: FontWeight.w600)),
                                      SizedBox(
                                        height: height_5,
                                      ),
                                      Obx(
                                        () => TextView(
                                            text:
                                                "${keyStep.tr} ${controller.currentPageIndex.value + 1} ${keyOfFour.tr}",
                                            textStyle: TextStyle(
                                                fontSize: font_14,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.black38)),
                                      ),
                                    ],
                                  )
                                ],
                              ),
                              SizedBox(
                                height: height_20,
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Obx(() => getCurrentWidget()),
                                  SizedBox(height: height_20),

                                  // NEXT BUTTON

                                  Obx(
                                    () => MaterialButtonWidget(
                                        buttonText:
                                            controller.currentPageIndex.value ==
                                                    3
                                                ? keySubmitForApproval.tr
                                                : keyContinue.tr,
                                        buttonColor: colorAppColor,
                                        fontsize: font_14,
                                        textColor: Colors.white,
                                        onPressed: () {
                                          controller.handlePage();
                                          return;
                                          if (controller
                                                  .currentPageIndex.value <
                                              3) {
                                            controller.handlePage();
                                          } else {
                                            controller.callSignUpApi();

                                            // Get.toNamed(AppRoutes.accountSubmitScreen);
                                          }
                                        }),
                                  ),
                                ],
                              )
                            ],
                          ).paddingOnly(
                              left: margin_15,
                              right: margin_15,
                              bottom: margin_10),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }

  _firstWidget() {
    return Form(
      key: controller.firstStepKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: height_10,
          ),
          AssetImageWidget(imageUrl: loading1),
          SizedBox(
            height: height_20,
          ),
          TextView(
              text: keyPersonalInformation.tr,
              textStyle: TextStyle(
                  fontSize: font_18,
                  fontWeight: FontWeight.w600,
                  fontFamily: "Inter")),
          TextView(
              text: keyTellUsAboutYourself.tr,
              textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w400,
                  fontFamily: "Inter")),
          SizedBox(
            height: height_30,
          ),
          Stack(
            alignment: Alignment.center,
            children: [
              Obx(
                () => controller.profileImage.value.isNotEmpty
                    ? controller.profileImage.value.toString().contains("http")
                        ? _networkImage()
                        : _selectedImage()
                    : Center(
                        child: Container(
                          height: height_85,
                          width: height_85,
                          decoration: BoxDecoration(
                            border: Border.all(
                                color: colorAppColor, width: width_2),
                            borderRadius: BorderRadius.circular(height_100),
                            image: DecorationImage(
                              image: AssetImage(icon_person),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ).paddingAll(margin_5),
                      ),
              ),
              controller.profileImage.value.isNotEmpty
                  ? emptySizeBox()
                  : Positioned(
                      right: margin_120,
                      bottom: margin_5,
                      child: InkWell(
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
                                    controller
                                        .updateImageFile(imageFromCamera());
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
          ).paddingOnly(top: margin_0),
          SizedBox(
            height: height_5,
          ),
          TextFieldWidget(
            tvHeading: keyFirstName.tr,
            fillColor: lightFieldColor,
            maxLength: 20,
            textController: controller.firstNameController,
            inputAction: TextInputAction.next,
            inputType: TextInputType.text,
            hint: "Enter first name".tr,
            validate: (value) {
              if (value == null || value.trim().isEmpty) {
                return "Please enter first name.".tr;
              }
              return null;
            },
            courserColor: colorAppColor,
            focusNode: controller.firstNameFocusNode,
          ).paddingOnly(bottom: margin_5),
          TextFieldWidget(
            tvHeading: keyLastName.tr,
            fillColor: lightFieldColor,
            maxLength: 20,
            textController: controller.lastNameNameController,
            inputAction: TextInputAction.next,
            inputType: TextInputType.text,
            hint: "Enter last name".tr,
            validate: (value) {
              if (value == null || value.trim().isEmpty) {
                return "Please enter last name.".tr;
              }
              return null;
            },
            courserColor: colorAppColor,
            focusNode: controller.lastNameFocusNode,
          ).paddingOnly(bottom: margin_5),
          TextFieldWidget(
            tvHeading: keyEmail.tr,
            hint: keyEnterEmail.tr,
            fillColor: lightFieldColor,
            readOnly: false,
            textController: controller.emailController,
            inputType: TextInputType.emailAddress,
            color: Colors.white,
            validate: (value) => EmailValidator.validateEmail(value),
            focusNode: controller.emailFocusNode,
          ).paddingOnly(bottom: margin_5),
          _phoneWidget()
        ],
      ),
    );
  }

  _thirdWidget() {
    return Form(
      key: controller.thirdStepKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: height_10,
          ),
          AssetImageWidget(imageUrl: loading3),
          SizedBox(
            height: height_20,
          ),
          TextView(
              text: keyBankDetails.tr,
              textStyle: TextStyle(
                  fontSize: font_18,
                  fontWeight: FontWeight.w600,
                  fontFamily: "Inter")),
          TextView(
              text: keyForReceivingPayments.tr,
              textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w400,
                  fontFamily: "Inter")),
          SizedBox(
            height: height_15,
          ),
          TextFieldWidget(
            tvHeading: keyAccountNumber.tr,
            fillColor: lightFieldColor,
            maxLength: 20,
            textController: controller.accountNoTextController,
            inputAction: TextInputAction.next,
            inputType: TextInputType.number,
            hint: keyEnterAccountNumber.tr,
            validate: (value) {
              if (value == null || value.trim().isEmpty) {
                return keyPleaseEnterAccountNumber.tr;
              }
              return null;
            },
            courserColor: colorAppColor,
            focusNode: controller.accountNoFocusNode,
          ).paddingOnly(bottom: margin_10),
          TextFieldWidget(
            tvHeading: keyBankName.tr,
            fillColor: lightFieldColor,
            maxLength: 20,
            textController: controller.bankNameTextController,
            inputAction: TextInputAction.next,
            inputType: TextInputType.text,
            hint: keyEnterBankName.tr,
            validate: (value) {
              if (value == null || value.trim().isEmpty) {
                return keyPleaseEnterBankName.tr;
              }
              return null;
            },
            courserColor: colorAppColor,
            focusNode: controller.bankNameFocusNode,
          ).paddingOnly(bottom: margin_10),
          TextFieldWidget(
            tvHeading: keyRoutingNumber.tr,
            fillColor: lightFieldColor,
            maxLength: 20,
            textController: controller.routingNumberController,
            inputAction: TextInputAction.next,
            inputType: TextInputType.text,
            hint: keyEnterRoutingNumber.tr,
            validate: (value) {
              if (value == null || value.trim().isEmpty) {
                return keyPleaseEnterRoutingNumber.tr;
              }
              return null;
            },
            courserColor: colorAppColor,
            focusNode: controller.routingNumberFocusNode,
          ).paddingOnly(bottom: margin_10),
        ],
      ),
    );
  }

  _secondWidget() {
    return Form(
      key: controller.secondStepKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: height_10,
          ),
          AssetImageWidget(imageUrl: loading2),
          SizedBox(
            height: height_20,
          ),
          TextView(
              text: keyDriverVehicleDetails.tr,
              textStyle: TextStyle(
                  fontSize: font_18,
                  fontWeight: FontWeight.w600,
                  fontFamily: "Inter")),

          TextView(
              text: keyUploadYourDocuments.tr,
              textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w400,
                  fontFamily: "Inter")),
          SizedBox(
            height: height_10,
          ),

          TextFieldWidget(
            hint: "Doc",
            tvHeading: keyDriverLicense.tr,
            readOnly: true,
            fillColor: lightFieldColor,
            suffixIcon: Transform.rotate(
              angle: 0.5, // Radians (~-28.6 degrees, adjust as needed)
              child: Icon(
                Icons.attach_file,
                color: Colors.black26,
                size: 20,
              ),
            ),
            textController: controller.drivingLicenseController,
            inputType: TextInputType.text,
            onTap: () => controller.pickFile(
              onFilePicked: (file) {
                controller.drivingLicenseFile = file;
                controller.drivingLicenseController.text =
                    file.path.split('/').last;
              },
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
            suffixIcon: Transform.rotate(
              angle: 0.5, // Radians (~-28.6 degrees, adjust as needed)
              child: Icon(
                Icons.attach_file,
                color: Colors.black26,
                size: 20,
              ),
            ),
            textController: controller.registrationCertController,
            inputType: TextInputType.text,
            onTap: () => controller.pickFile(
              onFilePicked: (file) {
                controller.registrationNoFile = file;
                controller.registrationCertController.text =
                    file.path.split('/').last;
              },
            ),
          ),

          SizedBox(height: height_10),

          // RMS Check Upload Field
          TextFieldWidget(
              hint: "Doc",
              tvHeading: keyInsuranceCertificate.tr,
              readOnly: true,
              fillColor: lightFieldColor,
              textController: controller.insuranceCertificateController,
              onTap: () => controller.pickFile(
                    onFilePicked: (file) {
                      controller.insuranceCertificateFile = file;
                      controller.insuranceCertificateController.text =
                          file.path.split('/').last;
                    },
                  ),
              suffixIcon: Transform.rotate(
                angle: 0.5, // Radians (~-28.6 degrees, adjust as needed)
                child: Icon(
                  Icons.attach_file,
                  color: Colors.black26,
                  size: 20,
                ),
              )),
          SizedBox(height: height_10),
          TextFieldWidget(
            tvHeading: "DL Number",
            fillColor: lightFieldColor,
            maxLength: 20,
            textController: controller.registrationNumberController,
            inputAction: TextInputAction.next,
            inputType: TextInputType.text,
            hint: "Enter Dl number",
            validate: (value) {
              if (value == null || value.trim().isEmpty) {
                return "Please enter Dl number".tr;
              }
              return null;
            },
            courserColor: colorAppColor,
            focusNode: controller.registrationFocusNode,
          ).paddingOnly(bottom: margin_10),
        ],
      ),
    );
  }

  _fourthWidget() {
    return Form(
      key: controller.fourthStepKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: height_10,
          ),
          AssetImageWidget(imageUrl: loading4),
          SizedBox(
            height: height_20,
          ),
          TextView(
              text: keyPasswordReview.tr,
              textStyle: TextStyle(
                  fontSize: font_18,
                  fontWeight: FontWeight.w600,
                  fontFamily: "Inter")),
          TextView(
              text: keySecureYourAccount.tr,
              textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w400,
                  fontFamily: "Inter")),
          SizedBox(
            height: height_15,
          ),
          Obx(
            () => TextFieldWidget(
                tvHeading: keyPassword.tr,
                hint: keyEnterPassword.tr,
                fillColor: lightFieldColor,
                textController: controller.passwordController,
                inputType: TextInputType.emailAddress,
                obscureText: controller.viewPassword.value,
                suffixIcon: GestureDetector(
                  onTap: () {
                    controller.showOrHidePasswordVisibility();
                  },
                  child: Icon(
                    (controller.viewPassword.value == true)
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    color: Colors.grey,
                    size: font_18,
                  ),
                ),
                validate: (value) =>
                    PasswordFormValidator.validatePassword(value),
                focusNode: controller.passwordFocusNode),
          ),
          SizedBox(height: height_10),
          Obx(
            () => TextFieldWidget(
              tvHeading: keyConfirmPassword.tr,
              hint: keyEnterConfirmPassword.tr,
              fillColor: lightFieldColor,
              textController: controller.confPasswordController,
              inputAction: TextInputAction.next,
              inputType: TextInputType.emailAddress,
              obscureText: controller.confirmViewPassword.value,
              suffixIcon: GestureDetector(
                onTap: () {
                  controller.showOrHideConfPasswordVisibility();
                },
                child: Icon(
                  (controller.confirmViewPassword.value == true)
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: Colors.grey,
                  size: font_18,
                ),
              ),
              validate: (value) {
                return PasswordFormValidator.validateConfirmPasswordMatch(
                    value: value,
                    valueMessage: keyConfirmPasswordSame.tr,
                    password: controller.passwordController.text);
              },
            ),
          ),
          SizedBox(height: height_10),
        ],
      ),
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
                  borderRadius: BorderRadius.circular(radius_20),
                  child: NetworkImageWidget(
                    imageurl: controller.profileImage.value,
                    imageFitType: BoxFit.cover,
                    imageHeight: height_150,
                    imageWidth: height_150,
                  ),
                ),
              ),

              /// Cross button to clear image
              Positioned(
                top: margin_5,
                right: margin_5,
                child: GestureDetector(
                  onTap: () {
                    controller.profileImage.value = ''; // Clear image
                  },
                  child: Container(
                    padding: EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.6),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.close,
                      size: 20,
                      color: Colors.white,
                    ),
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
                borderRadius: BorderRadius.circular(radius_20),
                child: Image.file(
                  File(controller.profileImage.value.toString()),
                  fit: BoxFit.cover,
                  height: height_150,
                  width: height_150, // add width for consistent size
                ),
              ).paddingAll(margin_8),

              /// Positioned cross icon button to clear image
              Positioned(
                top: margin_15,
                right: margin_15,
                child: GestureDetector(
                  onTap: () {
                    // Clear the selected image
                    controller.profileImage.value = '';
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.6),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.close,
                      size: 30,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ));
    }
  }

  inputDecoration() => InputDecoration(
      counterText: "",
      errorMaxLines: 4,
      floatingLabelBehavior: FloatingLabelBehavior.always,
      errorStyle: Theme.of(Get.context!).textTheme.bodySmall!.copyWith(
          fontSize: font_10,
          fontWeight: FontWeight.w500,
          color: Colors.red,
          fontFamily: "Inter"),
      isDense: true,
      suffixIcon: InkWell(
          onTap: () {
            controller.addressController.clear();
          },
          child: Icon(
            Icons.close,
            color: Colors.white,
          )),
      filled: true,
      contentPadding:
          EdgeInsets.symmetric(horizontal: margin_15, vertical: margin_8),
      hintText: 'Location',
      hintStyle: textStyleBody1().copyWith(
          color: Colors.grey.shade500,
          fontWeight: FontWeight.w500,
          fontFamily: "Inter"),
      fillColor: Colors.transparent,
      border: DecoratedInputBorder(
        child: OutlineInputBorder(
            borderRadius: BorderRadius.circular(margin_30),
            borderSide: BorderSide(color: Colors.black26, width: width_1)),
        shadow: BoxShadow(
          color: Colors.transparent,
          blurRadius: margin_2,
          spreadRadius: margin_2,
        ),
      ),
      focusedErrorBorder: DecoratedInputBorder(
        child: OutlineInputBorder(
            borderRadius: BorderRadius.circular(margin_30),
            borderSide: BorderSide(color: Colors.black26, width: width_1)),
        shadow: BoxShadow(
          color: Colors.transparent,
          blurRadius: margin_2,
          spreadRadius: margin_2,
        ),
      ),
      errorBorder: DecoratedInputBorder(
          child: OutlineInputBorder(
              borderRadius: BorderRadius.circular(margin_30),
              borderSide: BorderSide(color: Colors.black26, width: width_1)),
          shadow: BoxShadow(
            color: Colors.transparent,
            blurRadius: margin_2,
            spreadRadius: margin_2,
          )),
      focusedBorder: DecoratedInputBorder(
          child: OutlineInputBorder(
              borderRadius: BorderRadius.circular(margin_30),
              borderSide: BorderSide(color: Colors.black26, width: width_1)),
          shadow: BoxShadow(
            color: Colors.transparent,
            blurRadius: margin_2,
            spreadRadius: margin_2,
          )),
      enabledBorder: DecoratedInputBorder(
        child: OutlineInputBorder(
            borderRadius: BorderRadius.circular(margin_30),
            borderSide: BorderSide(color: Colors.black26, width: width_1)),
        shadow: BoxShadow(
          color: Colors.transparent,
          blurRadius: margin_2,
          spreadRadius: margin_2,
        ),
      ));

  // placesAutoCompleteTextField() {
  //   return GooglePlaceAutoCompleteTextField(
  //     textEditingController: controller.addressController,
  //     googleAPIKey: GOOGLE_PLACES_API_KEY,
  //     debounceTime: 200,
  //     isLatLngRequired: true,
  //     itemClick: (Prediction prediction) {},
  //     getPlaceDetailWithLatLng: (Prediction prediction) async {
  //       try {
  //         controller.lat = prediction.lat?.toString() ?? '';
  //         controller.lng = prediction.lng?.toString() ?? '';
  //         controller.addressController.text = prediction.description ?? "";
  //         await controller.getAddressFromLatLong(prediction.lat, prediction.lng);
  //       } catch (e, st) {
  //         print('error======>$e');
  //         print('error--->$st');
  //       }
  //     },
  //     textStyle: textStyleBody2().copyWith(color: Colors.white, fontFamily: "Nunito", fontWeight: FontWeight.w400),
  //     boxDecoration: BoxDecoration(
  //       border: Border.all(color: Colors.transparent),
  //       borderRadius: BorderRadius.circular(radius_25),
  //     ),
  //     focusNode: controller.addressFocusNode,
  //     itemBuilder: (context, index, Prediction prediction) {
  //       return Container(
  //         padding: EdgeInsets.all(8),
  //         child: Row(
  //           children: [
  //             Icon(Icons.location_on),
  //             SizedBox(width: 7),
  //             Expanded(
  //               child: Text(
  //                 "${prediction.description ?? ""}",
  //                 style: TextStyle(fontFamily: "Nunito", fontWeight: FontWeight.w400),
  //               ),
  //             ),
  //           ],
  //         ),
  //       );
  //     },
  //     isCrossBtnShown: false,
  //     inputDecoration: inputDecoration(),
  //   ).paddingOnly(top: margin_10);
  // }

  _bioData({text}) {
    return TextView(
      text: text,
      textStyle: textStyleBody1().copyWith(
        fontSize: font_16,
        fontFamily: "Inter",
        color: Colors.white,
      ),
    ).paddingOnly(
      left: margin_5,
    );
  }

  cameraIcon() {
    return CircleAvatar(
      maxRadius: 15,
      backgroundColor: Colors.blue,
      child: Icon(
        Icons.camera_alt,
        color: Colors.white,
        size: 18,
      ),
    );
  }

  Widget getCurrentWidget() {
    final pages = [
      _firstWidget(),
      _secondWidget(),
      _thirdWidget(),
      _fourthWidget(),
    ];

    // Prevent index overflow
    if (controller.currentPageIndex.value >= pages.length) {
      return const SizedBox();
    }

    return pages[controller.currentPageIndex.value];
  }
}

class OtpInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    String newText = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');
    if (newText.length > 6) {
      newText = newText.substring(0, 6);
    }
    return TextEditingValue(
      text: newText,
      selection: TextSelection.collapsed(offset: newText.length),
    );
  }
}
