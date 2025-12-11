/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/app/modules/earning/views/earning_screen.dart';
import 'package:alcoholdeliverydriver/app/modules/profile/view/profile_screen.dart';
import 'package:alcoholdeliverydriver/app/modules/home/controller/main_controller.dart';
import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../order/view/orders_screen.dart';
import 'home_screen.dart';

class MainScreen extends GetView<MainController> {
  final GlobalKey<ScaffoldState>? scaffoldKey = GlobalKey<ScaffoldState>();
  final controller = Get.find<MainController>();

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
        child: Scaffold(
          backgroundColor: Colors.white,
          bottomNavigationBar: Obx(() => ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(20), // Adjust radius as needed
                  topRight: Radius.circular(20),
                ),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border(
                      top: BorderSide(
                        color: Colors.white,
                        width: 1.5,
                      ),
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20),
                    ),
                  ),
                  child: BottomNavigationBar(
                    backgroundColor: Colors.white,
                    elevation: 2,
                    selectedItemColor: colorAppColor,
                    showSelectedLabels: true,
                    showUnselectedLabels: true,
                    unselectedItemColor: Colors.grey,
                    onTap: (value) {
                      print('v');
                      controller.updateBottomNavIndex(value);
                    },
                    currentIndex: controller.bottomNavIndex.value,
                    type: BottomNavigationBarType.fixed,
                    iconSize: height_18,
                    unselectedLabelStyle: TextStyle(
                      fontSize: font_13,
                      fontWeight: FontWeight.w600,
                      fontFamily: 'Inter',
                    ),
                    selectedLabelStyle: TextStyle(
                      fontSize: font_13,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                      fontFamily: 'Inter',
                    ),
                    items: [
                      BottomNavigationBarItem(
                        icon: AssetImageWidget(
                          imageUrl: inActive_home,
                          imageHeight: height_20,
                        ).paddingOnly(top: height_6, bottom: height_6),
                        activeIcon: AssetImageWidget(
                          imageUrl: active_home,
                          imageHeight: height_20,
                        ).paddingOnly(top: height_6, bottom: height_6),
                        label: keyHome.tr,
                      ),
                      BottomNavigationBarItem(
                        icon: AssetImageWidget(
                          imageUrl: inActive_orders,
                          imageHeight: height_20,
                        ).paddingOnly(top: height_6, bottom: height_6),
                        activeIcon: AssetImageWidget(
                          imageUrl: active_orders,
                          imageHeight: height_20,
                        ).paddingOnly(top: height_6, bottom: height_6),
                        label: keyOrders.tr,
                      ),
                      BottomNavigationBarItem(
                        icon: AssetImageWidget(
                          imageUrl: inActive_earning,
                          imageHeight: height_20,
                        ).paddingOnly(top: height_6, bottom: height_6),
                        activeIcon: AssetImageWidget(
                          imageUrl: active_earning,
                          imageHeight: height_20,
                        ).paddingOnly(top: height_6, bottom: height_6),
                        label: keyEarnings.tr,
                      ),
                      BottomNavigationBarItem(
                        icon: AssetImageWidget(
                          imageUrl: inActive_profile,
                          imageHeight: height_20,
                        ).paddingOnly(top: height_8, bottom: height_2),
                        activeIcon: AssetImageWidget(
                          imageUrl: active_profile,
                          imageHeight: height_20,
                        ).paddingOnly(top: height_8, bottom: height_2),
                        label: keyProfile.tr,
                      ),
                    ],
                  ),
                ),
              )),
          body: Obx(() {
            return IndexedStack(
              index: controller.bottomNavIndex.value,
              children: [
                HomeScreen(),
                OrdersScreen(),
                EarningScreen(),
                ProfileScreen(),
              ],
            );
          }),
        ));
  }
}
