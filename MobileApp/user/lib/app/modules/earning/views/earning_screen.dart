import 'dart:io';

import 'package:buzzgrab/app/core/values/app_assets.dart';
import 'package:buzzgrab/app/core/widgets/custom_appbar.dart';
import 'package:buzzgrab/app/core/widgets/text_view.dart';
import 'package:buzzgrab/app/modules/asset_image/asset_image.dart';
import 'package:buzzgrab/app/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../core/translations/local_keys.dart';
import '../../../core/utils/helper_widget.dart';
import '../../../core/values/app_colors.dart';
import '../../../core/values/dimens.dart';
import '../../../core/widgets/annotated_region_widget.dart';
import '../controller/earning_controller.dart';

class EarningScreen extends GetView<EarningController> {
  final controller = Get.put(EarningController());

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
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        appBar: CustomAppBar(
          appBarTitleText: 'History',
          centerTitle: true,
          isBackIcon: false,
          leadingWidth: width_0,
        ),
        body: Center(child: noDataToShow(),)
      ),
    );
  }

  Widget _body() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Total Balance Section
        Container(
          width: double.infinity,
          padding: EdgeInsets.all(20),
          color: colorAppColor,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                keyTotalBalance.tr,
                style: TextStyle(
                    fontSize: font_14,
                    fontWeight: FontWeight.w400,
                    color: Colors.white),
              ),
              SizedBox(height: height_8),
              Center(
                child: Text(
                  "\$${controller.totalBalance.value.toStringAsFixed(2)}",
                  style: TextStyle(
                      fontSize: font_24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white),
                ),
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  coloumWidget(title: keyThisWeek.tr, value: "\$545.00"),
                  coloumWidget(title: keyOrders.tr, value: "24"),
                  coloumWidget(title: keyAvgOrder.tr, value: "\$8.00"),
                ],
              )
            ],
          ),
        ),
        SizedBox(
          height: height_20,
        ),
        _tabs(),
        SizedBox(
          height: height_20,
        ),

        // Earnings Details Section (Tab-based Content)
        Expanded(
          child: SingleChildScrollView(
            child: Column(
              children: [
                // Today’s Orders & Average per Order
                _earningsDetails(),
                SizedBox(height: 30),
                ElevatedButton(
                  onPressed: () {
                    Get.toNamed(AppRoutes.transactionHistoryScreen);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colorAppColor,
                    minimumSize: Size(double.infinity, 50),
                  ),
                  child: Text(keyViewTransaction.tr,
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: font_14,
                          fontWeight: FontWeight.w500)),
                ).paddingSymmetric(horizontal: height_10),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // Tabs for Daily, Weekly, Monthly, Yearly
  Widget _tabs() {
    return Obx(() => SizedBox(
          height: height_30,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              _tabButton(keyDaily.tr, 0),
              SizedBox(
                width: width_5,
              ),
              _tabButton(keyWeekly.tr, 1),
              SizedBox(
                width: width_5,
              ),
              _tabButton(keyMonthly.tr, 2),
              SizedBox(
                width: width_5,
              ),
              _tabButton(keyYearly.tr, 3),
            ],
          ).marginSymmetric(horizontal: margin_10),
        ));
  }

  // Tab Button Widget
  Widget _tabButton(String title, int index) {
    bool isSelected = controller.selectedTab.value == index;
    return GestureDetector(
      onTap: () => controller.selectedTab.value = index,
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 5, horizontal: 18),
        decoration: BoxDecoration(
          color: isSelected ? colorAppColor : Colors.white,
          borderRadius: BorderRadius.circular(30),
        ),
        child: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : Colors.black38,
          ),
        ),
      ),
    );
  }

  // Earnings Details Section
  Widget _earningsDetails() {
    return Column(
      children: [
        _earningsRow(keyTodaysOrder.tr, controller.todaysOrders, ic_order),
        SizedBox(
          height: height_10,
        ),
        _earningsRow(keyAvgPerOrder.tr, controller.averagePerOrder, dollar),
      ],
    );
  }

  // Row for displaying individual earnings data
  Widget _earningsRow(String title, Rx<dynamic> value, icon) {
    return Container(
      padding: EdgeInsets.all(20),
      margin: EdgeInsets.symmetric(horizontal: 15),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        children: [
          AssetImageWidget(
            imageUrl: icon,
            imageHeight: height_40,
          ),
          SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: TextStyle(
                        fontSize: font_14,
                        fontWeight: FontWeight.w600,
                        color: Colors.black38)),
                SizedBox(height: 5),
                Obx(() => Text("\$${value.value.toStringAsFixed(2)}",
                    style: TextStyle(
                        fontSize: font_16, fontWeight: FontWeight.w600))),
              ],
            ),
          ),
          Icon(Icons.trending_up, size: height_30, color: darkGreenColor),
        ],
      ),
    );
  }

  coloumWidget({title, value}) {
    return Container(
      width: width_90,
      decoration: BoxDecoration(
          color: Colors.yellow.shade600,
          borderRadius: BorderRadius.circular(15)),
      child: Column(
        children: [
          TextView(
              text: title,
              textStyle: TextStyle(
                  fontSize: font_12,
                  fontWeight: FontWeight.w400,
                  color: Colors.black)),
          SizedBox(
            height: height_5,
          ),
          TextView(
              text: value,
              textStyle:
                  TextStyle(fontWeight: FontWeight.w500, color: Colors.black)),
        ],
      ).paddingSymmetric(horizontal: width_10, vertical: height_15),
    );
  }
}
