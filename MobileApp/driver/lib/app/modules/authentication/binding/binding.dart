/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import '../../../../export.dart';
import '../../profile/controller/profile_controller.dart';
import '../controllers/forgot_controller.dart';
import '../controllers/setnew_password_controller.dart';

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
    Get.lazyPut<SetNewPasswordController>(
          () => SetNewPasswordController(),
    );


  }
}
