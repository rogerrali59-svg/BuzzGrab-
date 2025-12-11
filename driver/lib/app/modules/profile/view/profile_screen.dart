/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/app/core/values/theme_controller.dart';
import 'package:alcoholdeliverydriver/app/core/widgets/annotated_region_widget.dart';
import 'package:alcoholdeliverydriver/app/modules/authentication/controllers/edit_profile_controller.dart';
import 'package:alcoholdeliverydriver/app/modules/profile/controller/profile_controller.dart';
import 'package:alcoholdeliverydriver/app/modules/setting/view/about_app_screen.dart';
import 'package:alcoholdeliverydriver/main.dart';
import '../../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../../core/values/route_arguments.dart';

class ProfileScreen extends GetView<ProfileController> {
  final controller = Get.put(ProfileController());

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegionWidget(
      statusBarColor: colorAppColor,
      statusBarBrightness: Brightness.light,
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              profileCardWidget(
                imageUrl: '${signUpData.value.profileImg}',
                name: '${signUpData.value.fullName}',
                email: '${signUpData.value.email}',
                onEditTap: () {
                  print("00fdsfi");
                  Get.toNamed(AppRoutes.editProfileScreen, arguments: {
                    'editProfile': true,
                  });
                },
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  SizedBox(
                    height: height_10,
                  ),
                  TextView(
                          text: keyAccount.tr,
                          textStyle: TextStyle(
                              fontWeight: FontWeight.w500, fontSize: font_20))
                      .paddingOnly(left: width_5),
                  SizedBox(
                    height: height_10,
                  ),
                  listTileWidget(
                    icon: avatar,
                    title: keyEditAccount.tr,
                    onTap: () {
                      Get.delete<EditProfileController>();
                      Get.toNamed(AppRoutes.editProfileScreen);
                    },
                  ),

                  listTileWidget(
                    icon: ic_changePassword,
                    title: keyChangePassword.tr,
                    onTap: () {
                      Get.toNamed(AppRoutes.changePassword);
                    },
                  ),
                  SizedBox(
                    height: height_8,
                  ),
                  Divider(
                    color: Colors.grey.shade300,
                    thickness: 1,
                    height: 0,
                    indent: 16,
                    endIndent: 16,
                  ),
                  SizedBox(
                    height: height_10,
                  ),
                  TextView(
                          text: keySettings.tr,
                          textStyle: TextStyle(
                              fontWeight: FontWeight.w500, fontSize: font_20))
                      .paddingOnly(left: width_5),
                  SizedBox(
                    height: height_10,
                  ),
                  notificationWidget(
                    icon: ic_pushNotification,
                    switchShow: true,
                    title: keyPushNotification.tr,
                    onTap: () {},
                  ),
                  listTileWidget(
                    icon: ic_contactUs,
                    title: keyContactUs.tr,
                    onTap: () {
                      Get.toNamed(AppRoutes.contactUs);
                    },
                  ),
                  listTileWidget(
                    icon: ic_aboutUs,
                    title: keyAboutUs.tr,
                    onTap: () {
                      Get.toNamed(AppRoutes.staticPageScreen, arguments: {
                        "type_id": TYPE_ABOUT_US,
                        'title': 'About Us'
                      });
                    },
                  ),
                  listTileWidget(
                    icon: ic_privacyPolicy,
                    title: keyPrivacyPolicy.tr,
                    onTap: () {
                      Get.toNamed(AppRoutes.staticPageScreen, arguments: {
                        "type_id": TYPE_PRIVACY,
                        'title': 'Privacy Policy'
                      });
                    },
                  ),
                  listTileWidget(
                    icon: ic_privacyPolicy,
                    title: 'Terms & Conditions',
                    onTap: () {
                      Get.toNamed(AppRoutes.staticPageScreen, arguments: {
                        "type_id": TYPE_TERM_CONDITION,
                        'title': 'Terms & Conditions'
                      });
                    },
                  ),

                  SizedBox(
                    height: height_6,
                  ),
                  ElevatedButton(
                    onPressed: () {
                      customDialog(
                          description: 'Are you sure you want to logout?',
                          title: 'Logout',
                          okTitle: 'Logout',
                          onOk: () {
                            controller.hitLogoutApi();
                          });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorAppColor,
                      minimumSize: Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(keyLogout.tr,
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: font_14,
                            fontWeight: FontWeight.w500)),
                  ).paddingSymmetric(horizontal: height_10),
                ],
              ).marginSymmetric(horizontal: margin_15)
            ],
          ),
        ),
      ),
    );
  }

  notificationWidget({icon, title, onTap, widget, switchShow = false}) {
    return InkWell(
      splashColor: Colors.transparent,
      onTap: onTap ?? () {},
      child: Row(
        children: [
          AssetImageWidget(
            imageUrl: icon ?? "",
            imageHeight: height_40,
            imageWidth: width_40,
          ),
          SizedBox(width: width_15),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: Colors.black,
              ),
            ),
          ),
          switchShow
              ? Obx(() => Transform.scale(
                    scale: 0.8,
                    child: Switch(
                      inactiveTrackColor: Colors.grey,
                      activeTrackColor: colorAppColor,
                      trackOutlineColor:
                          MaterialStateProperty.resolveWith<Color?>(
                        (Set<MaterialState> states) {
                          if (states.contains(MaterialState.disabled)) {
                            return Colors.white;
                          }
                          return Colors.transparent;
                        },
                      ),
                      thumbColor: MaterialStatePropertyAll(Colors.white),
                      value: controller.notificationState.value,
                      onChanged: (val) {
                        controller.notificationState.value = val;
                        controller.hitUpdateNotificationStatusApi();
                      },
                    ).paddingOnly(left: margin_5),
                  ))
              : SizedBox()
        ],
      ),
    ).marginOnly(bottom: margin_8);
  }

  customDialog({title, description, onOk, okTitle}) {
    Get.bottomSheet(Container(
      color: Colors.white,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextView(
                  text: title,
                  textStyle: textStyleBodyMedium()
                      .copyWith(fontWeight: FontWeight.w600, fontSize: font_16))
              .marginOnly(bottom: margin_15),
          TextView(text: description, textStyle: textStyleBodyMedium()),
          Row(
            children: [
              Expanded(
                child: MaterialButtonWidget(
                  buttonRadius: radius_10,

                  textColor: Colors.black,
                  buttonColor: Colors.white,

                  borderColor: Colors.grey,
                  onPressed: () {
                    Get.back(result: true);
                  },
                  padding: 10.0,
                  buttonText: 'Cancel',
                ),
              ),
              SizedBox(
                width: width_10,
              ),
              Expanded(
                child: MaterialButtonWidget(
                  buttonRadius: radius_10,
                  onPressed: onOk ?? () {},
                  buttonText: okTitle,
                  padding: 10.0,
                  buttonColor: colorAppColor,
                ),
              ),
            ],
          ).marginOnly(top: margin_10),
        ],
      ).marginAll(margin_15),
    ));
  }

  Widget listTileWidget({
    icon,
    title,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Row(
            children: [
              AssetImageWidget(
                imageUrl: icon,
                color: colorAppColor,
                imageHeight: height_40,
                imageWidth: width_40,
              ),
              SizedBox(width: width_15),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    color: Colors.black,
                  ),
                ),
              ),
              AssetImageWidget(
                imageUrl: iconArrowForward,
                imageHeight: height_20,
                imageWidth: width_20,
              ),
            ],
          ),
          // Divider(
          //   color: Colors.grey.shade300,
          //   thickness: 1,
          //   height: 0,
          //   indent: 16,
          //   endIndent: 16,
          // ),
        ],
      ),
    ).marginOnly(bottom: margin_8);
  }

  Widget profileCardWidget({
    required String imageUrl,
    required String name,
    required String email,
    required VoidCallback onEditTap,
  }) {
    return Container(
      width: Get.width,
      decoration: BoxDecoration(
        color: colorAppColor,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(radius_15),
          bottomRight: Radius.circular(radius_15),
        ),
      ),
      padding: EdgeInsets.symmetric(horizontal: margin_15, vertical: margin_20),
      child: Column(
        children: [

          Container(
            width: height_70,
            height: height_70,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2),
            ),
            child: NetworkImageWidget(
              imageurl: imageUrl,
              imageHeight: height_70,
              imageWidth: height_70,
              imageFitType: BoxFit.cover,
              radiusAll: 100,
              placeHolder: icon_person,
            ),
          ),
          const SizedBox(height: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                name,
                style: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              Text(
                email,
                style: TextStyle(
                  fontSize: font_14,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void showLogoutDialog() {
    Get.defaultDialog(
      title: 'Logout',
      middleText: 'Are you sure you want to logout?',
      titleStyle: TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Colors.black,
      ),
      middleTextStyle: TextStyle(
        fontSize: 16,
        color: Colors.black54,
      ),
      barrierDismissible: false,
      radius: 12,
      contentPadding: EdgeInsets.all(20),
      textCancel: 'Cancel',
      textConfirm: 'Logout',
      cancelTextColor: Colors.black,
      confirmTextColor: Colors.white,
      onCancel: () {
        Get.back();
      },
      onConfirm: () {
        controller.hitLogoutApi();
      },
      buttonColor: Colors.red,
    );
  }
}
