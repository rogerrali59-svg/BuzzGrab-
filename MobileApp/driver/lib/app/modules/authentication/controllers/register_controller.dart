import 'package:alcoholdeliverydriver/app/data/remote_service/network/tbase_controller.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl_phone_field/countries.dart';

import '../../../../../export.dart';
import '../../../../main.dart';
import '../../../core/translations/local_keys.dart';
import '../../../core/values/app_global_values.dart';
import '../../../core/values/route_arguments.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../splash_module/controllers/splash_controller.dart';
import '../model/signup_response_model.dart';

class RegisterController extends TbaseController {
  RxInt currentPageIndex = 0.obs;

  TextEditingController emailController =
      TextEditingController(text: kDebugMode ? "satta@toxsl.in" : '');
  TextEditingController phoneController =
      TextEditingController(text: kDebugMode ? "88888888" : '');
  TextEditingController addressController = TextEditingController();
  TextEditingController countryController = TextEditingController();
  TextEditingController countryISOController = TextEditingController();
  TextEditingController registrationCertController = TextEditingController();
  TextEditingController insuranceCertificateController =
      TextEditingController();
  TextEditingController drivingLicenseController = TextEditingController();

  FocusNode emailFocusNode = FocusNode();
  FocusNode addressFocusNode = FocusNode();
  FocusNode phoneFocusNode = FocusNode();

  final firstStepKey = GlobalKey<FormState>();
  final secondStepKey = GlobalKey<FormState>();
  final thirdStepKey = GlobalKey<FormState>();
  final fourthStepKey = GlobalKey<FormState>();
  RxString profileImage = "".obs;
  var contactNumber, countryCode, email, profile;
  RxBool isFromOtp = false.obs;
  RxBool isSocialLogin = false.obs;
  var lat, lng;
  var location;
  RxBool isLogin = false.obs;
  var selectedGender = ''.obs;
  var selectedDate = DateTime.now().obs;
  final genders = ['MALE', 'FEMALE', 'OTHER'];

  Rx<Country> selectedCountry = Country(
    name: "United States",
    flag: "🇺🇸",
    code: "US",
    dialCode: "1",
    minLength: 10,
    maxLength: 10,
    nameTranslations: {},
  ).obs;

  File? insuranceCertificateFile;
  File? registrationNoFile;
  File? drivingLicenseFile;

  TextEditingController firstNameController =
      TextEditingController(text: kDebugMode ? "Sam" : "");
  TextEditingController lastNameNameController =
      TextEditingController(text: kDebugMode ? "David" : "");
  TextEditingController accountNoTextController = TextEditingController();
  TextEditingController bankNameTextController = TextEditingController();
  TextEditingController phnNoController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confPasswordController = TextEditingController();
  TextEditingController stateController = TextEditingController();
  TextEditingController registrationNumberController = TextEditingController();
  TextEditingController cardNumberController = TextEditingController();
  TextEditingController routingNumberController = TextEditingController();

  FocusNode firstNameFocusNode = FocusNode();
  FocusNode lastNameFocusNode = FocusNode();
  FocusNode bankNameFocusNode = FocusNode();
  FocusNode accountNoFocusNode = FocusNode();
  FocusNode mobileFocusNode = FocusNode();
  FocusNode confirmPasswordFocusNode = FocusNode();
  FocusNode passwordFocusNode = FocusNode();
  FocusNode registrationFocusNode = FocusNode();
  FocusNode cardNumberFocusNode = FocusNode();
  FocusNode routingNumberFocusNode = FocusNode();
  RxBool viewPassword = true.obs;
  RxBool confirmViewPassword = true.obs;
  RxBool agree = false.obs;

  RxInt selectedIndex = 0.obs;

  void loginWithGoogle() {
    print('Google login tapped');
  }

  void loginWithApple() {
    print('Apple login tapped');
  }

  onInit() {
    getArgs();
    super.onInit();
  }

  RxBool editProfile = false.obs;

  getArgs() {
    if (Get.arguments != null) {
      editProfile.value = Get.arguments['editProfile'] ?? false;
    }
  }

  GoogleSignInAccount? googleSignInAccount;

  showOrHidePasswordVisibility() {
    viewPassword.value = !viewPassword.value;
    update();
  }

  showOrHideConfPasswordVisibility() {
    confirmViewPassword.value = !confirmViewPassword.value;
    update();
  }

  Future pickFile({
    required Function(File) onFilePicked,
  }) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: [
        'jpg', 'jpeg', 'png', // images
        'pdf', // pdf
        'doc', 'docx' // word documents
      ],
    );

    if (result != null && result.files.single.path != null) {
      final file = File(result.files.single.path!);
      onFilePicked(file);
    }
  }

  Rx<PickedFile?> pickedProfileImage = Rxn();

  updateImageFile(Future<PickedFile?> imagePath) async {
    PickedFile? file = await imagePath;
    if (file != null) {
      pickedProfileImage.value = file;
      profileImage.value = file.path;
    }
  }

  void pickDate(BuildContext context) async {
    final now = DateTime.now();
    final lastDate =
        DateTime(now.year - 15, now.month, now.day); // 15 years ago from today

    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: lastDate, // start at 15 years ago
      firstDate: DateTime(1900), // earliest date selectable (adjust if needed)
      lastDate: lastDate, // latest selectable date is 15 years ago
    );

    if (picked != null) {
      selectedDate.value = picked;
    }
  }

  bool validateCurrentStep() {
    int currentStep = currentPageIndex.value;

    switch (currentStep) {
      case 0:
        return firstStepKey.currentState?.validate() ?? false;

      case 1:
        final isFormValid = secondStepKey.currentState?.validate() ?? false;
        final hasRegistration = registrationNoFile != null;
        final hasDrivingLicense = drivingLicenseFile != null;
        final hasInsurance = insuranceCertificateFile != null;

        if (!hasDrivingLicense) toast("Please upload Driving License");
        if (!hasRegistration)
          toast("Please upload Registration Certificate");
        else if (!hasInsurance) toast("Please upload Insurance Certificate");

        return isFormValid &&
            hasDrivingLicense &&
            hasRegistration &&
            hasInsurance;

      case 2:
        final isFormValid = thirdStepKey.currentState?.validate() ?? false;
        final hasRegistration = registrationNoFile != null;
        final hasInsurance = insuranceCertificateFile != null;

        if (!hasRegistration)
          toast("Please upload Registration Certificate");
        else if (!hasInsurance) toast("Please upload Insurance Certificate");

        return isFormValid && hasRegistration && hasInsurance;

      case 3:
        final isFormValid = fourthStepKey.currentState?.validate() ?? false;

        return isFormValid;

      default:
        return false;
    }
  }

  bool validateEditProfileCurrentStep() {
    final currentStep = currentPageIndex.value;

    switch (currentStep) {
      case 0:
        return firstStepKey.currentState?.validate() ?? false;

      case 1:
        final isFormValid = secondStepKey.currentState?.validate() ?? false;

        if (selectedGender.value.isEmpty) {
          toast("Please select gender");
          return false;
        }

        if (selectedDate.value == null) {
          toast("Please pick your date of birth");
          return false;
        }

        if (profileImage.value.isEmpty) {
          toast("Please upload a profile image");
          return false;
        }

        return isFormValid;

      case 2:
        final isFormValid = thirdStepKey.currentState?.validate() ?? false;

        if (registrationCertController.text.isEmpty) {
          toast("Please upload Registration Certificate");
          return false;
        }

        if (insuranceCertificateController.text.isEmpty) {
          toast("Please upload Insurance Certificate");
          return false;
        }

        return isFormValid;

      case 3:
        final isFormValid = fourthStepKey.currentState?.validate() ?? false;

        if (drivingLicenseController.text.isEmpty) {
          toast("Please upload Driving License");
          return false;
        }

        return isFormValid;

      default:
        return false;
    }
  }

  updateGenderCall({gender = ""}) {
    debugPrint("gendergendergender =<>${gender}");
    if (gender == "0") {
      selectedGender.value = "MALE";
    } else if (gender == "1") {
      selectedGender.value = "FEMALE";
    } else {
      selectedGender.value = "OTHER";
    }
    selectedGender.refresh();
  }

  /// SignUp Api
  callSignUpApi() async {
    try {
      customLoader.show(Get.context);
      final request = {
        'first_name': firstNameController.text.trim(),
        'last_name': lastNameNameController.text.trim(),
        if (pickedProfileImage.value != null)
          'profile_pic':
              await convertToMultipart(pickedProfileImage.value!.path),
        'email': emailController.text.trim(),
        'mobile_no': phoneController.text.trim(),
        'country_code': '+${selectedCountry.value.dialCode}',
        'country_iso_code': '${selectedCountry.value.code}',
        if (drivingLicenseFile != null)
          'driving_licence': await convertToMultipart(drivingLicenseFile!.path),
        if (registrationNoFile != null)
          'registration_certificate':
              await convertToMultipart(registrationNoFile!.path),
        if (insuranceCertificateFile != null)
          'insurance': await convertToMultipart(insuranceCertificateFile!.path),
        'account_number': accountNoTextController.text.trim(),
        'routing_number': routingNumberController.text.trim(),
        'registration_number': registrationNumberController.text.trim(),
        'bank_name': bankNameTextController.text.trim(),
        'password': passwordController.text.trim(),
        'confirm_password': confPasswordController.text.trim(),
        'device_type': 1 ?? getDeviceType(),
        'device_token': '${deviceToken ?? 1212}' ?? "321",
        'device_name': '$deviceName',
      };

      debugPrint("request_payload ====>${request}");

      await DioClient()
          .post('/api/user-signup-api/',
              data: FormData.fromMap(request), skipAuth: true)
          .then((value) {
        if (value != null) {
          UserResponseModel userResponseModel =
              UserResponseModel.fromJson(value);
          signUpData.value = userResponseModel.data ?? UserData();
          saveDataToLocalStorage(userResponseModel);
          toast('${userResponseModel.message} ');
          customLoader.hide();
          Get.toNamed(AppRoutes.otpScreen, arguments: {
            'isLogin': true,
            'email': emailController.text.trim(),
          });
          // Get.toNamed(AppRoutes.logIn);
        }
      }).onError((error, stackTrace) {
        customLoader.hide();
        print('stack $stackTrace');

        return NetworkExceptions.getDioException(
            error, stackTrace, '/api/user-signup-api/');
        toast(NetworkExceptions.messageData);
      });
    } catch (e, st) {
      print('Error--$e');
      print('Error--$st');
      // return NetworkExceptions.getDioException(e, st, '/api/user-signup-api/');
    }
  }

  String getFullPhoneNumber() {
    String dialCode = selectedCountry.value.dialCode;
    String phone = phnNoController.text.trim();

    if (!dialCode.startsWith('+')) {
      dialCode = '+$dialCode';
    }

    return '$dialCode $phone';
  }

  saveDataToLocalStorage(UserResponseModel value) {
    PreferenceManger().saveRegisterData(value);
    signUpData.value = value.data ?? UserData();
    PreferenceManger().saveAuthToken(value.data?.token);
  }

  void hitRegisterUserCall() {}

  void handlePage() {
    if (currentPageIndex.value == 0) {
      if (pickedProfileImage.value == null) {
        toast("Please select profile pic first.");
        return;
      } else if (firstStepKey.currentState?.validate() == true) {
        currentPageIndex.value++;
      } else {
        debugPrint("Not Validated ===>${currentPageIndex.value}");
      }
    } else if (currentPageIndex.value == 1) {
      // SECOND PAGE

      if (drivingLicenseFile == null) {
        toast("Please select driving license.");
        return;
      } else if (registrationNoFile == null) {
        toast("Please select vehicle registration.");
        return;
      } else if (secondStepKey.currentState?.validate() == true) {
        currentPageIndex.value++;
      } else {
        debugPrint("Not Validated ===>${currentPageIndex.value}");
      }
    } else if (currentPageIndex.value == 2) {
      // PAGE THIRD
      if (thirdStepKey.currentState?.validate() == true) {
        currentPageIndex.value++;
      }
    } else if (currentPageIndex.value == 3) {
      if (fourthStepKey.currentState?.validate() == true) {
        callSignUpApi();
      }
    }
  }
}
