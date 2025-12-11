/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/profile/controller/select_language_controller.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:buzzgrab/app/modules/authentication/model/signup_response_model.dart';
import 'package:buzzgrab/app/modules/nointernet/no_internet_screen.dart';
import 'package:intl/intl.dart';

// import 'package:local_auth/local_auth.dart';
import 'package:buzzgrab/main.dart';

import '../../../../export.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../home/widget/header_widget.dart';
import '../../splash/splash_animation.dart';

UserResponseModel userResponseModel = UserResponseModel();
RxBool isDeviceSupported = false.obs;

class SplashController extends TbaseController
    with GetSingleTickerProviderStateMixin {
  final DateTime now = DateTime.now();
  late AnimationController animationController;
  late SplashAnimation splashAnimation;

  // final LocalAuthentication auth = LocalAuthentication();
  final String animationType;

  SplashController({this.animationType = "zoomIn"});

  @override
  void onInit() {
    animationController = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );

    splashAnimation = SplashAnimation(
      controller: animationController,
      animationType: animationType,
    );
    animationController.forward(); // Start animation

    hitDateCheckApi();
    // navigateToScreen();
    SystemChannels.textInput.invokeMethod('TextInput.hide');
    super.onInit();
  }

  @override
  void onResumed() {
    hitDateCheckApi();
    // navigateToScreen();
    SystemChannels.textInput.invokeMethod('TextInput.hide');
    super.onResumed();
  }

  @override
  void onPaused() {
    customLoader.hide();

    super.onPaused();
  }

  void checkInternetAvailable() async {
    final connectivityResult = await (Connectivity().checkConnectivity());
    if (connectivityResult == ConnectivityResult.none) {
      Get.offAll(
        NoInternetConnectionScreen(
          screenType: 0,
        ),
      );
    } else {
      print('object--->');
      // hitDateCheckApi();
      navigateToScreen();
    }
  }

  /// Navigation to next screen
  navigateToScreen() => Timer(Duration(milliseconds: 3000), () async {
        if (await preferenceManger.getStatusFirstLaunch() == true &&
            await preferenceManger.getStatusFirstLaunch() != null) {
          print(
              'preferenceManger.getAuthToken() ${preferenceManger.getAuthToken()}');
          if (await preferenceManger.getAuthToken() != null) {
            hitCheckApi();
          } else {
            Get.offAllNamed(AppRoutes.logIn);
          }
        } else {
          Get.offAllNamed(AppRoutes.onBoarding);
        }
      });

  /// User check api
  void hitCheckApi() async {
    try {
      final response = DioClient().get('auth/profile', skipAuth: false);
      userResponseModel = UserResponseModel.fromJson(await response);
      if (userResponseModel.data != null) {
        signUpData.value = userResponseModel.data ?? UserData();
        if (signUpData.value.isVerified == false) {
          Get.offAllNamed(AppRoutes.logIn);
        } else {
          Get.offAllNamed(AppRoutes.mainScreen);
        }
      }
    } catch (e, str) {
      // Get.toNamed(AppRoutes.chooseLanguageScreen);
      if (e.toString().contains("No route to host")) {
        toast('Server error, please try again later');
        networkDialog(
          server: true,
          onRetry: () {
            hitCheckApi();
            //  Get.back();
          },
        );
      } else if (e.toString().contains("SocketException") ||
          e.toString().contains("Network is unreachable") ||
          e.toString().contains("Failed host lookup")) {
        networkDialog(
          onRetry: () {
            hitCheckApi();
            //  Get.back();
          },
        );
      }
      Get.offAllNamed(AppRoutes.logIn);
      return NetworkExceptions.getDioException(e, str, "auth/profile");
    }
  }

  /// Date check api
  Rx<MessageResponseModel?> messageResponseModel = Rxn();

  hitDateCheckApi() async {
    try {
      final response = await DioClient().get("dateCheck/list");
      final String date1 = DateFormat('yyyy-MM-dd').format(DateTime.now());
      DateTime d1 = DateTime.parse(date1);
      DateTime d2 = DateTime.parse(response['datecheck'] ?? date1);
      if (d1.isAfter(d2)) {
        appExpirationDialog();
        return;
      } else {
        navigateToScreen();
      }

    } catch (e, str) {
      if (e.toString().contains("No route to host")) {
        toast('Server error, please try again later');
        networkDialog(
          server: true,
          onRetry: () {
            hitDateCheckApi();
            //  Get.back();
          },
        );
      } else if (e.toString().contains("SocketException") ||
          e.toString().contains("Network is unreachable") ||
          e.toString().contains("Failed host lookup")) {
        networkDialog(
          onRetry: () {
            hitDateCheckApi();
            //  Get.back();
          },
        );
      }
      Future.error(NetworkExceptions.getDioException(e, str, "dateCheck/list"));
    }
  }
}
