import 'package:alcoholdeliverydriver/app/modules/authentication/model/signup_response_model.dart';
import 'package:alcoholdeliverydriver/export.dart';

import '../../../../main.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';

class ProfileController extends GetxController {
  RxBool notificationState = false.obs;
  PreferenceManger preferenceManger = PreferenceManger();
  RxString name = ''.obs;
  RxString email = "".obs;
  RxString mobileNumber = "".obs;
  RxString profileImage = "".obs;
  RxString currentLocation = "".obs;
  RxBool iconEnable = false.obs;

  @override
  void onInit() {
    getLoginData();
    getCode();
    super.onInit();
  }

  void toggleSwitch() {
    iconEnable.value = !iconEnable.value;
  }

  getCode() {
    preferenceManger.getCountryCode();
  }

  UserResponseModel userResponseModel = UserResponseModel();


  getLoginData() async {
    final loginData = await preferenceManger.getSavedLoginData();

    if (loginData != null) {
      userResponseModel = loginData;
      notificationState.value = (signUpData.value.isNotificationOn ?? 0) == 1;

    } else {
      print("⚠ No login data found in preferences");

    }
  }



  hitLogoutApi() async {
    customLoader.show(Get.context);
    try {
      final response = DioClient().post("/auth/logout", skipAuth: false);
      MessageResponseModel messageModel = MessageResponseModel.fromJson(await response);
      preferenceManger.clearLoginData();
      Get.offAllNamed(AppRoutes.logIn);
      toast(messageModel.message.toString());
      customLoader.hide();
    } catch (e, stack) {
      customLoader.hide();
      return NetworkExceptions.getDioException(e, stack, "/auth/logout");
    }
  }

  hitUpdateNotificationStatusApi() async {
    customLoader.show(Get.overlayContext!);
    try {
      final response = DioClient()
          .put("/notification/toggle", skipAuth: false);
      UserResponseModel userResponseModel =
          UserResponseModel.fromJson(await response);
      signUpData.value = userResponseModel.data ?? UserData();
      toast(userResponseModel.message.toString());
      customLoader.hide();
    } catch (e, stack) {
      customLoader.hide();
      Future.error(NetworkExceptions.getDioException(
          e, stack, "/notification/toggle"));
    }
  }

  hitDeleteAccountApi() async {
    customLoader.show(Get.context);
    try {
      final response =
          await DioClient().delete("/auth/deleteAccount", skipAuth: false);
      MessageResponseModel messageModel =
          MessageResponseModel.fromJson(await response);
      preferenceManger.clearLoginData();
      Get.offAllNamed(AppRoutes.logIn);
      toast(messageModel.message.toString());
      customLoader.hide();
    } catch (e, stack) {
      customLoader.hide();
      Future.error(NetworkExceptions.getDioException(
          e, stack, "/auth/deleteAccount"));
    }
  }
}
