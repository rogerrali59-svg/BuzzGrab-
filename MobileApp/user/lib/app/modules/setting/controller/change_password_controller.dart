import 'package:buzzgrab/export.dart';

import '../../../../main.dart';
import '../../../core/values/route_arguments.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../../data/remote_service/network/tbase_controller.dart';

class ChangePasswordController extends TbaseController {
  TextEditingController newPasswordTextEditingController =
      TextEditingController();
  TextEditingController oldPasswordTextEditingController =
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

  /*===================================================================== Confirm Password Visibility  ==========================================================*/
  showOrHideCurrentPasswordVisibility() {
    viewCunPassword.value = !viewCunPassword.value;
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
      var data = {
        "current_password": oldPasswordTextEditingController.text.trim(),
        "new_password": newPasswordTextEditingController.text.trim(),
        "confirm_password": confirmPasswordTextEditingController.text.trim(),
      };
      final response = DioClient().post("/api/change-password-api/",
          data: FormData.fromMap(data), skipAuth: false);
      MessageResponseModel messageResponseModel =
          MessageResponseModel.fromJson(await response);
      toast(messageResponseModel.message ?? "");
      preferenceManger.clearLoginData();
      Get.offAllNamed(AppRoutes.logIn);
      customLoader.hide();
    } catch (e, str) {
      customLoader.hide();
      Future.error(NetworkExceptions.getDioException(
          e, str, "/api/change-password-api/"));
      toast(NetworkExceptions.messageData);
    }
  }

  hitResetPasswordApi() async {
    customLoader.show(Get.overlayContext!);
    var reqBody = {
      'email': email??"",
      "password": newPasswordTextEditingController.text.trim()
    };
    try {
      final response = DioClient().put(
        "auth/resetPassword",
        skipAuth: false,
        data:reqBody,
      );
      MessageResponseModel messageModel =
          MessageResponseModel.fromJson(await response);
      toast(messageModel.message);
      Get.offAllNamed(AppRoutes.logIn);
      customLoader.hide();
    } catch (e, st) {
      customLoader.hide();
      NetworkExceptions.getDioException(e, st, 'auth/resetPassword');
      toast(NetworkExceptions.messageData);
    }
  }

  getArgs() {
    if (Get.arguments != null) {
      isForgot.value = Get.arguments['isForgot'] ?? false;
      isProfile.value = Get.arguments['isProfile'] ?? false;
      email = Get.arguments['email'] ?? "";
      countryCode = Get.arguments['countryCode'] ?? "";
      mobileNumber = Get.arguments['mobileNo'] ?? "";
    }
  }
}
