/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and re
 * s
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:share_plus/share_plus.dart';

import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';

class AboutUsScreen extends GetView<AboutUsController> {


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: height_40,
            ),
            Row(
              children: [
                GestureDetector(
                  onTap: () {
                    Get.back();
                  },
                  child: Icon(
                    Icons.arrow_back,
                    color: Colors.black,
                  ),
                ),
                TextView(
                  text: keyAboutUs.tr,
                  textStyle: textStyleBody1().copyWith(
                    fontSize: font_21,
                    fontFamily: "Nunito",
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ).paddingOnly(left: margin_80),
              ],
            ),
            tileList()
          ],
        ).paddingOnly(left: margin_10, right: margin_10),
      ),
    );
  }

  tileList() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Obx(
            () => _listTileIconView(label: "Version", description: "${controller.versionNumber}"),
          ),
          _listTileIconView(
              label: "Rate App",
              onSeeAllTap: () async {
                toast("Under Development");

              },
              description: "If you like us, Rate us"),

          _listTileIconView(
            label: "Share App",
            onSeeAllTap: () async {
              final String appLink = 'https://play.google.com/store/apps/details?id=${controller.packageName}';
              final String message = 'Check out this app: $appLink';

              await Share.share(message, subject: 'Share App');
            },
            description: "If you like us, let others know",
          ),

          _listTileIconView(
              label: "More Apps",
              onSeeAllTap: () async {

              },
              description: "Check other apps we have"),
          _listTileIconView(
            label: "Copyrights",
            description: "Ozvid Technologies Private Limited",
          ),
          _listTileIconView(
            label: "Server URL",
            description: baseUrl,
          ),
          _listTileIconView(
            label: "Logger",
            onSeeAllTap: () {
              try {
                throw Exception('Intentional crash triggered');
              } catch (e, str) {
                reportCrash(
                  error: e,
                  stackTrace: str,
                );
              }
            },
            description: 'Click here to generate crash',
          ),
        ],
      ).marginOnly(top: margin_20);

  Widget _listTileIconView({label, leadingIcon, onSeeAllTap, icon, description}) => InkWell(
        onTap: onSeeAllTap ?? () {},
        child: Column(
          children: [
            Row(
              children: [
                (leadingIcon != null)
                    ? AssetImageWidget(
                        imageUrl: leadingIcon,
                        imageFitType: BoxFit.cover,
                        imageHeight: height_25,
                      ).marginOnly(right: margin_12)
                    : SizedBox(),
                (icon != null)
                    ? Icon(
                        icon,
                        color: Colors.yellow,
                        size: height_25,
                      ).marginOnly(right: margin_12)
                    : emptySizeBox(),
                SizedBox(
                  width: width_300,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextView(
                        text: label ?? "",
                        textStyle: textStyleDisplayMedium().copyWith(
                          fontSize: font_15,
                          fontWeight: FontWeight.w500,
                          color: Colors.black,
                          fontFamily: "Nunito",
                        ),
                      ),
                      TextView(
                        text: description.toString() ?? "",
                        textAlign: TextAlign.start,
                        maxLine: 2,
                        textStyle: textStyleDisplayMedium().copyWith(
                          fontSize: font_15,
                          fontWeight: FontWeight.w400,
                          color: Colors.black,
                          fontFamily: "Nunito",
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Divider(
              color: Colors.grey,
            ).paddingOnly(top: margin_10),
          ],
        ).paddingOnly(top: margin_10, bottom: margin_5),
      );
}
