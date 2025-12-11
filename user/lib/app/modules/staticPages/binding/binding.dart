/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/staticPages/controllers/static_page_controller.dart';
import 'package:buzzgrab/export.dart';
import 'package:get/get.dart';

class StaticPageBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<StaticPageController>(
      () => StaticPageController(),
    );
  }
}
