/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/app/modules/home/controller/live_order_controller.dart';
import 'package:alcoholdeliverydriver/app/modules/home/controller/main_controller.dart';
import 'package:alcoholdeliverydriver/app/core/translations/local_keys.dart';
import 'package:alcoholdeliverydriver/app/modules/order/controller/order_screen_controller.dart';
import 'package:alcoholdeliverydriver/main.dart';
import '../../../../../export.dart';
import '../controller/home_controller.dart';
import '../widget/header_widget.dart';

class HomeScreen extends GetView<HomeController> {
  final controller = Get.put(HomeController());

  @override
  Widget build(BuildContext context) {
    lightChromeUI();
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
          SizedBox(
            height: height_10,
          ),
          CustomHeaderWidget(
            leftImagePath: '${signUpData.value.profileImg ?? ''}' ?? "",
            title: '${keyHi.tr} ${signUpData.value.fullName}!',
            location: keyReadyTo.tr,
            rightImagePath: icon_notification,
            notificationCount: 0,
          ),
          SizedBox(
            height: height_20,
          ),
          upperBlock(),
          SizedBox(
            height: height_20,
          ),
          gridViewBlock(),
          SizedBox(
            height: height_20,
          ),
          newOrderTitle(),
        ],
      ).marginSymmetric(horizontal: margin_15),
    );
  }

  upperBlock() {
    return Container(
      decoration: BoxDecoration(
          color: colorAppColor.withOpacity(.1),
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: colorAppColor.withOpacity(.3))),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(child: custumContainer(title: keyDeliveries.tr, subtitle: "0")),
          Container(
            height:
                55, //You can adjust this to match the height of your containers
            width: 1, // The width of the vertical line
            color: colorAppColor.withOpacity(.3), // Color of the line
          ),
          Expanded(child: custumContainer(title: keyEarnings.tr, subtitle: "\$0.00")),
          Container(
            height:
                55, // You can adjust this to match the height of your containers
            width: 1, // The width of the vertical line
            color: colorAppColor.withOpacity(.3), // Color of the line
          ),
          Expanded(
            child: custumContainer(
                title: keyRating.tr, subImage: ic_star, subtitle: "4.8"),
          ),
        ],
      ).paddingSymmetric(vertical: height_15),
    );
  }

  gridViewBlock() {
    return GridView.count(
      shrinkWrap: true,
      // So it doesn’t take infinite height
      crossAxisCount: 2,
      // Number of columns
      crossAxisSpacing: 14,
      // Horizontal spacing between items
      mainAxisSpacing: 15,
      // Vertical spacing between items
      childAspectRatio: 1.4,
      // Adjust for shape (width / height)
      physics: NeverScrollableScrollPhysics(),
      // Disable scrolling if inside another scroll view
      children: [
        GestureDetector(
          onTap: () {
            Get.toNamed(AppRoutes.deliveryRequestScreen)?.then((e) {
              controller.getNewOrder();
            });
          },
          child: Container(
            decoration: BoxDecoration(
                border: Border.all(color: Colors.black12),
                borderRadius: BorderRadius.circular(20)),
            child: custumContainer(
                isImage: true,
                image: ic_home_delivery,
                subtitle: keyDeliveryRequests.tr),
          ),
        ),
        GestureDetector(
          onTap: () {
            Get.find<MainController>().bottomNavIndex.value = 1;
          },
          child: Container(
            decoration: BoxDecoration(
                border: Border.all(color: Colors.black12),
                borderRadius: BorderRadius.circular(20)),
            child: custumContainer(
                isImage: true, image: ic_home_order, subtitle: keyMyOrders.tr),
          ),
        ),
        GestureDetector(
          onTap: () {
            Get.find<MainController>().bottomNavIndex.value = 2;
          },
          child: Container(
            decoration: BoxDecoration(
                border: Border.all(color: Colors.black12),
                borderRadius: BorderRadius.circular(20)),
            child: custumContainer(
                isImage: true,
                image: ic_home_earning,
                subtitle: keyMyEarnings.tr),
          ),
        ),
        GestureDetector(
          onTap: () {
            Get.toNamed(AppRoutes.ratingScreen);
          },
          child: Container(
            decoration: BoxDecoration(
                border: Border.all(color: Colors.black12),
                borderRadius: BorderRadius.circular(20)),
            child: custumContainer(
                isImage: true,
                image: ic_home_rating,
                subtitle: keyRatingReviews.tr),
          ),
        ),
      ],
    );
  }

  newOrderTitle() {
    return Column(
      children: [
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            TextView(
              text: keyNewOrders.tr,
              textStyle: TextStyle(
                fontSize: font_16,
                fontWeight: FontWeight.w600,
                color: Colors.black,
              ),
            ),
            GestureDetector(
              onTap: () {
                Get.toNamed(AppRoutes.deliveryRequestScreen);
              },
              child: TextView(
                text: keySeeAll.tr,
                textStyle: TextStyle(
                  fontSize: font_14,
                  fontWeight: FontWeight.w500,
                  color: colorAppColor,
                ),
              ),
            ),
          ],
        ),
        orderListWidget()
      ],
    );
  }

  Widget custumContainer({title, subtitle, isImage = false, image, subImage}) {
    return Container(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          isImage
              ? AssetImageWidget(
                  imageUrl: image,
                  imageHeight: height_40,
                )
              : TextView(
                  text: title,
                  textStyle: TextStyle(
                      fontSize: font_14,
                      fontWeight: FontWeight.w400,
                      color: Colors.black)),
          SizedBox(
            height: height_8,
          ),
          subImage != null
              ? Row(    crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    AssetImageWidget(
                      imageUrl: subImage,
                      imageHeight: height_16,
                      imageWidth: height_16,
                    ).marginOnly(right: margin_5),
                    TextView(
                        text: subtitle,
                        textStyle: TextStyle(
                            fontWeight: FontWeight.w500, color: Colors.black))
                  ],
                )
              : TextView(
                  text: subtitle,
                  textStyle: TextStyle(
                      fontWeight: FontWeight.w500, color: Colors.black)),
        ],
      ),
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
            ? noDataToShow().paddingSymmetric(vertical: margin_60)
            : ListView.separated(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: controller.newOrders.length >= 2
                    ? 2
                    : controller.newOrders.length,
                separatorBuilder: (context, index) =>
                    SizedBox(height: height_15),
                itemBuilder: (context, index) {
                  // final distance=controller.getDistanceTime(pickupLat: currentPosition?.value.latitude, pickupLng: pickupLng, dropLat: dropLat, dropLng: dropLng)
                  return GestureDetector(
                    onTap: () {
                      Get.toNamed(AppRoutes.liveOrderScreen, arguments: {
                        'orderId': controller.newOrders[index].id,
                      });
                    },
                    child: Container(
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
                            text: controller
                                    .newOrders[index].restaurant?.address ??
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
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
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
                                  icon: Icons.watch_later_outlined,
                                  text: 'time'),
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
                                        orderId:
                                            controller.newOrders[index].id);
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
                                    minimumSize:
                                        const Size(double.infinity, 40),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(50),
                                    ),
                                  ),
                                ),
                              ),
                              // SizedBox(width: width_12),

                              // Reject Button
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
                    ),
                  );
                },
              )),
      ],
    );
  }
}
