/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and re
 * s
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

// import 'package:flutter_share/flutter_share.dart';
import 'package:share_plus/share_plus.dart';
import '../../../../export.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../controller/about_app_controller.dart';

class AboutAppScreen extends StatelessWidget {
  final controller = Get.put(AboutAppController());

  @override
  Widget build(BuildContext context) {
    return GetBuilder<AboutAppController>(
      builder: (controller) {
        return SafeArea(
          child: Scaffold(
            appBar: CustomAppBar(
              appBarTitleText: "About App",
            ),
            resizeToAvoidBottomInset: false,
            body: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [tileList()],
              ),
            ),
          ),
        );
      },
    );
  }

  tileList() =>
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          _listTileIconView(
              label: "Version",
              description: "${controller.versionNumber}"),
          _listTileIconView(
              label: "Rate App",
              onSeeAllTap: () async {
                await launchUrl(Uri.parse("https://play.google.com/store/apps/details?id=${controller.packageName}"));

              },
              description: "If you like us, Rate us"),
          _listTileIconView(
              label: "Share App",
              onSeeAllTap: () async {
                final String appLink = 'https://play.google.com/store/apps/details?id=${controller.packageName}';
                final String message = 'Check out this app: $appLink';
                await Share.share(message,subject: 'Share App',);
                // await FlutterShare.share(title: 'Share App', linkUrl: appLink, text: message);
              },
              description: "If you like us, let other's know"),
          _listTileIconView(
              label: "More Apps",
              onSeeAllTap: () async {
                await launchUrl(Uri.parse(""));
              },
              description: "Check other apps we have"),

          _listTileIconView(label: "Server URL", description: '${baseUrl}',
              onSeeAllTap: () async {
                // await launchUrl(Uri.parse());
              }
          ),

        ],
      ).marginOnly(top: margin_20);

  Widget _listTileIconView({label, leadingIcon, onSeeAllTap, icon, description}) =>
      InkWell(
        onTap: onSeeAllTap ?? () {},
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    (leadingIcon != null)
                        ? AssetImageWidget(
                      imageUrl: leadingIcon,
                      imageFitType: BoxFit.cover,
                      imageHeight: height_25,
                    ).marginOnly(right: margin_12)
                        : const SizedBox(),
                    (icon != null)
                        ? Icon(
                      icon,
                      color: Colors.yellow,
                      size: height_25,
                    ).marginOnly(right: margin_12)
                        : emptySizeBox(),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextView(
                          text: label,
                          textStyle: textStyleDisplayMedium().copyWith(
                            fontSize: font_15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        TextView(
                          text: description,
                          textStyle: textStyleDisplayMedium().copyWith(
                            fontSize: font_15,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ).paddingSymmetric(vertical: margin_16, horizontal: margin_15),
            const Divider(
              color: Colors.grey,
            ),
          ],
        ),
      );
}
