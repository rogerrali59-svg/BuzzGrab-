import 'dart:ui';

import 'package:buzzgrab/main.dart';
import 'package:get/get.dart';

import '../../../../export.dart';
import '../../../core/values/app_constant.dart';

RxString selectedLanguage = ENGLISH.obs;

class SelectLanguageController extends TbaseController {
  RxInt radioValue = 0.obs;

  @override
  void onInit() {
    getLanguage();
    super.onInit();
  }

  getLanguage() {
    radioValue.value = getLanguageMethod();
  }

  void selectLanguage(int? value) {
    if (value == null) return;

    radioValue.value = value;

    switch (value) {
      case 0:
        Get.updateLocale(Locale(ENGLISH));
        selectedLanguage.value = ENGLISH;
        break;
      case 1:
        Get.updateLocale(Locale(FRENCH));
        selectedLanguage.value = FRENCH;
        break;
      case 2:
        Get.updateLocale(Locale(PORTUGUESE));
        selectedLanguage.value = PORTUGUESE;
        break;
      default:
        selectedLanguage.value = ENGLISH;
    }

    storage.write('defaultLanguage', selectedLanguage.value);
    print('Language selected: ${selectedLanguage.value}');
  }
}
