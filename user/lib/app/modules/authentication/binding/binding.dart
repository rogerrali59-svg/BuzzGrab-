/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/authentication/controllers/id_verification_controller.dart';
import 'package:buzzgrab/app/modules/authentication/controllers/location_picker_controller.dart';
import 'package:buzzgrab/app/modules/authentication/controllers/permission_controller.dart';

import '../../../../export.dart';
import '../../profile/controller/profile_controller.dart';
import '../controllers/forgot_controller.dart';

class AuthenticationBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<LoginController>(
      () => LoginController(),
    );
    Get.lazyPut<RegisterController>(
      () => RegisterController(),
    );
    Get.lazyPut<ForgotController>(
      () => ForgotController(),
    );

    Get.lazyPut<ProfileController>(
      () => ProfileController(),
    );
 Get.lazyPut<PermissionController>(
      () => PermissionController(),
    );
 Get.lazyPut<LocationPickerController>(
      () => LocationPickerController(),
    );
Get.lazyPut<IDVerificationController>(
      () => IDVerificationController(),
    );

  }
}
