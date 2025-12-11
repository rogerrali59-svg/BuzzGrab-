import 'package:alcoholdeliverydriver/app/modules/profile/controller/editProfile_controller.dart';
import 'package:alcoholdeliverydriver/app/modules/setting/controller/contact_us_controller.dart';
import 'package:alcoholdeliverydriver/export.dart';

import '../../authentication/controllers/edit_profile_controller.dart';
import '../controller/change_password_controller.dart';

class SettingBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ContactUsController>(
      () => ContactUsController(),
    );
    Get.lazyPut<ChangePasswordController>(
      () => ChangePasswordController(),
    );

    Get.lazyPut<EditProfileController>(
      () => EditProfileController(),
    );
  }
}
