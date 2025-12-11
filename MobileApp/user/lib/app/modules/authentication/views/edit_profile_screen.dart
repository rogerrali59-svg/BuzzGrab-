import 'package:buzzgrab/app/core/widgets/shimmer_view_widget.dart';
import 'package:intl/intl.dart';
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

class EditProfileScreen extends StatelessWidget {
  final controller = Get.put(EditProfileController());
  final formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    lightChromeUI();
    return  SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: CustomAppBar(
          appBarTitleText: keyEditProfile.tr,
        ),
        body:Obx(() => controller.isLoading.value==true?EditProfileShimmer():
        SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                child: Form(
                  key: formKey,
                  child: Column(
                    children: [
                      SizedBox(
                        height: margin_10,
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        
                        children: [
                          SizedBox(
                            height: height_10,
                          ),
                          Center(
                            child: Container(
                              alignment: Alignment.center,
                              width: width_90,
                              height: height_90,
                              child: Stack(
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
                                              image: AssetImage(icon_person),
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                        ).paddingAll(margin_5),
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    right: margin_10,
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
                                            final status =
                                            await Permission.camera.status;
                                            if (status.isGranted == true) {
                                              controller.updateImageFile(
                                                  imageFromCamera());
                                            } else {
                                              await Permission.camera
                                                  .request()
                                                  .then((value) {
                                                if (value.isGranted == true) {
                                                  controller.updateImageFile(
                                                      imageFromCamera());
                                                } else {
                                                  if (status.isPermanentlyDenied) {
                                                    toast(
                                                        'Camera permission denied, Please enable to use camera.');
                                                    Future.delayed(
                                                        Duration(seconds: 1), () {
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
                                        imageUrl: 'assets/icons/camera.png',
                                        imageHeight: height_25,
                                        imageWidth: height_25,
                                      ),
                                    ),
                                  )
                                ],
                              ).paddingOnly(top: margin_0),
                            ),
                          ),
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
                            hint: keyFirstName.tr,
                            validate: (value) => FieldChecker.fieldChecker(
                                value: value, message: keyFirstName.tr),
                            courserColor: colorAppColor,
                            focusNode: controller.firstNameFocusNode,
                          ).paddingOnly(bottom: margin_5),
                          Text(
                            'Date of Birth',
                            style: TextStyle(
                              color: Colors.black,
                              fontFamily: FontFamily.inter,
                              fontWeight: FontWeight.w600,
                            ),
                          ).marginSymmetric(vertical: margin_5),
                          Obx(
                                () => GestureDetector(

                              onTap: () async {
                                // ensure initial date is safe
                                DateTime initial = controller.dob.value ?? DateTime(2000);

                                if (initial.isBefore(DateTime(1900))) {
                                  initial = DateTime(2000);
                                }

                                DateTime? pickedDate = await showDatePicker(
                                  context: Get.context!,
                                  initialDate: initial,
                                  firstDate: DateTime(1900),
                                  lastDate: DateTime.now(),
                                );

                                if (pickedDate != null) {
                                  controller.dob.value = pickedDate;
                                }
                              },

                              child: Container(
                                padding: EdgeInsets.symmetric(
                                    horizontal: 12, vertical: 14),
                                decoration: BoxDecoration(
                                  color: lightFieldColor,
                                  borderRadius: BorderRadius.circular(10),
                                  border:
                                  Border.all(color: Colors.grey.shade300),
                                ),
                                child: Row(
                                  mainAxisAlignment:
                                  MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      controller.dob.value != null
                                          ? DateFormat('MM/dd/yyyy')
                                          .format(controller.dob.value!)
                                          : 'Select Date of Birth',
                                      style: TextStyle(
                                        color: controller.dob.value != null
                                            ? Colors.black
                                            : Colors.grey,
                                      ),
                                    ),
                                    // Icon(Icons.calendar_today, color: Colors.grey),
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
                          Obx(
                                () => Row(
                              children:
                              ['Male', 'Female', 'Other'].map((gender) {
                                bool isSelected =
                                    controller.selectedGender.value == gender;
                                return Expanded(
                                  child: GestureDetector(
                                    onTap: () {
                                      controller.selectedGender.value = gender;
                                    },
                                    child: Container(
                                      margin:
                                      EdgeInsets.symmetric(horizontal: 4),
                                      padding:
                                      EdgeInsets.symmetric(vertical: 14),
                                      decoration: BoxDecoration(
                                        color: isSelected
                                            ? colorAppColor
                                            : Colors.white,
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                          color: isSelected
                                              ? colorAppColor
                                              : Colors.grey.shade200,
                                        ),
                                      ),
                                      alignment: Alignment.center,
                                      child: Text(
                                        gender,
                                        style: TextStyle(
                                          color: isSelected
                                              ? Colors.white
                                              : Colors.grey,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                            ).paddingOnly(bottom: height_10),
                          ),
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
                      ),
                      SizedBox(
                        height: height_20,
                      ),
                      MaterialButtonWidget(
                        onPressed: () {
                          if (formKey.currentState!.validate()) {
                            if (controller.profileImage.isEmpty) {
                              toast(keySelectProfile.tr);
                            } else if (controller.dob.value == '' ||
                                controller.dob.value == null) {
                              toast('Kindly Select Date of birth');
                            } else if (controller.selectedGender.value == '' ||
                                controller.selectedGender.value == null) {
                              toast('Kindly Select Gender');
                            } else {
                              controller.updateProfile();
                            }
                          }
                        },
                        buttonText: keySaveChanges.tr,
                      ).marginOnly(top: margin_15)
                    ],
                  ).paddingOnly(
                      left: margin_15, right: margin_15, bottom: margin_10),
                ),
              );
            },
          ),
        ),),
      ),
    );
  }

  _phoneWidget() {
    return Obx(
      () => CountryPicker(
        enabled: false,
        readOnly: true,
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
                    imageHeight: height_100,
                    imageWidth: height_100,
                    radiusAll: radius_100,
                  ),
                ),
              ),

              /// Cross button to clear image

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
      return Obx(() => ClipRRect(
            borderRadius: BorderRadius.circular(radius_100),
            child: Image.file(
              File(controller.profileImage.value.toString()),
              fit: BoxFit.cover,
              height: height_100,
              width: height_100,
            ),
          ).paddingAll(margin_8));
    }
  }

  heading({title, icon}) {
    return Row(
      children: [
        AssetImageWidget(
          imageUrl: icon,
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
