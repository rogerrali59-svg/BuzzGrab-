import 'package:alcoholdeliverydriver/app/core/translations/local_keys.dart';
import 'package:alcoholdeliverydriver/export.dart';
import 'package:alcoholdeliverydriver/main.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl_phone_field/countries.dart';

import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../home/widget/header_widget.dart';
import '../../splash_module/controllers/splash_controller.dart';
import '../model/signup_response_model.dart';

class EditProfileController extends GetxController {
  TextEditingController emailController =
      TextEditingController(text: kDebugMode ? "satta@toxsl.in" : '');
  TextEditingController phoneController =
      TextEditingController(text: kDebugMode ? "88888888" : '');
  TextEditingController firstNameController =
      TextEditingController(text: kDebugMode ? "Sam" : "");
  TextEditingController lastNameController =
      TextEditingController(text: kDebugMode ? "David" : "");
  TextEditingController countryController = TextEditingController();

  TextEditingController passwordController = TextEditingController();
  TextEditingController confPasswordController = TextEditingController();
  TextEditingController drivingLicenseController = TextEditingController();
  TextEditingController insuranceCertificateController =
      TextEditingController();
  TextEditingController registrationNumberController = TextEditingController();
  TextEditingController registrationCertController = TextEditingController();

  TextEditingController accountNoTextController = TextEditingController();
  TextEditingController bankNameTextController = TextEditingController();
  TextEditingController routingNumberController = TextEditingController();
  final formKey = GlobalKey<FormState>();

  showOrHidePasswordVisibility() {
    viewPassword.value = !viewPassword.value;
    update();
  }

  showOrHideConfPasswordVisibility() {
    confirmViewPassword.value = !confirmViewPassword.value;
    update();
  }

  File? insuranceCertificateFile;
  File? registrationNoFile;
  File? drivingLicenseFile;
  RxBool viewPassword = true.obs;
  RxBool confirmViewPassword = true.obs;

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

  Rx<Country> selectedCountry = Country(
    name: "United States",
    flag: "🇺🇸",
    code: "US",
    dialCode: "1",
    minLength: 10,
    maxLength: 10,
    nameTranslations: {},
  ).obs;
  FocusNode emailFocusNode = FocusNode();
  FocusNode phoneFocusNode = FocusNode();
  FocusNode firstNameFocusNode = FocusNode();
  FocusNode lastNameFocusNode = FocusNode();
  FocusNode registrationFocusNode = FocusNode();
  FocusNode accountNoFocusNode = FocusNode();
  FocusNode bankNameFocusNode = FocusNode();
  FocusNode routingNumberFocusNode = FocusNode();
  FocusNode passwordFocusNode = FocusNode();

  RxString profileImage = ''.obs;
  RxString oldProfileImage = ''.obs;

  updateImageFile(Future<PickedFile?> imagePath) async {
    PickedFile? file = await imagePath;
    if (file != null) {
      profileImage.value = file.path;
      oldProfileImage.value = file.path;
    }
  }

  @override
  void onInit() {
    getArgs();
    hitCheckApi();
    super.onInit();
  }

  RxBool fromLogin = false.obs;

  getArgs() {
    if (Get.arguments != null) {
      fromLogin.value = Get.arguments['fromLogin'] ?? false;
    }
  }

  void hitCheckApi() async {
    try {
      final response = DioClient().get('/auth/profile', skipAuth: false);
      userResponseModel = UserResponseModel.fromJson(await response);
      if (userResponseModel.data != null) {
        signUpData.value = userResponseModel.data ?? UserData();
        getData();
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
      Future.error(
          NetworkExceptions.getDioException(e, str, "/api/check-user-api/"));
      toast(NetworkExceptions.messageData);
    }
  }

  getData() {
    profileImage.value = signUpData.value.profileImg ?? '';
    firstNameController.text = signUpData.value.fullName ?? '';
    lastNameController.text = signUpData.value.lastName ?? '';
    emailController.text = signUpData.value.email ?? '';
    phoneController.text = signUpData.value.mobile ?? '';
    getCountry();
    // drivingLicenseController.text = signUpData.value.drivingLicence ?? '';
    registrationCertController.text =
        signUpData.value.vehicleRegistrationImg ?? '';
    insuranceCertificateController.text = signUpData.value.insuranceImg ?? '';
    drivingLicenseController.text = signUpData.value.vehicleImg ?? '';

    // accountNoTextController.text =
    //     signUpData.value.bankDetails?.accountNumber ?? '';
    // bankNameTextController.text = signUpData.value.bankDetails?.bankName ?? '';
    // routingNumberController.text =
    //     signUpData.value.bankDetails?.routingNumber ?? '';
    // registrationNumberController.text =
    //     signUpData.value.vehicleDetails?.registrationNumber ?? '';
  }

  getCountry() {
    countries.forEach((e) {
      if ('+${e.dialCode}' == signUpData.value.countryCode) {
        selectedCountry.value = e;
      }
    });
  }

  updateProfile() async {
    try {
      customLoader.show(Get.context);
      final request = {
        'fullName': firstNameController.text.trim(),

        if (oldProfileImage.value.isNotEmpty)
          'profileImg': await convertToMultipart(oldProfileImage.value),

        'email': emailController.text.trim(),
        'mobile': phoneController.text.trim(),
        'country_code': '+${selectedCountry.value.dialCode}',
        'country_iso_code': '${selectedCountry.value.code}',

        if (drivingLicenseFile != null)
          'vehicleImg': await convertToMultipart(drivingLicenseFile!.path),
        if (registrationNoFile != null)
          'vehicleRegistrationImg':
              await convertToMultipart(registrationNoFile!.path),
        if (insuranceCertificateFile != null)
          'insuranceImg':
              await convertToMultipart(insuranceCertificateFile!.path),

        // 'account_number': accountNoTextController.text.trim(),
        // 'routing_number': routingNumberController.text.trim(),
        // 'registration_number': registrationNumberController.text.trim(),
        // 'bank_name': bankNameTextController.text.trim(),
        // 'device_type': 1 ?? getDeviceType(),
        // 'device_token': '${deviceToken ?? 1212}' ?? "321",
        // 'device_name': '$deviceName',
      };

      debugPrint("request_payloadd ====>${request}");

      await DioClient()
          .put('/auth/editProfile',
              data: FormData.fromMap(request),
          options: Options(
            headers: {
              "Content-Type": "multipart/form-data",  // <<< REQUIRED
            },
          ),
          skipAuth: false)
          .then((value) {
        if (value != null) {
          UserResponseModel userResponseModel =
              UserResponseModel.fromJson(value);
          signUpData.value = userResponseModel.data ?? UserData();
          saveDataToLocalStorage(userResponseModel);
          hitCheckApi();
          toast('${userResponseModel.message} ');
          customLoader.hide();
          Get.toNamed(AppRoutes.mainScreen);
          // Get.toNamed(AppRoutes.logIn);
        }
      }).onError((error, stackTrace) {
        customLoader.hide();
        print('stack $stackTrace');

        return NetworkExceptions.getDioException(
            error, stackTrace, '/auth/editProfile');
        toast(NetworkExceptions.messageData);
      });
    } catch (e, st) {
      print('Error--$e');
      print('Error--$st');
      // return NetworkExceptions.getDioException(e, st, '/api/user-signup-api/');
    }
  }

  saveDataToLocalStorage(UserResponseModel value) {
    PreferenceManger().saveRegisterData(value);
    signUpData.value = value.data ?? UserData();
    PreferenceManger().saveAuthToken(value.data?.token);
  }
}
