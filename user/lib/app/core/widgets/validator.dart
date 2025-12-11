import 'package:intl_phone_field/countries.dart';

import '../../../export.dart';
import '../translations/local_keys.dart';

class Validator {
  static String? validateEmail(String value) {
    if (value.isEmpty) {
      return keyEmailEmpty.tr;
    } else if (!GetUtils.isEmail(value.trim())) {
      return keyInvalidEmail.tr;
    }
    return null;
  }

  static String? fieldChecker2({required value, required message}) {
    if (value.toString().trim().isEmpty) {
      return "$message ${keyCannotBeEmpty.tr}";
    } else if (value.toString().length < 3) {
      return "${keyCannotBeEmpty.tr}";
    }
    return null;
  }

  static String? validatePassword(String value) {
    RegExp regex =
        RegExp(r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$');
    if (value.isEmpty) {
      return keyPasswordEmpty.tr;
    } else {
      if (!regex.hasMatch(value)) {
        return keyInvalidPassword.tr;
      } else {
        return null;
      }
    }
  }

  static String? validateCurrentPassword(String value) {
    if (value.isEmpty) {
      return keyCurrentPasswordEmpty.tr;
    }
  }

  static String? validateConfirmPasswordMatch(
      {String? value, String? password}) {
    if (value!.isEmpty) {
      return keyCPasswordEmpty.tr;
    } else if (value != password) {
      return keyPasswordMatc.tr;
    }
    return null;
  }

  static String? validatePhoneNumber(String value, Country? selectedCountry) {
    if (value == '') {
      return keyPhoneNumber.tr;
    } else if (selectedCountry != null) {
      if (value.length < selectedCountry.minLength) {
        return keyInvalidPhoneNumber.tr;
      }
    } else if (!GetUtils.isPhoneNumber(value.trim())) {
      return keyInvalidPhoneNumber.tr;
    }
    return null;
  }

  static String? fieldChecker({required String value, required message}) {
    if (value.toString().trim().isEmpty) {
      return "$message ${keyCannotBeEmpty.tr}";
    }
    return null;
  }

  static String? fieldAddMoneyChecker(
      {required String value, required message}) {
    if (value.toString().trim().isEmpty) {
      return "$message ${keyCannotBeEmpty.tr}";
    } else if (value == '.') {
      return '';
    } else if (double.parse(value) < 1) {
      return 'Amount can not be less then \$1';
    }
    return null;
  }

  static String? zeroChecker({required String value, required message}) {
    if (value.toString().trim().isEmpty) {
      return "$message ${keyCannotBeEmpty.tr}";
    }
    if (int.parse(value.toString().trim()) <= 0) {
      return "$message ${keyCannotBeZero.tr}";
    }

    return null;
  }

  static bool validateStrongPassword(value) {
    var pattern =
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@\$%^&*-]).{8,}\$";
    RegExp regex = new RegExp(pattern);
    return (regex.hasMatch(value)) ? false : true;
  }
}

/*================================================== Password Validator ===================================================*/

class PasswordFormValidator {
  static String? validate(String value) {
    if (value.isEmpty) {
      return keyPasswordEmpty.tr;
    } else if (value.length < 8) {
      return keyInvalidPassword.tr;
    }
    return null;
  }

  static String? validatePasswordMatch(
      {String? value, String? confirmPassword}) {
    if (value!.isEmpty) {
      return keyCPasswordEmpty.tr;
    } else if (value.length < 8) {
      return keyInvalidPassword.tr;
    } else if (value != confirmPassword) {
      return keyPasswordMatc.tr;
    }
    return null;
  }
}

/*================================================== Phone Number Validator ===================================================*/

class PhoneNumberValidate {
  static String? validateMobile(String value) {
    if (value.isEmpty) {
      return keyPhoneEmEmpty.tr;
    } else if (value.length < 8 || value.length > 15) {
      return keyInvalidPhoneNumber.tr;
    } else if (!validateNumber(value)) {
      return keySpecialCharacter.tr;
    }
    return null;
  }
}

bool validateNumber(String value) {
  var pattern = r'^[0-9]+$';
  RegExp regex = RegExp(pattern);
  return (!regex.hasMatch(value)) ? false : true;
}

/*===============================Field Checker=================================================*/
class FieldChecker {
  static String? fieldChecker({String? value, message}) {
    if (value == null || value.toString().trim().isEmpty) {
      return "$message ${keyCannotBeEmpty.tr}";
    }
    return null;
  }
}
