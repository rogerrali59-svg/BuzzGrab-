import 'package:intl/intl.dart';
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
    return SafeArea(
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
                            height: height_10,
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Obx(
                                () => _firstWidget(),
                              ),
                              SizedBox(height: height_20),

                              // NEXT BUTTON

                              MaterialButtonWidget(
                                  buttonText: keySignUp.tr,
                                  buttonColor: colorAppColor,
                                  fontsize: font_14,
                                  buttonRadius: radius_10,
                                  textColor: Colors.white,
                                  onPressed: () {
                                    // controller.handlePage();
                                    // return;
                                    if (controller.firstStepKey.currentState!
                                        .validate()) {
                                      if (controller.dob.value == null ||
                                          controller.dob.value == '') {
                                        toast('Kindly select Date of Birth');
                                      } else if (controller.selectedGender.value == '' || controller.selectedGender.value == null) {
                                        toast('Kindly Select Gender');
                                      } else {
                                        controller.callSignUpApi();
                                      }
                                    }
                                  }),

                              Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  SizedBox(height: height_20),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Expanded(
                                        child: Divider(
                                          color: Colors.grey.shade300,
                                          thickness: 2,
                                        ),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 12.0),
                                        child: Text(
                                          'Or continue with',
                                          style: TextStyle(
                                            color: Colors.grey,
                                            fontSize: font_12,
                                            fontFamily: FontFamily.inter,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                      Expanded(
                                        child: Divider(
                                          color: Colors.grey.shade300,
                                          thickness: 2,
                                        ),
                                      ),
                                    ],
                                  ).paddingSymmetric(horizontal: margin_10),
                                  SizedBox(height: height_20),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Container(
                                          margin:
                                              const EdgeInsets.only(right: 8),
                                          // space between buttons
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(10),
                                            border: Border.all(
                                                color: Colors.grey.shade300),
                                          ),
                                          child: GestureDetector(
                                            onTap: () {
                                              // Google login action
                                            },
                                            child: Image.asset(
                                              'assets/icons/google.png',
                                              // your Google logo path
                                              height: 20,
                                              width: 20,
                                            ).paddingSymmetric(
                                                vertical: margin_10),
                                          ),
                                        ),
                                      ),
                                      Expanded(
                                        child: Container(
                                          margin:
                                              const EdgeInsets.only(left: 8),
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(10),
                                            border: Border.all(
                                                color: Colors.grey.shade300),
                                          ),
                                          child: GestureDetector(
                                            onTap: () {
                                              // Facebook login action
                                            },
                                            child: Image.asset(
                                              'assets/icons/facebook.png',
                                              // your Facebook logo path
                                              height: 20,
                                              width: 20,
                                            ).paddingSymmetric(
                                                vertical: margin_10),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: height_20),
                                  RichText(
                                    textAlign: TextAlign.center,
                                    text: TextSpan(
                                      children: [
                                        TextSpan(
                                          text: "Already have an account? ",
                                          style: TextStyle(
                                            color: Colors.black,
                                            fontSize: 13,
                                            fontFamily: FontFamily.inter,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        TextSpan(
                                          text: 'Login',
                                          style: TextStyle(
                                            color: Colors.blue,
                                            decoration:
                                                TextDecoration.underline,
                                            fontSize: 13,
                                            fontFamily: FontFamily.inter,
                                            fontWeight: FontWeight.w600,
                                          ),
                                          recognizer: TapGestureRecognizer()
                                            ..onTap = () {
                                              Get.offAllNamed(AppRoutes.logIn);
                                            },
                                        ),
                                      ],
                                    ),
                                  ),
                                  SizedBox(height: height_30),
                                ],
                              ),
                            ],
                          )
                        ],
                      ).paddingOnly(
                          left: margin_15, right: margin_15, bottom: margin_10),
                    ),
                  ),
                ],
              );
            },
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
          TextView(
              text: 'Create Account',
              textStyle: TextStyle(
                fontSize: font_20,
                fontWeight: FontWeight.w600,
              )),
          TextView(
              text: 'Sign up to get started',
              textStyle: TextStyle(
                fontSize: font_16,
                color: Colors.grey,
                fontWeight: FontWeight.w400,
              )),
          SizedBox(
            height: height_5,
          ),
          TextFieldWidget(
            tvHeading: 'Full Name',
            fillColor: lightFieldColor,
            maxLength: 20,
            textController: controller.fullNameController,
            inputAction: TextInputAction.next,
            inputType: TextInputType.text,
            hint: "Enter Full Name",
            validate: (value) {
              if (value == null || value.trim().isEmpty) {
                return "Please enter full name.".tr;
              }
              return null;
            },
            courserColor: colorAppColor,
            focusNode: controller.firstNameFocusNode,
          ).paddingOnly(bottom: margin_5),
          SizedBox(height: height_10),

          // DOB Selector
          Text(
            'Date of Birth',
            style: TextStyle(
              color: Colors.black,
              fontFamily: FontFamily.inter,
              fontWeight: FontWeight.w600,
            ),
          ).paddingOnly(bottom: 10),
      Obx(
            () => GestureDetector(
          onTap: () async {
            // Calculate max date = today - 18 years
            final DateTime today = DateTime.now();
            final DateTime max18Date = DateTime(today.year - 18, today.month, today.day);

            DateTime? pickedDate = await showDatePicker(
              context: Get.context!,
              initialDate: controller.dob.value ?? max18Date,
              firstDate: DateTime(1900),
              lastDate: max18Date, // ❗ User cannot select after this (must be 18+)
            );

            if (pickedDate != null) {
              controller.dob.value = pickedDate;
            }
          },
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 14),
            decoration: BoxDecoration(
              color: lightFieldColor,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  controller.dob.value != null
                      ? DateFormat('MM/dd/yyyy').format(controller.dob.value!)
                      : 'Select Date of Birth',
                  style: TextStyle(
                    color: controller.dob.value != null ? Colors.black : Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ),
      ).paddingOnly(bottom: margin_10),


      // Gender Selector
          Text(
            'Gender',
            style: TextStyle(
              color: Colors.black,
              fontFamily: FontFamily.inter,
              fontWeight: FontWeight.w600,
            ),
          ).paddingOnly(bottom: 10),
          Row(
            children: ['Male', 'Female', 'Other'].map((gender) {
              bool isSelected = controller.selectedGender.value == gender;
              return Expanded(
                child: GestureDetector(
                  onTap: () {
                    controller.selectedGender.value = gender;
                  },
                  child: Container(
                    margin: EdgeInsets.symmetric(horizontal: 4),
                    padding: EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: isSelected ? colorAppColor : Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color:
                            isSelected ? colorAppColor : Colors.grey.shade200,
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      gender,
                      style: TextStyle(
                        color: isSelected ? Colors.white : Colors.grey,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ).paddingOnly(bottom: height_10),

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
          _phoneWidget(),

          SizedBox(height: height_10),

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
}
