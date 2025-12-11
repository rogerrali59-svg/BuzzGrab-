import 'package:alcoholdeliverydriver/export.dart';

import '../../../../main.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../../data/remote_service/network/tbase_controller.dart';

class SetNewPasswordController extends TbaseController {
  TextEditingController newPasswordTextEditingController =
  TextEditingController();

  TextEditingController confirmPasswordTextEditingController =
  TextEditingController();

  TextEditingController forgetEmailController = TextEditingController();
  TextEditingController emailController = TextEditingController();

  FocusNode emailFocusNode = FocusNode();

  RxBool viewNewPassword = true.obs;
  RxBool viewConPassword = true.obs;
  RxBool viewCunPassword = true.obs;
  FocusNode newPasswordFocusNode = FocusNode();
  FocusNode confirmPasswordFocusNode = FocusNode();
  FocusNode currentPasswordFocusNode = FocusNode();
  var email;
  var mobileNumber;
  var countryCode;
  RxBool fromOtp = false.obs;
  RxBool isForgot = false.obs;
  RxBool isProfile = false.obs;
  var id;

  /*===================================================================== Password Visibility  ==========================================================*/
  showOrHideNewPasswordVisibility() {
    viewNewPassword.value = !viewNewPassword.value;
    update();
  }

  /*===================================================================== Confirm Password Visibility  ==========================================================*/
  showOrHideConfirmPasswordVisibility() {
    viewConPassword.value = !viewConPassword.value;
    update();
  }



  @override
  onInit() {
    getArgs();
    super.onInit();
  }

  PreferenceManger preferenceManger = PreferenceManger();

  hitChangePasswordApi() async {
    customLoader.show(Get.overlayContext);
    try {
   debugPrint("hitChangePasswordApi with email =$email");

      var data = {

        "email": email,
        "password": confirmPasswordTextEditingController.text.trim(),
      };
      final response = DioClient().put("/auth/resetPassword",
          data: data, skipAuth: false);
      MessageResponseModel messageResponseModel =
      MessageResponseModel.fromJson(await response);
      toast(messageResponseModel.message ?? "");
      preferenceManger.clearLoginData();
      Get.offAllNamed(AppRoutes.logIn);
      customLoader.hide();
    } catch (e, str) {
      customLoader.hide();
      Future.error(NetworkExceptions.getDioException(
          e, str, "/auth/resetPassword"));
      toast(NetworkExceptions.messageData);
    }
  }



  getArgs() {
    if (Get.arguments != null) {

      isProfile.value = Get.arguments['isProfile'] ?? false;
      email = Get.arguments['email'] ?? "";
      countryCode = Get.arguments['countryCode'] ?? "";
      mobileNumber = Get.arguments['mobileNo'] ?? "";
    }
  }
}
