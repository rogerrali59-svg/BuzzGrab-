/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/home/controller/delivery_request_controller.dart';
import 'package:buzzgrab/app/modules/ratings/controller/rating_controller.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:buzzgrab/app/core/translations/local_keys.dart';
import 'package:buzzgrab/app/core/widgets/earning_container_widget.dart';
import 'package:buzzgrab/main.dart';
import '../../../../../export.dart';

class RatingScreen extends GetView<RatingController> {
  final controller = Get.put(RatingController());

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
            appBarTitleText: "Rating & Reviews",
            centerTitle: true,
            onTap: () {
              Get.back();
            },
          ),
          body: _body(),
        ),
      ),
    );
  }

  Widget _body() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: height_10),
        Expanded(
          child: SingleChildScrollView(
            child: Column(
              children: [
                ratingDetail(),
                SizedBox(height: height_15),
                ratingTabs(), // ✅ Add tab buttons here
                SizedBox(height: height_20),
                Obx(() {
                  final ratings = controller.filteredRatings;
                  return Column(
                    children: ratings.isEmpty
                        ? [
                            SizedBox(height: height_50),
                            Text(
                              "No ratings found",
                              style: TextStyle(color: Colors.black45),
                            ),
                          ]
                        : ratings.map((r) {
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 12.0),
                              child: ratingList(
                                name: r["name"],
                                type: r["type"],
                                rating: r["rating"],
                                date: r["date"],
                                ratingDes: r["ratingDes"],
                              ),
                            );
                          }).toList(),
                  );
                }),
              ],
            ),
          ),
        ),
      ],
    ).marginSymmetric(horizontal: margin_12);
  }

  Widget ratingTabs() {
    return Obx(() => Row(
          children: [
            Expanded(
              child: tabButton("All", 0),
            ),
            SizedBox(width: width_5),
            Expanded(
              child: tabButton("Customer", 1),
            ),
            SizedBox(width: width_5),
            Expanded(
              child: tabButton("Restaurant", 2),
            ),
          ],
        ));
  }

  Widget tabButton(String title, int index) {
    final isSelected = controller.selectedTab.value == index;
    return ElevatedButton(
      onPressed: () => controller.selectedTab.value = index,
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? colorAppColor : Colors.white,
        minimumSize: Size(double.infinity, 40),
        padding: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(30),
        ),
      ),
      child: Text(
        title,
        style: TextStyle(
          color: isSelected ? Colors.white : Colors.black38,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
          fontSize: font_12,
        ),
      ),
    );
  }

  ratingDetail() {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(color: lightFieldColor),
      child: Column(
        children: [
          AssetImageWidget(
            imageUrl: ic_star,
            imageHeight: height_40,
          ),
          SizedBox(
            height: height_10,
          ),
          TextView(
              text: "4.5",
              textStyle: TextStyle(
                  fontSize: font_20,
                  fontWeight: FontWeight.w600,
                  color: Colors.black)),
          TextView(
              text: "Average Rating",
              textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.w400,
                  color: Colors.black)),
          SizedBox(
            height: height_5,
          ),
          TextView(
              text: "Based on 56 Deliveries",
              textStyle: TextStyle(
                  fontSize: font_14,
                  fontWeight: FontWeight.w600,
                  color: Colors.black38)),
        ],
      ).paddingSymmetric(vertical: height_15),
    );
  }

  ratingList({name, type, rating, date, ratingDes}) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colorAppColor),
      ),
      child: Padding(
        padding: EdgeInsets.all(15.0),
        child: Column(
          children: [
            Row(
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
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            name,
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Spacer(),
                          GestureDetector(
                            onTap: () {},
                            child: AssetImageWidget(
                              imageUrl: ic_star,
                              imageHeight: height_12,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            type,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black54,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            date,
                            style: TextStyle(
                                fontSize: font_13,
                                fontWeight: FontWeight.w400,
                                color: Colors.black38),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(
              height: height_10,
            ),
            Divider(
              color: Colors.black38,
            ),
            SizedBox(
              height: height_10,
            ),
            TextView(
                textAlign: TextAlign.start,
                text: ratingDes,
                textStyle: TextStyle(
                    fontWeight: FontWeight.w400,
                    fontSize: font_14,
                    color: Colors.black))
          ],
        ),
      ),
    );
  }
}
