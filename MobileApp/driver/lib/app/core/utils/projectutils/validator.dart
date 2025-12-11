/*================================================== Password Validator ===================================================*/

import 'package:intl_phone_field/countries.dart';

import '../../../../export.dart';
import '../../translations/local_keys.dart';

class PasswordFormValidator {
  static String? validate(String value) {
    RegExp regex =
        RegExp(r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$');
    return value.isEmpty
        ? keyPasswordEmpty.tr
        : !regex.hasMatch(value)
            ? keyInvalidPassword.tr
            : null;
  }

  static String? validatePassword(String value,{message}) {
    var pattern =
        r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\£&*~]).{8,}$';
    RegExp regExp = RegExp(pattern);
    if (value.isEmpty) {
      return '${keyPasswordCannotEmpty.tr}';
    } else if (value.length < 8) {
      return keyPasswordContain.tr;
    } else if (!regExp.hasMatch(value)) {
      return keyPasswordSecure.tr;
    }
    return null;
  }
  static String? validateCurrentPassword(String value) {

    if (value.isEmpty) {
      return "Old Password can't be empty";
    }
    return null;
  }

  static String? fieldChecker({required value, required message}) {
    if (value.toString().trim().isEmpty) {
      return "$message $strCannotBeEmpty";
    }
    return null;
  }

  static String? validatPassword(
      {String? value, String? valueMessage, bool isSecure = true}) {
    var pattern =
        r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$';
    RegExp regExp = RegExp(pattern);
    if (value!.isEmpty) {
      return valueMessage ?? keyPasswordCannotEmpty.tr;
    } else if (value.length < 8) {
      return !isSecure ? null : keyPasswordContain.tr;
    } else if (!regExp.hasMatch(value)) {
      return !isSecure ? null : keyPasswordSecure.tr;
    }
    return null;
  }

  static String? validateConfirmPasswordMatch(
      {String? value,
      String? password,
      String? message,
      String? valueMessage}) {
    if (value!.isEmpty) {
      return valueMessage ?? keyConfirmPasswordEmpty.tr;
    }
    // else if (value.length < 8) {
    //   return "New Password must contains at least 8 characters.";
    // }
    else if (value != password) {
      return message ?? keyPasswordConfirmPasswordEmpty.tr;
    }
    return null;
  }

  static String? validatePhoneNumber(String value, Country? selectedCountry) {
    if (value == '') {
      return keyMobileEmpty.tr;
    } else if (selectedCountry != null) {
      if (value.length < selectedCountry.minLength) {
        return keyInvalidPhoneNumber.tr;
      }
    } else if (!GetUtils.isPhoneNumber(value.trim())) {
      return keyInvalidPhoneNumber.tr;
    }
    return null;
  }

  static String? validateNewPassword(String value) {
    var pattern =
        r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$';
    RegExp regExp = RegExp(pattern);
    if (value.isEmpty) {
      return keyNewPassword.tr;
    } else if (value.length < 8) {
      return keyPasswordCharacter.tr;
    } else if (!regExp.hasMatch(value)) {
      return keyPasswordSecure.tr;
    }
    return null;
  }

  static String? validateChangePassword(String value) {
    var pattern =
        r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$';
    RegExp regExp = RegExp(pattern);
    if (value.isEmpty) {
      return keyPasswordChange.tr;
    } else if (value.length < 8) {
      return keyPasswordCharacter.tr;
    } else if (!regExp.hasMatch(value)) {
      return keyPasswordSecure.tr;
    }
    return null;
  }

  static String? validateConfirmNewPasswordMatch(
      {String? value, String? password}) {
    if (value!.isEmpty) {
      return keyConfirmPasswordEmpty.tr;
    } else if (value != password) {
      return keyPasswordConfirmPasswordEmpty.tr;
    }
    return null;
  }

  static String? validateOldPasswordMatch({String? value, String? password}) {
    if (value!.isEmpty) {
      return keyOldPassword.tr;
    }
    return null;
  }
}

class EmailValidator {
  static String? validateEmail(String value) {
    if (value.isEmpty) {
      return "Email can't be empty";
    } else if (!GetUtils.isEmail(value.trim())) {
      return 'Please enter a valid email';
    }

    final domain = value.trim().split('@').last;
    final domainName = domain.split('.').first;

    if (!RegExp(r'^[a-zA-Z]+$').hasMatch(domainName)) {
      return 'Email domain must contain only letters';
    }

    return null; // Valid email
  }
}

class EmailValidatorDomain {
  static String? validateDomain(String value) {
    if (value.isEmpty) {
      return "Email can't be empty";
    } else if (!GetUtils.isEmail(value.trim())) {
      return 'Please enter a valid email';
    }

    final domain = value.trim().split('@').last;
    final domainName = domain.split('.').first;

    if (!RegExp(r'^[a-zA-Z]+$').hasMatch(domainName)) {
      return 'Email domain must contain only letters';
    }

    return null; // Valid email
  }
}

String? validateEmailMethod(String value) {
  final bool emailValid =
      RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
          .hasMatch(value);
  if (value.toString().trim().isEmpty) {
    return "${keyEmailEmpty.tr}";
  } else if (value.isEmpty) {
    return keyEmailEmpty.tr;
  } else if (!emailValid) {
    return keyValidEmail.tr;
  }
  return null;
}
/*================================================== Phone Number Validator ===================================================*/

class PhoneNumberValidate {
  static String? validatePhoneNumber(String value, Country? selectedCountry) {
    if (value == '') {
      return keyMobileNumberEmpty.tr;
    } else if (selectedCountry != null) {
      if (value.length < selectedCountry.minLength) {
        return keyMobileNumberEmptyDigit.tr;
      }
    } else if (!GetUtils.isPhoneNumber(value.trim())) {
      return keyMobileNumberEmptyDigit.tr;
    } else {}
    return null;
  }
}

validateEmptySpace(
  String value,
  TextEditingController controllerName,
) {
  if (value.isNotEmpty) {
    if (value[0] == " ") {
      controllerName.text = value.trimLeft();
    }
  }
}

class FieldChecker {
  static String? fieldChecker({
    String? value,
    message,
  }) {
    if (value == null || value.toString().trim().isEmpty) {
      return "$message ${keyCannotEmpty.tr}";
    }
    return null;
  }
}
