/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/app/data/remote_service/network/tbase_controller.dart';
import 'package:alcoholdeliverydriver/app/modules/authentication/controllers/account_inreview_controller.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:intl_phone_field/countries.dart';

import '../../../../../export.dart';
import '../../../../main.dart';
import '../../../core/translations/local_keys.dart';
import '../../../core/values/app_global_values.dart';
import '../../../core/values/route_arguments.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../splash_module/controllers/splash_controller.dart';
import '../model/remember_me.dart';
import '../model/signup_response_model.dart';

class LoginController extends TbaseController {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  FocusNode passwordFocusNode = FocusNode();
  RxBool isRememberMe = false.obs;
  RxBool viewPassword = true.obs;

  FocusNode emailFocusNode = FocusNode();

  void loginWithGoogle() {
    print('Google login tapped');
  }

  void loginWithApple() {
    print('Apple login tapped');
  }

  showOrHidePasswordVisibility() {
    viewPassword.value = !viewPassword.value;
    update();
  }

  Rx<Country> selectedCountry = Country(
    name: "United States",
    flag: "🇺🇸",
    code: "US",
    dialCode: "1",
    minLength: 10,
    maxLength: 10,
    nameTranslations: {},
  ).obs;
  PreferenceManger preferenceManger = PreferenceManger();

  @override
  void onInit() {
    getRememberMeData();
    super.onInit();
  }

  saveDataToLocalStorage(UserResponseModel value) async {
    PreferenceManger().saveRegisterData(value);
    PreferenceManger().saveAuthToken(value.data?.token);
    signUpData.value = value.data!;

    _rememberMeModel = RememberMeModel(
      email: emailController.text.trim().toString(),
      password: passwordController.text.toString(),
      /*    countryCode: selectedCountry.value.dialCode,
        countryIsoCode: selectedCountry.value.code*/
    );

    if (isRememberMe.value) {
      preferenceManger.saveRemeberMeData(_rememberMeModel);
    } else {
      preferenceManger.clearRemeberMeData();
    }
  }

  RememberMeModel? _rememberMeModel;

  getRememberMeData() async {
    _rememberMeModel = await PreferenceManger().getsaveRemeberData();
    passwordController.text = _rememberMeModel?.password ?? "";
    emailController.text = _rememberMeModel?.email ?? "";
    if (_rememberMeModel != null) {
      isRememberMe.value = true;
    }
  }

  callLoginApi() async {

    try {
      customLoader.show(Get.context);
      final request = {
        'email': emailController.text.trim(),
        'password': passwordController.text.trim(),
        'deviceType': deviceType ?? '1',
        'deviceName': deviceName??"",
        "roleId": 4,
        'deviceToken': '123',
      };

      await DioClient()
          .post('/auth/userLogin', data: request, skipAuth: true)
          .then(
            (value) {
          if (value != null) {
            UserResponseModel userResponseModel =
            UserResponseModel.fromJson(value);
            signUpData.value = userResponseModel.data!;
            customLoader.hide();
            saveDataToLocalStorage(userResponseModel);
            toast('${userResponseModel.message}');
            if (userResponseModel.data?.isVerified == false) {
              Get.toNamed(AppRoutes.otpScreen);
            }
            // else if (userResponseModel.data?.isProfileCompleted == false) {
            //   Get.toNamed(AppRoutes.editProfileScreen);
            // }
            else {
              Get.offAllNamed(AppRoutes.mainScreen);
            }
          }
        },
      ).onError(
            (error, stackTrace) {
          print('Error--$error');
          print('Error--$stackTrace');
          customLoader.hide();
          NetworkExceptions.getDioException(
              error, stackTrace, 'auth/userLogin');
          toast(NetworkExceptions.messageData);
        },
      );
    } catch (e, st) {
      print('Error---$e');
      print('Error---$st');
    }
  }





  // callLoginApi() async {
  //   try {
  //     customLoader.show(Get.context);
  //     final request = {
  //       'email': emailController.text.trim(),
  //       'password': passwordController.text.trim(),
  //       'roleId': '4',
  //       'device_type': "1",
  //       'device_token': deviceToken ?? "123",
  //       'device_name': '$deviceName',
  //     };
  //
  //     await DioClient()
  //         .post('/api/auth/userLogin',
  //             data: FormData.fromMap(request), skipAuth: true)
  //         .then(
  //       (value) {
  //         if (value != null) {
  //           UserResponseModel userResponseModel =
  //               UserResponseModel.fromJson(value);
  //
  //
  //           Get.offAllNamed(AppRoutes.mainScreen);
  //           signUpData.value = userResponseModel.data ?? UserData();
  //           customLoader.hide();
  //           saveDataToLocalStorage(userResponseModel);
  //           toast('${userResponseModel.message}');
  //
  //           Get.offAllNamed(AppRoutes.mainScreen);
  //
  //
  //           // if (signUpData.value.isVerified == false) {
  //           //   Get.toNamed(AppRoutes.otpScreen, arguments: {
  //           //     'isLogin': true,
  //           //     'email': emailController.text.trim(),
  //           //   });
  //           // } else {
  //           //   if (signUpData.value.isAdminVerified == false) {
  //           //     Get.delete<AccountInReviewController>();
  //           //     Get.toNamed(AppRoutes.accountSubmitScreen, arguments: {
  //           //       'fromLogin': true,
  //           //     });
  //           //   } else {
  //           //     if (signUpData.value.isProfileSetup == false) {
  //           //       Get.toNamed(AppRoutes.editProfileScreen, arguments: {
  //           //         'fromLogin': true,
  //           //       });
  //           //     } else {
  //           //       Get.offAllNamed(AppRoutes.mainScreen);
  //           //     }
  //           //
  //           //   }
  //           // }
  //
  //         }
  //       },
  //     ).onError(
  //       (error, stackTrace) {
  //         print('Error--$error');
  //         print('Error--$stackTrace');
  //         customLoader.hide();
  //         NetworkExceptions.getDioException(
  //             error, stackTrace, '/auth/userLogin');
  //         toast(NetworkExceptions.messageData);
  //       },
  //     );
  //   } catch (e, st) {
  //     print('Error---$e');
  //     print('Error---$st');
  //   }
  // }

  String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email is required';
    }
    final emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    if (!emailRegex.hasMatch(value.trim())) {
      return 'Please enter a valid email address';
    }
    return null;
  }

  String? validatePassword(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Password is required';
    }
    if (value.trim().length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }
}

class Resource {
  final Status status;

  Resource({required this.status});
}

enum Status { Success, Error, Cancelled }
