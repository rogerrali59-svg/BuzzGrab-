/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/app/modules/home/controller/delivery_request_controller.dart';
import 'package:alcoholdeliverydriver/app/modules/home/controller/live_order_controller.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:alcoholdeliverydriver/app/core/translations/local_keys.dart';
import 'package:alcoholdeliverydriver/app/core/widgets/earning_container_widget.dart';
import 'package:alcoholdeliverydriver/main.dart';
import '../../../../../export.dart';
import '../controller/order_screen_controller.dart';

class OrdersScreen extends GetView<OrderScreenController> {
  final controller = Get.put(OrderScreenController());

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
            isBackIcon: false,
            centerTitle: false,
            appBarTitleText: keyMyOrders.tr,
            leadingWidth: width_15,
          ),
          body: _body(),
        ),
      ),
    );
  }

  Widget _body() {
    return Obx(() => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: height_10,
            ),
            tabButtons(),
            SizedBox(height: height_10),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    // Conditionally show order list
                    controller.selectedTab.value == 0
                        ? newOrderList()
                        : completedOrderList(),
                  ],
                ),
              ),
            )
          ],
        ).marginSymmetric(horizontal: margin_15));
  }

  /// 🔹 Tab Buttons
  Widget tabButtons() {
    return Obx(() => Row(
          children: [
            // --- New Orders Button ---
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  controller.selectedTab.value = 0;
                  controller.getOrders(status: '4,8,9,10');
                },
                style: ElevatedButton.styleFrom(
                  elevation: 0,

                  backgroundColor: controller.selectedTab.value == 0
                      ? colorAppColor
                      : Colors.white,
                  minimumSize: const Size(double.infinity, 40),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(50),
                  ),
                ),
                child: Text(
                  keyNewOrders.tr,
                  style: TextStyle(
                    color: controller.selectedTab.value == 0
                        ? Colors.white
                        : Colors.black38,
                    fontWeight: controller.selectedTab.value == 0
                        ? FontWeight.w500
                        : FontWeight.w400,
                    fontSize: font_13,
                  ),
                ),
              ),
            ),

            SizedBox(width: width_8),

            // --- Completed Orders Button ---
            Expanded(
              child: ElevatedButton(

                onPressed: () {
                  controller.selectedTab.value = 1;
                  controller.getOrders(status: '5');
                },
                style: ElevatedButton.styleFrom(
                  elevation: 0,
                  backgroundColor: controller.selectedTab.value == 1
                      ? colorAppColor
                      : Colors.white,
                  minimumSize: const Size(double.infinity, 40),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(50),
                  ),
                ),
                child: Text(
                  keyCompletedOrders.tr,
                  style: TextStyle(
                    color: controller.selectedTab.value == 1
                        ? Colors.white
                        : Colors.black38,
                    fontSize: font_13,
                    fontWeight: controller.selectedTab.value == 1
                        ? FontWeight.w500
                        : FontWeight.w400,
                  ),
                ),
              ),
            ),
          ],
        ));
  }

  /// 🔹 Example: New Orders List
  Widget newOrderList() {
    return Column(
      children: [
        myOrderList(
            // title: "${keyOrders.tr} #1024",
            // pickAddress: "123 Main St, Downtown",
            // itemCount: 5,
            // onTapTrackOrder: () {
            //   Get.toNamed(AppRoutes.liveOrderScreen);
            // },
            // price: "\$12.50",
            // time: "15",
            // deliveryAddress: "456 Oak Ave, Apt 5B",
            // isNewOrder: true,
            // onTapViewDetail: () {
            //   Get.toNamed(AppRoutes.deliveryDetailScreen);
            // },
            ),
      ],
    );
  }

  /// 🔹 Example: Completed Orders List
  Widget completedOrderList() {
    return Column(
      children: [
        myOrderList(
            // title: "Order #1010",
            // pickAddress: "987 Market St, Midtown",
            // itemCount: 3,
            // onTapTrackOrder: () {},
            // price: "\$20.00",
            // time: "25",
            // deliveryAddress: "222 Pine Ave, Apt 2A",
            // isNewOrder: false,
            // onTapViewDetail: () {
            //   Get.toNamed(AppRoutes.deliveryDetailScreen);
            // },
            ),
      ],
    );
  }

  Widget myOrderList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: height_10),
        // --- Order List ---
        controller.myOrders.isEmpty
            ? noDataToShow().marginOnly(top: margin_200)
            : ListView.separated(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: controller.myOrders.length,
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
                              text:
                                  '${controller.myOrders[index].restaurant?.restaurantName}',
                              textStyle: TextStyle(
                                fontSize: font_16,
                                fontWeight: FontWeight.w600,
                                color: Colors.black,
                              ),
                            ),
                            TextView(
                              text:
                                  '${double.parse('${controller.myOrders[index].finalAmount}').toStringAsFixed(2)}',
                              textStyle: TextStyle(
                                fontSize: font_14,
                                fontWeight: FontWeight.w500,
                                color: darkGreenColor,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: height_6),

                        // --- Address ---
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                color: darkGreenColor,
                                borderRadius: BorderRadius.circular(30),
                              ),
                              padding: EdgeInsets.symmetric(
                                horizontal: width_10,
                                vertical: height_2,
                              ),
                              child: TextView(
                                text:
                                    "${getOrderStatus(controller.myOrders[index].status)}",
                                textStyle: TextStyle(
                                  fontSize: font_12,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            TextView(
                              text: "${15} min ago",
                              textStyle: TextStyle(
                                fontSize: font_14,
                                fontWeight: FontWeight.w400,
                                color: Colors.black38,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: height_30),

                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            AssetImageWidget(
                              imageUrl: ic_trackingICon,
                              imageHeight: height_60,
                            ),
                            SizedBox(
                              width: width_10,
                            ),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  columnWidget(
                                      title: keyPickup.tr,
                                      subTitle:
                                          '${controller.myOrders[index].restaurant?.address ?? ""}'),
                                  SizedBox(
                                    height: height_10,
                                  ),
                                  columnWidget(
                                      title: keyDeliverys.tr,
                                      subTitle:
                                          '${controller.myOrders[index].deliveryAddress?.address ?? ""}'),
                                ],
                              ),
                            )
                          ],
                        ).paddingOnly(left: width_20),
                        SizedBox(height: height_30),
                        GestureDetector(
                          onTap: () {
                            Get.delete<LiveOrderController>();
                            Get.toNamed(AppRoutes.liveOrderScreen, arguments: {
                              'orderId': controller.myOrders[index].id,
                              'completed': controller.selectedTab.value == 0
                                  ? false
                                  : true,
                            })?.then((e) {
                              if (controller.selectedTab.value == 0) {
                                controller.getOrders(status: '4,8,9,10');
                              } else {
                                controller.getOrders(status: '5');
                              }
                            });
                          },
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
                        ),
                        SizedBox(
                          height: height_10,
                        ),
                      ],
                    ),
                  );
                },
              ),
      ],
    );
  }
}
