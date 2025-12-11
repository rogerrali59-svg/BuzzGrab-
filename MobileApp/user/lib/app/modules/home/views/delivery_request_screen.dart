/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/home/controller/delivery_request_controller.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:buzzgrab/app/core/translations/local_keys.dart';
import 'package:buzzgrab/app/core/widgets/earning_container_widget.dart';
import 'package:buzzgrab/main.dart';
import '../../../../../export.dart';
import '../controller/home_controller.dart';
import '../widget/header_widget.dart';

class DeliveryRequestScreen extends GetView<DeliveryRequestController> {
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () {
        Get.back(result: true);
        return Future.value(true);
      },
      child: SafeArea(
        child: Scaffold(
          resizeToAvoidBottomInset: false,
          appBar: CustomAppBar(
            isBackIcon: true,
            appBarTitleText: keyDeliveryRequests.tr,
            leadingWidth: width_55,
            actionWidget: [
              Obx(() => controller.newOrders.length == 0
                  ? emptySizeBox()
                  : Container(
                      decoration: BoxDecoration(
                          color: Colors.red, shape: BoxShape.circle),
                      child: TextView(
                              text: "${controller.newOrders.length}",
                              textStyle: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: font_16,
                                  color: Colors.white))
                          .paddingAll(7),
                    ).paddingOnly(right: width_15))
            ],
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
        children: [orderListWidget()],
      ).marginSymmetric(horizontal: margin_15).marginOnly(bottom: margin_20),
    );
  }

  Widget orderListWidget({
    isDeliveryAddress = false,
    VoidCallback? onTapAccept,
    VoidCallback? onTapReject,
    VoidCallback? onTapViewDetail,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: height_10),
        // --- Order List ---
        Obx(() => controller.newOrders.isEmpty
            ? noDataToShow().marginOnly(top: margin_200)
            : ListView.separated(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: controller.newOrders.length,
                separatorBuilder: (context, index) =>
                    SizedBox(height: height_15),
                itemBuilder: (context, index) {
                  return Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.black12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12.withOpacity(0.05),
                          spreadRadius: 1,
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // --- Title Row ---
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            TextView(
                              text: controller.newOrders[index].restaurant
                                      ?.restaurantName ??
                                  '',
                              textStyle: TextStyle(
                                fontSize: font_16,
                                fontWeight: FontWeight.w600,
                                color: Colors.black,
                              ),
                            ),
                            Container(
                              decoration: BoxDecoration(
                                color: green,
                                borderRadius: BorderRadius.circular(30),
                              ),
                              padding: EdgeInsets.symmetric(
                                horizontal: width_10,
                                vertical: height_4,
                              ),
                              child: TextView(
                                text:
                                    '${controller.newOrders[index].finalAmount}',
                                textStyle: TextStyle(
                                  fontSize: font_14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: height_6),

                        // --- Address ---
                        TextView(
                          text:
                              controller.newOrders[index].restaurant?.address ??
                                  "",
                          textAlign: TextAlign.start,
                          textStyle: TextStyle(
                            fontSize: font_14,
                            fontWeight: FontWeight.w400,
                            color: Colors.black54,
                          ),
                        ),
                        SizedBox(height: height_10),

                        // ---- address----
                        isDeliveryAddress
                            ? Container(
                                decoration: BoxDecoration(
                                  color: lightFieldColor,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    AssetImageWidget(
                                      imageUrl: locationIcon,
                                      imageHeight: height_20,
                                      color: colorAppColor,
                                    ),
                                    SizedBox(
                                      width: width_8,
                                    ),
                                    Column(
                                      children: [
                                        TextView(
                                          text: keyDeliveryAddress.tr,
                                          textAlign: TextAlign.start,
                                          textStyle: TextStyle(
                                            fontSize: font_14,
                                            fontWeight: FontWeight.w400,
                                            color: Colors.black38,
                                          ),
                                        ),
                                        SizedBox(
                                          height: height_5,
                                        ),
                                        TextView(
                                          text: 'address',
                                          textAlign: TextAlign.start,
                                          textStyle: TextStyle(
                                            fontSize: font_14,
                                            fontWeight: FontWeight.w400,
                                            color: Colors.black,
                                          ),
                                        ),
                                        SizedBox(
                                          height: height_20,
                                        )
                                      ],
                                    )
                                  ],
                                ).paddingAll(10),
                              )
                            : Container(),

                        // --- Info Row ---
                        Row(
                          children: [
                            rowCustom(
                                icon: Icons.watch_later_outlined, text: 'time'),
                            SizedBox(width: width_15),
                            rowCustom(
                                isImage: true,
                                image: ic_share,
                                text: 'distance'),
                          ],
                        ),
                        SizedBox(height: height_20),

                        // --- Action Buttons ---
                        Row(
                          children: [
                            // Accept Button
                            Expanded(
                              flex: 3,
                              child: ElevatedButton.icon(
                                onPressed: () {
                                  controller.changeOrderStatus(
                                      choice: ACCEPT_ORDER,
                                      orderId: controller.newOrders[index].id);
                                },
                                icon: Icon(Icons.check,
                                    color: Colors.black, size: height_18),
                                label: Text(
                                  keyAccept.tr,
                                  style: TextStyle(
                                    color: Colors.black,
                                    fontSize: font_13,
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
                            // SizedBox(width: width_12),
                            //
                            // // Reject Button
                            // Expanded(
                            //   flex: 2,
                            //   child: ElevatedButton.icon(
                            //     onPressed: () {
                            //       controller.newOrders.removeWhere((e) =>
                            //           e.id == controller.newOrders[index].id);
                            //     },
                            //     icon: Icon(Icons.close,
                            //         color: Colors.black, size: height_18),
                            //     label: Text(
                            //       keyReject.tr,
                            //       style: TextStyle(
                            //         color: Colors.black,
                            //         fontSize: font_13,
                            //         fontWeight: FontWeight.w400,
                            //       ),
                            //     ),
                            //     style: ElevatedButton.styleFrom(
                            //       backgroundColor: Colors.white,
                            //       minimumSize: const Size(double.infinity, 40),
                            //       shape: RoundedRectangleBorder(
                            //         borderRadius: BorderRadius.circular(50),
                            //       ),
                            //       side: const BorderSide(color: Colors.black12),
                            //     ),
                            //   ),
                            // ),
                          ],
                        ),
                        if (isDeliveryAddress)
                          SizedBox(
                            height: height_20,
                          ),
                        isDeliveryAddress
                            ? GestureDetector(
                                onTap: onTapViewDetail,
                                child: Row(
                                  children: [
                                    Text(
                                      keyViewDetails.tr,
                                      style: TextStyle(
                                        color: darkGreenColor,
                                        fontSize: font_14,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    SizedBox(
                                      width: width_8,
                                    ),
                                    Icon(
                                      Icons.arrow_right_alt,
                                      color: darkGreenColor,
                                    )
                                  ],
                                ),
                              )
                            : Container(),
                        if (isDeliveryAddress)
                          SizedBox(
                            height: height_10,
                          ),
                      ],
                    ),
                  );
                },
              )),
      ],
    );
  }
}
