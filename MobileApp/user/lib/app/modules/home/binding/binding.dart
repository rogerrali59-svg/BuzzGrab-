/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/home/controller/main_controller.dart';
import '../../../../export.dart';
import '../controller/delivery_detail_controller.dart';
import '../controller/delivery_request_controller.dart';
import '../controller/home_controller.dart';
import '../controller/live_order_controller.dart';

class HomeBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<HomeController>(
      () => HomeController(),
    );
    Get.lazyPut<MainController>(
      () => MainController(),
    );
Get.lazyPut<DeliveryRequestController>(
      () => DeliveryRequestController(),
    );
Get.lazyPut<DeliveryDetailController>(
      () => DeliveryDetailController(),
    );

Get.lazyPut<LiveOrderController>(
      () => LiveOrderController(),
    );


  }
}
