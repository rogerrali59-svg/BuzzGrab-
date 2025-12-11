/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/home/controller/delivery_detail_controller.dart';
import 'package:buzzgrab/app/modules/home/controller/delivery_request_controller.dart';
import 'package:buzzgrab/app/modules/home/controller/live_order_controller.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:buzzgrab/app/core/translations/local_keys.dart';
import 'package:buzzgrab/app/core/widgets/earning_container_widget.dart';
import 'package:buzzgrab/main.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import '../../../../../export.dart';
import '../../../core/widgets/custom_flashbar.dart';
import '../controller/home_controller.dart';
import '../widget/header_widget.dart';

class LiveOrderScreen extends GetView<LiveOrderController> {
  final controller = Get.put(LiveOrderController());
  final List<Map<String, dynamic>> steps = [
    {"icon": Icons.access_time, "title": keyReachedRestaurant.tr},
    {"icon": Icons.check, "title": keyPickup.tr},
    {"icon": Icons.location_on_outlined, "title": keyAtDoor.tr},
    {"icon": Icons.done_all, "title": keyDelivered.tr},
  ];

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () {
        Get.back(result: true);
        return Future.value(true);
      },
      child: SafeArea(
        child: Obx(
          () => Scaffold(
            resizeToAvoidBottomInset: false,
            appBar: CustomAppBar(
              isBackIcon: true,
              appBarTitleText:
                  "${keyOrders.tr} #${controller.orderDetailsModel.value.data?.orderId ?? ''}",
              centerTitle: true,
            ),
            body: _body(context),
          ),
        ),
      ),
    );
  }

  Widget _body(context) {
    return Obx(
      () => controller.orderDetailsModel.value.data == null
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  orderStatus(context),
                  SizedBox(height: height_10),
                  pickupDetail(),
                  SizedBox(height: height_10),
                  orderDetail(),
                  SizedBox(height: height_10),
                  invoiceDetail(),
                  SizedBox(height: height_15),
                  controller.orderDetailsModel.value.data?.status ==
                          ORDER_COMPLETED
                      ? emptySizeBox()
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            headerText(title: 'Path'),
                            GestureDetector(
                              onTap: () {
                                if (controller
                                            .orderDetailsModel.value.data?.status ==
                                        ORDER_OUT_FOR_DELIVERY ||
                                    controller.orderDetailsModel.value.data
                                            ?.status ==
                                        10 ||
                                    controller.orderDetailsModel.value.data
                                            ?.status ==
                                        4) {
                                  controller.openGoogleMapNavigation(
                                    double.parse(
                                      '${controller.orderDetailsModel.value.data?.deliveryAddress?.latitude ?? 0.0}',
                                    ),
                                    double.parse(
                                      '${controller.orderDetailsModel.value.data?.deliveryAddress?.longitude ?? 0.0}',
                                    ),
                                  );
                                } else {
                                  controller.openGoogleMapNavigation(
                                    double.parse(
                                      '${controller.orderDetailsModel.value.data?.restaurant?.latitude ?? 0.0}',
                                    ),
                                    double.parse(
                                      '${controller.orderDetailsModel.value.data?.restaurant?.longitude ?? 0.0}',
                                    ),
                                  );
                                }
                              },
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.location_pin,
                                    color: colorAppColor,
                                  ),
                                  TextView(
                                    text: 'Go to Map',
                                    textStyle: textStyleBodyMedium(),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                  controller.orderDetailsModel.value.data?.status ==
                          ORDER_COMPLETED
                      ? emptySizeBox()
                      : SizedBox(height: height_8),

                  controller.orderDetailsModel.value.data?.status ==
                          ORDER_COMPLETED
                      ? emptySizeBox()
                      : ClipRRect(
                          borderRadius: BorderRadius.all(
                            Radius.circular(radius_8),
                          ),
                          child: SizedBox(
                            height: height_200,
                            child: Obx(
                              () => GoogleMap(
                                myLocationEnabled: true,
                                zoomControlsEnabled: true,
                                zoomGesturesEnabled: true,
                                mapType: MapType.normal,
                                gestureRecognizers: <Factory<
                                    OneSequenceGestureRecognizer>>{
                                  Factory<OneSequenceGestureRecognizer>(
                                    () => EagerGestureRecognizer(),
                                  ),
                                },
                                markers: controller.markers,
                                initialCameraPosition: CameraPosition(
                                  target: LatLng(
                                    currentPosition.value!.latitude ?? 37.7749,
                                    currentPosition.value!.longitude ??
                                        -122.4194,
                                  ),
                                  zoom: 12,
                                ),
                                onCameraMove: (position) {
                                  print(
                                    "Camera moving to: ${position.target.latitude}, ${position.target.longitude}",
                                  );
                                },
                                polylines: Set<Polyline>.of(
                                  controller.polylines,
                                ),
                                onMapCreated: (
                                  GoogleMapController mapController,
                                ) {
                                  controller.mapController.value =
                                      mapController;
                                },
                              ),
                            ),
                          ),
                        ),
                  SizedBox(height: height_10),
                  // Obx(
                  //   () => controller.currentStep.value == 1
                  //       ? buttonWidget(
                  //           buttonText: keyMarkAsPickedUp.tr,
                  //           onTap: () {
                  //             controller.nextStep();
                  //           })
                  //       : Container(),
                  // ),
                  Obx(
                    () => controller.currentStep.value == 1
                        ? SizedBox(height: height_20)
                        : Container(),
                  ),
                  contactDetail(),
                  SizedBox(height: height_10),

                  // Obx(()=>   controller.currentStep.value == 0 || controller.currentStep.value>1? buttonWidget(
                  //     buttonText:  controller.currentStep.value == 0 ? "Mark as Reached Restaurant" :  controller.currentStep.value == 2 ? "Mark as At Doorstep" : "Mark as Complete Delivery" ,
                  //     onTap: () {
                  //       print("jkjkasdkjasjk ${controller.currentStep.value}");
                  //       controller.nextStep();
                  //     } ): Container(),),
                  Obx(
                    () => controller.orderDetailsModel.value.data?.status ==
                                ORDER_COMPLETED ||
                            controller.orderDetailsModel.value.data?.status ==
                                ORDER_READY_FOR_PICKUP
                        ? emptySizeBox()
                        : controller.currentStep.value == 0 ||
                                controller.currentStep.value > 1
                            ? buttonWidget(
                                buttonText: controller.currentStep.value == 0
                                    ? keyMarkAsReachedRestaurant.tr
                                    : controller.currentStep.value == 2
                                        ? keyMarkAsAtDoorstep.tr
                                        : keyMarkAsCompleteDelivery.tr,
                                onTap: () {
                                  print(
                                    "Current step: ${controller.currentStep.value}",
                                  );

                                  if (controller.currentStep.value == 3) {
                                    // Open OTP bottom sheet
                                    Get.bottomSheet(
                                      OTPBottomSheet(
                                        onSubmit: (otp) {
                                          if (otp.length == 4) {
                                            print("OTP entered: $otp");

                                            controller.otpController.text = otp;
                                            controller.markCompleteOrder();
                                          } else {
                                            toast("Please enter a 4-digit OTP");
                                          }
                                        },
                                      ),
                                      isScrollControlled: true,
                                      backgroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.vertical(
                                          top: Radius.circular(24),
                                        ),
                                      ),
                                    );
                                  } else {
                                    controller.nextStep();
                                  }
                                },
                              )
                            : Container(),
                  ),

                  SizedBox(height: height_10),
                ],
              ).marginSymmetric(horizontal: margin_15),
            ),
    );
  }

  orderStatus(context) {
    final width = MediaQuery.of(context).size.width;
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: lightBorderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title
              Text(
                keyOrderStatus.tr,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.black,
                ),
              ),
              SizedBox(height: 16),

              // Steps Row
              Obx(
                () => Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: List.generate(steps.length, (index) {
                    final isCompleted =
                        index + 1 <= controller.currentStep.value;
                    return Column(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            color: isCompleted ? Colors.amber : Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color:
                                  isCompleted ? Colors.amber : Colors.black12,
                            ),
                          ),
                          padding: EdgeInsets.all(10),
                          child: Icon(
                            steps[index]["icon"],
                            color: isCompleted ? Colors.black : Colors.black45,
                            size: 24,
                          ),
                        ),
                        SizedBox(height: 6),
                        Text(
                          steps[index]["title"],
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight:
                                isCompleted ? FontWeight.w600 : FontWeight.w400,
                            color: isCompleted
                                ? Colors.black
                                : Colors.grey.shade600,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    );
                  }),
                ),
              ),
              SizedBox(height: 12),

              // Step Progress Bar
              Obx(
                () => Stack(
                  alignment: Alignment.centerLeft,
                  children: [
                    // Base line (grey)
                    Container(
                      width: width - 64,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade300,
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    // Progress line (yellow)
                    AnimatedContainer(
                      duration: Duration(milliseconds: 400),
                      width: ((width - 64) / (steps.length + 0.10)) *
                          controller.currentStep.value,
                      height: 4,
                      decoration: BoxDecoration(
                        color: Colors.amber,
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    // Step dots
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: List.generate(
                        steps.length,
                        (index) => Container(
                          width: 10,
                          height: 10,
                          decoration: BoxDecoration(
                            color: index + 1 <= controller.currentStep.value
                                ? Colors.amber
                                : Colors.grey.shade400,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ).paddingAll(15),
    );
  }

  pickupDetail() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: lightBorderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextView(
            text: keyPickupDetail.tr,
            textStyle: TextStyle(
              fontSize: font_18,
              fontWeight: FontWeight.w700,
              color: Colors.black,
            ),
          ),
          SizedBox(height: height_15),
          Row(
            children: [
              AssetImageWidget(
                imageUrl: ic_trackingICon,
                imageHeight: height_60,
              ),
              SizedBox(width: width_10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    columnWidget(
                      title: keyPickup.tr,
                      subTitle:
                          "${controller.orderDetailsModel.value.data?.restaurant?.address ?? ''}",
                    ),
                    SizedBox(height: height_10),
                    columnWidget(
                      title: keyDeliverys.tr,
                      subTitle:
                          "${controller.orderDetailsModel.value.data?.deliveryAddress?.address ?? ''}",
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ).paddingAll(15),
    );
  }

  orderDetail() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: lightBorderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextView(
            text: keyOrderDetails.tr,
            textStyle: TextStyle(
              fontSize: font_18,
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
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        NetworkImageWidget(
                          imageurl: controller.orderDetailsModel.value.data
                                  ?.restaurant?.image ??
                              '',
                          imageHeight: height_18,
                          imageWidth: height_18,
                        ),
                        SizedBox(width: width_10),
                        TextView(
                          text:
                              "${controller.orderDetailsModel.value.data?.restaurant?.restaurantName ?? ''}",
                          textStyle: TextStyle(
                            fontSize: font_14,
                            fontWeight: FontWeight.w400,
                            color: Colors.black38,
                          ),
                        ),
                      ],
                    ),
                    TextView(
                      text:
                          "\$${controller.orderDetailsModel.value.data?.finalAmount ?? ''}",
                      textStyle: TextStyle(
                        fontSize: font_14,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: height_10),
                controller.orderDetailsModel.value.data?.cartItems != null &&
                        controller.orderDetailsModel.value.data?.cartItems
                                ?.length !=
                            0
                    ? ListView.builder(
                        itemCount: controller
                            .orderDetailsModel.value.data?.cartItems?.length,
                        physics: NeverScrollableScrollPhysics(),
                        shrinkWrap: true,
                        itemBuilder: ((context, index) {
                          return Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              TextView(
                                text:
                                    "${controller.orderDetailsModel.value.data?.cartItems?[index].product?.name ?? ''}",
                                textStyle: TextStyle(
                                  fontSize: font_14,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black,
                                ),
                              ),
                              TextView(
                                text:
                                    "X${controller.orderDetailsModel.value.data?.cartItems?[index].quantity ?? ''}",
                                textStyle: TextStyle(
                                  fontSize: font_14,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          );
                        }),
                      )
                    : emptySizeBox(),
              ],
            ).paddingAll(12),
          ),
        ],
      ).paddingAll(15),
    );
  }

  invoiceDetail() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: lightBorderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextView(
            text: keyInvoice.tr,
            textStyle: TextStyle(
              fontSize: font_18,
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
            child: Column(
              children: [
                rowTextCustom(
                  text: keySubtotal.tr,
                  subtext:
                      "\$${controller.orderDetailsModel.value.data?.flatAmount}",
                ),
                rowTextCustom(
                  text: 'Discount Amount' ?? keyDeliveryFee.tr,
                  subtext:
                      "\$${double.parse('${controller.orderDetailsModel.value.data?.discountAmount ?? 0.0}').toStringAsFixed(2)}",
                  subTextColor: darkGreenColor,
                ),
                rowTextCustom(
                  text: keyServiceFee.tr,
                  subtext:
                      "\$${controller.orderDetailsModel.value.data?.platformFee}",
                  subTextColor: darkGreenColor,
                ),
                rowTextCustom(
                  text: keyTotal.tr,
                  subtext:
                      "\$${controller.orderDetailsModel.value.data?.finalAmount}",
                ),
              ],
            ),
          ),
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
        padding: EdgeInsets.all(15.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextView(
              text: keyContact.tr,
              textStyle: TextStyle(
                fontSize: font_18,
                fontWeight: FontWeight.w700,
                color: Colors.black,
              ),
            ),
            SizedBox(height: height_15),
            contactWidget(
              name:
                  '${controller.orderDetailsModel.value.data?.restaurant?.restaurantName ?? ''}',
              image:
                  '${controller.orderDetailsModel.value.data?.restaurant?.image}',
              role: keyVendor.tr,
              phone: '',
            ),
            SizedBox(height: height_10),
            controller.orderDetailsModel.value.data?.status ==
                    ORDER_READY_FOR_PICKUP
                ? emptySizeBox()
                : contactWidget(
                    name:
                        '${controller.orderDetailsModel.value.data?.createdBy?.fullName ?? ''}',
                    image:
                        '${controller.orderDetailsModel.value.data?.createdBy?.image ?? ''}',
                    role: "Customer",
                    phone:
                        '${controller.orderDetailsModel.value.data?.createdBy?.countryCode ?? ''} ${controller.orderDetailsModel.value.data?.createdBy?.mobileNo ?? ''}',
                  ),
          ],
        ),
      ),
    );
  }

  contactWidget({name, image, role, phone}) {
    var img;
    if (!image.toString().contains('http')) {
      img = baseUrl + image;
    }
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: lightBorderColor),
      ),
      child: Padding(
        padding: EdgeInsets.all(15.0),
        child: Row(
          children: [
            // Profile Image
            NetworkImageWidget(
              imageurl: img,
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
                    "${name}",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4),
                  Text(
                    '$role',
                    style: TextStyle(fontSize: 14, color: Colors.black54),
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
                  onTap: () {
                    toast('Under Development');
                    // Get.toNamed(AppRoutes.chatScreen, arguments: {
                    //   'receiverId': role == keyVendor.tr
                    //       ? controller.orderDetailsModel.value.data?.restaurant
                    //           ?.restaurantId
                    //       : controller
                    //           .orderDetailsModel.value.data?.createdBy?.id,
                    //   'receiverName': role == keyVendor.tr
                    //       ? controller.orderDetailsModel.value.data?.restaurant
                    //           ?.restaurantId
                    //       : controller.orderDetailsModel.value.data?.createdBy
                    //               ?.fullName ??
                    //           '',
                    // });
                  },
                  child: AssetImageWidget(
                    imageUrl: ic_message,
                    imageHeight: height_20,
                  ),
                ),
                SizedBox(width: width_10),
                GestureDetector(
                  onTap: () {
                    launchCaller("$phone");
                  },
                  child: AssetImageWidget(
                    imageUrl: ic_phone,
                    imageHeight: height_20,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  buttonWidget({onTap, buttonText}) {
    return ElevatedButton.icon(
      onPressed: onTap,
      label: Text(
        buttonText,
        style: TextStyle(
          color: Colors.black,
          fontSize: font_14,
          fontWeight: FontWeight.w600,
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: colorAppColor,
        minimumSize: Size(double.infinity, 50),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(50)),
      ),
    );
  }
}

class OTPBottomSheet extends StatefulWidget {
  final Function(String) onSubmit;

  const OTPBottomSheet({Key? key, required this.onSubmit}) : super(key: key);

  @override
  _OTPBottomSheetState createState() => _OTPBottomSheetState();
}

class _OTPBottomSheetState extends State<OTPBottomSheet> {
  final TextEditingController otpController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(height: height_15),
          TextView(
            text: keyEnterOTPtoMarkDelivery.tr,
            textStyle: TextStyle(
              fontWeight: FontWeight.w500,
              fontSize: font_15,
              color: Colors.black,
            ),
          ),
          SizedBox(height: height_5),
          TextView(
            text: keyNotePleaseAskTheCustomer.tr,
            textStyle: TextStyle(
              fontWeight: FontWeight.w400,
              fontSize: font_12,
              color: Colors.black38,
            ),
          ),
          SizedBox(height: height_30),

          /// OTP INPUT FIELD (only digits allowed)
          PinCodeTextField(
            appContext: context,
            controller: otpController,
            length: 4,
            keyboardType: TextInputType.number,
            animationType: AnimationType.fade,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly, // ✅ Only numbers allowed
            ],
            pinTheme: PinTheme(
              shape: PinCodeFieldShape.box,
              borderRadius: BorderRadius.circular(8),
              fieldHeight: 55,
              fieldWidth: 55,
              activeColor: colorAppColor,
              selectedColor: colorAppColor,
              inactiveColor: Colors.grey.shade400,
            ),
            onChanged: (value) {},
          ).paddingSymmetric(horizontal: height_30),

          SizedBox(height: 20),

          /// SUBMIT BUTTON
          ElevatedButton.icon(
            onPressed: () {
              final otp = otpController.text.trim();
              if (otp.length == 4) {
                widget.onSubmit(otp);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Please enter a 4-digit numeric OTP")),
                );
              }
            },
            label: Text(
              keyConfirm.tr,
              style: TextStyle(
                color: Colors.black,
                fontSize: font_14,
                fontWeight: FontWeight.w600,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: colorAppColor,
              minimumSize: Size(double.infinity, 50),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(50),
              ),
            ),
          ),
          SizedBox(height: 20),
        ],
      ).paddingSymmetric(horizontal: width_20, vertical: height_5),
    );
  }
}
