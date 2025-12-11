import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get/get_core/src/get_main.dart';
import 'package:get/get_utils/get_utils.dart';
import 'package:alcoholdeliverydriver/app/core/values/app_assets.dart';
import 'package:alcoholdeliverydriver/app/core/values/app_colors.dart';
import 'package:alcoholdeliverydriver/app/core/values/dimens.dart';
import 'package:alcoholdeliverydriver/app/core/values/text_styles.dart';
import 'package:alcoholdeliverydriver/app/core/widgets/text_view.dart';
import 'package:alcoholdeliverydriver/app/modules/asset_image/asset_image.dart';
import 'package:alcoholdeliverydriver/app/modules/network-image/network_image.dart';
import 'package:alcoholdeliverydriver/app/routes/app_routes.dart';

class CustomHeaderWidget extends StatelessWidget {
  final leftImagePath;
  final title;
  final location;
  final rightImagePath;
  final notificationCount;

  const CustomHeaderWidget({
    Key? key,
    this.leftImagePath,
    this.title,
    this.location,
    this.rightImagePath,
    this.notificationCount = 0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            // Asset Image
            NetworkImageWidget(
              imageurl: leftImagePath,
              imageHeight: height_50,
              imageWidth: height_50,
              imageFitType: BoxFit.fill,
              radiusAll: 100,
              placeHolder: icon_person,
            ),
            SizedBox(width: width_10),

            // Title & Current Location vertically aligned
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  width: Get.width * .5,
                  child: Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                // SizedBox(height: 2),
                SizedBox(
                  width: Get.width * .5,
                  child: Text(
                    location,
                    style: TextStyle(
                      fontSize: 12,
                    ),
                    maxLines: 2,
                  ),
                ),
              ],
            ),
          ],
        ),

        // Right Side: Notification icon with badge count
        Row(
          children: [
            // InkWell(
            //     onTap: (){
            //       Get.toNamed(AppRoutes.performanceScreen);
            //     },
            //     child: AssetImageWidget(imageUrl: icon_notification,imageHeight: height_40,).marginOnly(right: margin_5)),
            Stack(
              clipBehavior: Clip.none,
              children: [
                InkWell(
                  splashColor: Colors.transparent,
                  onTap: () {
                    Get.toNamed(AppRoutes.notificationScreen);
                  },
                  child: Image.asset(
                    rightImagePath,
                    height: height_40,
                    width: height_40,
                    fit: BoxFit.contain,
                  ),
                ),
                if (notificationCount > 0)
                  Positioned(
                    right: -6,
                    top: -6,
                    child: Container(
                      padding: EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        color: colorAppColor,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 1.5),
                      ),
                      constraints: BoxConstraints(
                        minWidth: 18,
                        minHeight: 18,
                      ),
                      child: Center(
                        child: Text(
                          notificationCount > 99
                              ? '99+'
                              : notificationCount.toString(),
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ],
        )
      ],
    );
  }
}

Widget rowWidget({title, subtitle}) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      TextView(
          text: title,
          textStyle: textStyleBodyMedium()
              .copyWith(color: colorAppColor, fontSize: font_12)),
      TextView(
          text: title,
          textStyle: textStyleBodyMedium()
              .copyWith(color: colorAppColor, fontSize: font_12)),
    ],
  ).marginSymmetric(vertical: margin_4);
}

networkDialog({VoidCallback? onRetry, server}) {
  return Get.dialog(
    Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius_10),
      ),
      child: Padding(
        padding: EdgeInsets.all(margin_15),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off, color: Colors.red, size: 50),
            const SizedBox(height: 10),
            TextView(
              text: server == true ? 'Server Error' : 'Network Error',
              textStyle: textStyleBody1().copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            TextView(
              text: server == true
                  ? 'Please try again later'
                  : 'Please check your internet connection and try again.',
              textStyle: textStyleBody2().copyWith(color: Colors.grey[600]),
              textAlign: TextAlign.center,
            ).marginSymmetric(horizontal: margin_15),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                Get.back(); // close dialog
                if (onRetry != null) onRetry(); // retry logic
              },
              child: const Text("Retry"),
            ),
          ],
        ),
      ),
    ),
    barrierDismissible: false, // Prevent accidental close
  );
}
