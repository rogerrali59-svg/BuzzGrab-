import 'package:buzzgrab/export.dart';

import '../../../data/remote_service/network/tbase_controller.dart';

class AccountInReviewController extends TbaseController {
  @override
  void onInit() {
    getArgs();
    super.onInit();
  }

  RxBool fromLogin = false.obs;

  getArgs() {
    if (Get.arguments != null) {
      fromLogin.value = Get.arguments['fromLogin'] ?? false;
    }
  }
}
