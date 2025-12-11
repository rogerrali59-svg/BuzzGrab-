/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/app/modules/home/controller/delivery_detail_controller.dart';
import 'package:alcoholdeliverydriver/app/modules/home/controller/delivery_request_controller.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:alcoholdeliverydriver/app/core/translations/local_keys.dart';
import 'package:alcoholdeliverydriver/app/core/widgets/earning_container_widget.dart';
import 'package:alcoholdeliverydriver/main.dart';
import '../../../../../export.dart';
import '../controller/home_controller.dart';
import '../widget/header_widget.dart';

class DeliveryDetailScreen extends GetView<DeliveryDetailController> {
  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        if (didPop) {
          return;
        }
        bool shouldExit = await onBackPressed(context);
        if (shouldExit) {
          exit(0);
        }
      },
      child: SafeArea(
        child: Scaffold(
          resizeToAvoidBottomInset: false,
          appBar: CustomAppBar(
            isBackIcon: true,
            appBarTitleText: keyDeliveryDetail.tr,
            centerTitle: true,
          ),
          body: _body(),
        ),
      ),
    );
  }

  Widget _body() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          pickupDetail(),
          SizedBox(
            height: height_10,
          ),
          orderDetail(),
          SizedBox(
            height: height_10,
          ),
          invoiceDetail(),
          SizedBox(
            height: height_10,
          ),
          contactDetail(),
          SizedBox(
            height: height_10,
          ),
          buttonWidget(),
          SizedBox(
            height: height_10,
          ),
        ],
      ).marginSymmetric(horizontal: margin_15),
    );
  }

  pickupDetail() {
    return Container(
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: lightBorderColor)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextView(
              text: keyPickupDetail.tr,
              textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w700,
                  color: Colors.black)),
          SizedBox(
            height: height_15,
          ),
          Row(
            children: [
              AssetImageWidget(
                imageUrl: ic_trackingICon,
                imageHeight: height_60,
              ),
              SizedBox(
                width: width_10,
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  columnWidget(
                      title: keyPickup.tr, subTitle: "123 Main St, Downtown"),
                  SizedBox(
                    height: height_10,
                  ),
                  columnWidget(
                      title: keyDeliverys.tr, subTitle: "456 Oak Ave, Apt 5B"),
                ],
              )
            ],
          )
        ],
      ).paddingAll(15),
    );
  }

  orderDetail() {
    return Container(
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: lightBorderColor)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextView(
              text: keyOrderDetails.tr,
              textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w700,
                  color: Colors.black)),
          SizedBox(
            height: height_15,
          ),
          Container(
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: lightBorderColor)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  children: [
                    Row(
                      children: [
                        AssetImageWidget(
                          imageUrl: icon_person,
                          imageHeight: height_18,
                        ),
                        SizedBox(
                          width: width_10,
                        ),
                        TextView(
                            text: "Fresh Water Co.",
                            textStyle: TextStyle(
                                fontSize: font_14,
                                fontWeight: FontWeight.w400,
                                color: Colors.black38)),
                      ],
                    ),
                    SizedBox(
                      height: height_10,
                    ),
                    Row(
                      children: [
                        TextView(
                            text: "Pale ale",
                            textStyle: TextStyle(
                                fontSize: font_14,
                                fontWeight: FontWeight.w400,
                                color: Colors.black)),
                        SizedBox(
                          width: width_60,
                        ),
                        TextView(
                            text: "X1",
                            textStyle: TextStyle(
                                fontSize: font_14,
                                fontWeight: FontWeight.w400,
                                color: Colors.black)),
                      ],
                    ),
                  ],
                ),
                TextView(
                    text: "\$16",
                    textStyle: TextStyle(
                        fontSize: font_14,
                        fontWeight: FontWeight.w600,
                        color: Colors.black)),
              ],
            ).paddingAll(12),
          )
        ],
      ).paddingAll(15),
    );
  }

  invoiceDetail() {
    return Container(
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: lightBorderColor)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextView(
              text: keyInvoice.tr,
              textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w700,
                  color: Colors.black)),
          SizedBox(
            height: height_15,
          ),
          Container(
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: lightBorderColor)),
            child: Column(
              children: [
                rowTextCustom(text: keySubtotal.tr, subtext: "\$16"),
                rowTextCustom(
                    text: keyDeliveryFee.tr,
                    subtext: "\$5",
                    subTextColor: darkGreenColor),
                rowTextCustom(
                    text: keyServiceFee.tr,
                    subtext: "\$6",
                    subTextColor: darkGreenColor),
                rowTextCustom(text: keyTotal.tr, subtext: "\$35"),
              ],
            ),
          )
        ],
      ).paddingAll(15),
    );
  }

  contactDetail() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: lightBorderColor),
      ),
      child: Padding(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextView(
              text: keyContact.tr,
              textStyle: TextStyle(
                fontSize: font_16,
                fontWeight: FontWeight.w700,
                color: Colors.black,
              ),
            ),
            SizedBox(height: height_15),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: lightBorderColor),
              ),
              child: Padding(
                padding: const EdgeInsets.all(15.0),
                child: Row(
                  children: [
                    // Profile Image
                    AssetImageWidget(
                      imageUrl: icon_person,
                      imageHeight: height_40,
                      imageWidth: height_40,
                      imageFitType: BoxFit.fill,
                      radiusAll: 100,
                    ),
                    SizedBox(width: width_10),

                    // Name & Role - takes remaining space
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Ahmed Al-Sabah",
                            style: TextStyle(
                              fontSize: font_16,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          SizedBox(height: 4),
                          Text(
                            keyVendor.tr,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black54,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),

                    // Action Icons (don’t overflow)
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        GestureDetector(
                          onTap: () {},
                          child: AssetImageWidget(
                            imageUrl: ic_message,
                            imageHeight: height_25,
                          ),
                        ),
                        SizedBox(width: width_15),
                        GestureDetector(
                          onTap: () {},
                          child: AssetImageWidget(
                            imageUrl: ic_phone,
                            imageHeight: height_25,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  buttonWidget() {
    return Row(
      children: [
        // Accept Button
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () {
              Get.toNamed(AppRoutes.liveOrderScreen);
            },
            icon: Icon(Icons.check, color: Colors.black, size: height_18),
            label: Text(
              keyAccept.tr,
              style: TextStyle(
                color: Colors.black,
                fontSize: font_14,
                fontWeight: FontWeight.w400,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: colorAppColor,
              minimumSize: const Size(double.infinity, 40),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(50),
              ),
            ),
          ),
        ),
        SizedBox(width: width_12),

        // Reject Button
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () {},
            icon: Icon(Icons.close, color: Colors.black, size: height_18),
            label: Text(
              keyReject.tr,
              style: TextStyle(
                color: Colors.black,
                fontSize: font_14,
                fontWeight: FontWeight.w400,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              minimumSize: const Size(double.infinity, 40),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(50),
              ),
              side: const BorderSide(color: Colors.black12),
            ),
          ),
        ),
      ],
    ).paddingSymmetric(horizontal: width_10);
  }

  columnWidget({title, subTitle}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextView(
            text: title,
            textStyle: TextStyle(
                fontSize: font_14,
                fontWeight: FontWeight.w600,
                color: Colors.black)),
        TextView(
            text: subTitle,
            textStyle: TextStyle(
                fontSize: font_12,
                fontWeight: FontWeight.w400,
                color: Colors.black38)),
      ],
    );
  }
}
