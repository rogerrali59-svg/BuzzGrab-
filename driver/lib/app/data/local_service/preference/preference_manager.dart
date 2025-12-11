import 'package:alcoholdeliverydriver/app/modules/authentication/model/signup_response_model.dart';

import '../../../../export.dart';
import '../../../../main.dart';
import '../../../modules/authentication/model/remember_me.dart';

enum ChooseLanguage { english, arabic }

Rx<ChooseLanguage> selectLanguage = ChooseLanguage.english.obs;

class PreferenceManger {
  static const String isFirstLaunch = "isFirstLaunch";
  static const String isAuthBIo = "isAuthBIo";
  static const String authToken = "authToken";
  static const String signupResponseModel = "signupResponseModel";
  static const String rememberMe = "rememberMe";
  static const String notificationOn = "notificationOn";
  static const String standardTimeFormat = "standardTimeFormat";
  static const String changeLanguage = "changeLanguage";
  static const String countryCode = "countryCode";
  static const String defaultLanguage = "defaultLanguage";
  static const String isDarkMode = "isDarkMode";

  firstLaunch(bool? isFirstCheck) {
    storage.write(isFirstLaunch, isFirstCheck);
  }

  setBioAuth(bool? isAuthBIoo) {
    storage.write(isAuthBIo, isAuthBIoo);
    print('isAuthBIoo$isAuthBIoo');
  }
  setDarkMode(bool? value) {
    storage.write(isDarkMode, value);
    print('isAuthBIoo$isDarkMode');
  }
  getDarkMode()async {
   return await storage.read(isDarkMode);
  }

  getIsAuthBioLaunch() {
    return storage.read(isAuthBIo);
  }

  saveLanguage(String languageCode) {
    debugPrint("languageCode:::${languageCode}");
    storage.write(defaultLanguage, languageCode);
  }

  Future getDefaultLanguage() async {
    return await storage.read(defaultLanguage);
  }

  saveAuthToken(String? token) {
    storage.write(authToken, token);
  }

  saveCountryCode(String? value) {
    storage.write(countryCode, value);
  }

  getCountryCode() {
    return storage.read(countryCode);
  }

  saveLoginType(bool value) {
    storage.write("skip", value);
  }

  getLoginType() {
    return storage.read("skip");
  }

  saveLocalLanguageData(ChooseLanguage chooseLanguage) async {
    storage.write(changeLanguage, getLanguageCodeModal(chooseLanguage));
    if (Get.previousRoute == AppRoutes.settingScreen) {
      Get.back(result: true);
    } else {
      Get.offAllNamed(AppRoutes.logIn);
    }
  }

  Future getLocalLanguageData() async {
    try {
      int code = await storage.read(changeLanguage);
      return getLanguageEnumModal(code);
    } catch (e) {
      return ChooseLanguage.english;
    }
  }

  getLanguageCodeModal(ChooseLanguage chooseLanguage) {
    switch (chooseLanguage) {
      case ChooseLanguage.english:
        return 0;
      case ChooseLanguage.arabic:
        return 1;
      default:
        return 0;
    }
  }

  ChooseLanguage getLanguageEnumModal(int code) {
    switch (code) {
      case 0:
        return ChooseLanguage.english;
      case 1:
        return ChooseLanguage.arabic;
      default:
        return ChooseLanguage.english;
    }
  }

  getAuthToken() {
    return storage.read(authToken);
  }

  getStatusFirstLaunch() {
    return storage.read(isFirstLaunch);
  }

  saveRegisterData(UserResponseModel model) async {

    await storage.write(signupResponseModel, jsonEncode(model.toJson()));
    // await storage.write(signupResponseModel, jsonEncode(model));
  }


  Future<UserResponseModel?> getSavedLoginData() async {
    final userStr = await storage.read(signupResponseModel);
    if (userStr != null) {
      final userMap = jsonDecode(userStr) as Map<String, dynamic>;
      return UserResponseModel.fromJson(userMap);
    }
    return null;
  }


  setLoginData(UserResponseModel? signUpData) async {
    final userStr = storage.write(signupResponseModel, jsonEncode(signUpData!.toJson()));
    return userStr;
  }



  saveRemeberMeData(RememberMeModel? model) async {
    storage.write(rememberMe, jsonEncode(model));
  }

  clearRemeberMeData() {
    storage.remove(rememberMe);
  }

  clearLoginData() {
    storage.remove(signupResponseModel);
    storage.remove(authToken);
    storage.remove(notificationOn);
  }

  Future getsaveRemeberData() async {
    Map<String, dynamic>? userMap;
    final userStr = await storage.read(rememberMe);
    if (userStr != null) userMap = jsonDecode(userStr) as Map<String, dynamic>;
    if (userMap != null) {
      RememberMeModel user = RememberMeModel.fromJson(userMap);
      return user;
    }
    return null;
  }

  saveNotification(bool? notify) {
    storage.write(notificationOn, notify);
  }

  getNotification() {
    return storage.read(notificationOn);
  }

  saveTimeFormat(bool? timeFormat) {
    storage.write(standardTimeFormat, timeFormat);
  }

  getTimeFormat() {
    return storage.read(standardTimeFormat);
  }
}
