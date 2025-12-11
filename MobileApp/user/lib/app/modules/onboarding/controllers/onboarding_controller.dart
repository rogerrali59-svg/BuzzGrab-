/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import '../../../../../export.dart';

class OnboardingController extends GetxController {
  PageController pageController = PageController();
  final PreferenceManger preferenceManger = PreferenceManger();

  List<String> images = [
    ic_onBoading
  ];

  List<String> titles = [
    "Welcome to Cold Beer",
  ];

  List<String> title = [
    "Manage deliveries, orders, and earnings with ease",
  ];


}
