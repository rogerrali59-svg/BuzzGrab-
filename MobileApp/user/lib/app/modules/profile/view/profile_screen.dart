/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/authentication/controllers/edit_profile_controller.dart';
import 'package:buzzgrab/app/modules/profile/controller/profile_controller.dart';
import 'package:buzzgrab/main.dart';
import '../../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../../core/values/route_arguments.dart';

class ProfileScreen extends StatelessWidget {
  final controller = Get.put(ProfileController());

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextView(
                  text: 'Profile',
                  textStyle: textStyleBodyMedium().copyWith(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                      fontSize: 25)),

              SizedBox(
                height: height_10,
              ),
              Obx(
                () => Row(
                  children: [
                    Obx(() {
                return  signUpData.value.profilePic!=''&&signUpData.value.profilePic!=null? Container(
                  height: height_50,
                  width: height_50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    image: DecorationImage(
                      image:
                      NetworkImage(signUpData.value.profilePic ?? ''),
                      fit: BoxFit.cover,

                    ),
                  ),
                ):AssetImageWidget(imageUrl: 'assets/icons/default_image.png',
                  imageHeight: height_50,
                  imageWidth: width_50,
                  radiusAll: 100,);
              }),
                    SizedBox(
                      width: width_10,
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextView(
                            text: signUpData.value.fullName ?? 'John Die',
                            textStyle: textStyleBodyMedium().copyWith(
                                color: Colors.black,
                                fontWeight: FontWeight.bold)),
                        TextView(
                            text: signUpData.value.email ?? 'johndoe@toxsl.in',
                            textStyle: textStyleBodyMedium())
                      ],
                    )
                  ],
                ),
              ),
              SizedBox(
                height: height_10,
              ),
              TextView(
                      text: keyAccount.tr,
                      textStyle: TextStyle(
                          fontWeight: FontWeight.w600, fontSize: font_20))
                  .paddingOnly(left: width_5),
              SizedBox(
                height: height_10,
              ),
              listTileWidget(
                icon: iconProfileImg,
                title: keyEditAccount.tr,
                onTap: () {
                  Get.delete<EditProfileController>();
                  Get.toNamed(AppRoutes.editProfileScreen);
                },
              ),
              listTileWidget(
                icon: iconLoc,
                title: 'Manage Address',
                onTap: () {
                  Get.toNamed(AppRoutes.addressScreen);
                },
              ),
              listTileWidget(
                icon: iconDoc,
                title: 'Documents',
                onTap: () {
                  Get.toNamed(AppRoutes.documentScreen);
                },
              ),
              listTileWidget(
                icon: iconPayment,
                title: 'Payment Methods',
                onTap: () {
                  Get.toNamed(AppRoutes.changePassword);
                },
              ),
              notificationWidget(
                icon: iconNotify,
                switchShow: true,
                title: keyPushNotification.tr,
                onTap: () {},
              ),
              listTileWidget(
                icon: iconAboutUs,
                title: keyAboutUs.tr,
                onTap: () {
                  Get.toNamed(AppRoutes.staticPageScreen, arguments: {
                    "type_id": TYPE_ABOUT_US,
                    'title': 'About Us'
                  });
                },
              ),
              listTileWidget(
                icon: iconContactUs,
                title: keyContactUs.tr,
                onTap: () {
                  Get.toNamed(AppRoutes.contactUs);
                },
              ),
              listTileWidget(
                icon: iconTermsAndConditions,
                title: 'Terms And Conditions',
                onTap: () {
                  Get.toNamed(AppRoutes.staticPageScreen, arguments: {
                    "type_id": 2,
                    'title': 'Terms And Conditions'
                  });
                },
              ),
              listTileWidget(
                icon: iconTermsAndConditions,
                title: 'Privacy Policy',
                onTap: () {
                  Get.toNamed(AppRoutes.staticPageScreen,
                      arguments: {"type_id": 3, 'title': 'Privacy Policy'});
                },
              ),
              listTileWidget(
                icon: iconAboutUs,
                title: 'About App',
                onTap: () {
                  Get.toNamed(AppRoutes.aboutUsScreen,
                      arguments: {"type_id": 3, 'title': 'Privacy Policy'});
                },
              ),
              listTileWidget(
                iconWidget: Icon(
                  Icons.delete,
                  color: Colors.black,
                  size: width_25,
                ),
                title: keyDeleteAccount.tr,
                onTap: () {
                  customDialog(
                      description:
                          'Are you sure you want to delete this Account?',
                      title: 'Delete Account',
                      okTitle: 'Delete Account',
                      onOk: () {
                        controller.hitDeleteAccountApi();
                      });
                },
              ),
              SizedBox(
                height: height_6,
              ),
              MaterialButtonWidget(
                onPressed: () {
                  customDialog(
                      description: 'Are you sure you want to logout?',
                      title: 'Logout',
                      okTitle: 'Logout',
                      onOk: () {
                        controller.hitLogoutApi();
                      });
                },
                buttonRadius: radius_10,
                borderColor: Colors.grey.shade300,
                buttonColor: Colors.transparent,
                buttonText: keyLogout.tr,
                textColor: Colors.red,
              ),
            ],
          ).marginSymmetric(horizontal: margin_12),
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
            imageHeight: height_25,
            imageWidth: width_25,
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
      ).marginSymmetric(vertical: margin_8),
    );
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
                  onPressed: onOk ?? () {},
                  buttonText: okTitle,
                  padding: 10.0,
                  buttonColor: Colors.red,
                ),
              ),
            ],
          ).marginOnly(top: margin_10),
        ],
      ).marginAll(margin_15),
    ));
  }

  Widget listTileWidget({icon, title, VoidCallback? onTap, iconWidget}) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Row(
            children: [
              iconWidget == null
                  ? AssetImageWidget(
                      imageUrl: icon,
                      imageHeight: height_25,
                      imageWidth: width_25,
                    )
                  : iconWidget,
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
      ).marginSymmetric(vertical: margin_8),
    );
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
          bottomLeft: Radius.circular(radius_12),
          bottomRight: Radius.circular(radius_12),
        ),
      ),
      padding: EdgeInsets.symmetric(horizontal: margin_15, vertical: margin_40),
      child: Column(
        children: [
          Container(
            width: height_70,
            height: height_70,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.green, width: 2),
              image: DecorationImage(
                image: NetworkImage(imageUrl),
                fit: BoxFit.cover,
              ),
            ),
          ),
          const SizedBox(height: 20),
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
