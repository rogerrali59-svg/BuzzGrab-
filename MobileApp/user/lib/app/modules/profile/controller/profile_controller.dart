import 'package:buzzgrab/app/modules/authentication/model/signup_response_model.dart';
import 'package:buzzgrab/export.dart';
import '../../../../main.dart';
import '../../../data/remote_service/network/network_exceptions.dart';

class ProfileController extends TbaseController {
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
    userResponseModel = (await preferenceManger.getSavedLoginData())!;
    notificationState.value = signUpData.value.notificationEnable ?? false;
    // name.value = userResponseModel.data?.firstName ?? "" + userResponseModel.data?.lastName ?? "" ;
    // profileImage.value = userResponseModel.data?. profileImg?? "";
  }

  /// Log out Api
  hitLogoutApi() async {
    customLoader.show(Get.context);
    try {
      final response = DioClient().post("auth/logout", skipAuth: false);

      MessageResponseModel messageModel =
          MessageResponseModel.fromJson(await response);
      preferenceManger.clearLoginData();
      Get.offAllNamed(AppRoutes.logIn);
      toast(messageModel.message.toString());
      customLoader.hide();
    } catch (e, stack) {
      customLoader.hide();
      return NetworkExceptions.getDioException(e, stack, "auth/logout");
    }
  }

  /// Update Notification Toggle status
  hitUpdateNotificationStatusApi() async {
    customLoader.show(Get.overlayContext!);
    try {
      final response = DioClient().put("notification/toggle", skipAuth: false);
      UserResponseModel userResponseModel =
          UserResponseModel.fromJson(await response);
      signUpData.value = userResponseModel.data ?? UserData();
      customBottomToast(userResponseModel.message.toString());
      customLoader.hide();
    } catch (e, stack) {
      customLoader.hide();
      Future.error(
          NetworkExceptions.getDioException(e, stack, "notification/toggle"));
    }
  }

  /// Delete Account
  hitDeleteAccountApi() async {
    customLoader.show(Get.context);
    try {
      final response =
          await DioClient().put("auth/deleteAccount", skipAuth: false);
      MessageResponseModel messageModel =
          MessageResponseModel.fromJson(await response);
      preferenceManger.clearLoginData();
      Get.offAllNamed(AppRoutes.logIn);
      toast(messageModel.message.toString());
      customLoader.hide();
    } catch (e, stack) {
      customLoader.hide();
      Future.error(
          NetworkExceptions.getDioException(e, stack, "auth/deleteAccount"));
    }
  }
}
