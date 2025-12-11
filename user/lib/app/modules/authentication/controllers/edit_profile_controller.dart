import 'package:buzzgrab/app/core/translations/local_keys.dart';
import 'package:buzzgrab/export.dart';
import 'package:buzzgrab/main.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:intl_phone_field/countries.dart';

import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../home/widget/header_widget.dart';
import '../../splash_module/controllers/splash_controller.dart';
import '../model/signup_response_model.dart';

class EditProfileController extends TbaseController {
  var selectedGender = ''.obs;
  RxBool isLoading = true.obs;
  var selectedDate = DateTime.now().obs;
  final genders = ['MALE', 'FEMALE', 'OTHER'];
  var dob = Rxn<DateTime>();
  TextEditingController emailController =
      TextEditingController();
  TextEditingController phoneController =
      TextEditingController();
  TextEditingController fullNameController =
      TextEditingController();
  TextEditingController lastNameController =
      TextEditingController();
  TextEditingController countryController = TextEditingController();

  TextEditingController passwordController = TextEditingController();

  showOrHidePasswordVisibility() {
    viewPassword.value = !viewPassword.value;
    update();
  }
  RxBool viewPassword = true.obs;


  /// ick Files (images,pdf,doc)
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
  /// Profile image picker
  updateImageFile(Future<PickedFile?> imagePath) async {
    PickedFile? file = await imagePath;
    if (file != null) {
      profileImage.value = file.path;
    }
  }


  /// onInit
  @override
  void onInit() {
    super.onInit();
  }

  /// Call Profile api
  void hitProfileApi() async {
    try {
      final response = DioClient().get('auth/profile', skipAuth: false);
      userResponseModel = UserResponseModel.fromJson(await response);
      if (userResponseModel.data != null) {
        signUpData.value = userResponseModel.data ?? UserData();
        getData();
      }
    } catch (e, str) {
      isLoading.value = false;
      // Get.toNamed(AppRoutes.chooseLanguageScreen);
      return NetworkExceptions.getDioException(e, str, "auth/profile");
      toast(NetworkExceptions.messageData);
    }
  }

  RxBool fromLogin = false.obs;

  getArgs() {
    if (Get.arguments != null) {
      fromLogin.value = Get.arguments['fromLogin'] ?? false;
    }
  }

  
  /// Set User Data
  getData() {
    profileImage.value = signUpData.value.profilePic ?? '';
    fullNameController.text = signUpData.value.fullName ?? '';
    emailController.text = signUpData.value.email ?? '';
    phoneController.text = signUpData.value.mobileNo ?? '';

    getCountry();
    // FIXED DATE PARSING
    dob.value = DateFormat("MM-dd-yyyy").parse(signUpData.value.dob ?? "");

    selectedGender.value = signUpData.value.gender == 1
        ? 'Male'
        : signUpData.value.gender == 2
            ? 'Female'
            : 'Other';
    isLoading.value = false;
  }

  /// Get Country Code 
  getCountry() {
    countries.forEach((e) {
      if ('+${e.dialCode}' == signUpData.value.countryCode) {
        selectedCountry.value = e;
      }
    });
  }

  /// Call Update Profile Api
  updateProfile() async {
    customLoader.show(Get.context);
    final request = {
      'fullName': fullNameController.text.trim(),
      if (profileImage.value.isNotEmpty && !profileImage.value.contains('http'))
        'profileImg': await convertToMultipart(profileImage.value),
      'email': emailController.text.trim(),
      'mobile': phoneController.text.trim(),
      'countryCode': '+${selectedCountry.value.dialCode}',
      'IOSCode': '${selectedCountry.value.code}',
      'gender': selectedGender.value == 'Male'
          ? 1
          : selectedGender.value == 'Female'
              ? 2
              : 3,
      'dob': dob.value
    };

    await dioClient
        .put('auth/editProfile',
            data: FormData.fromMap(request), skipAuth: false)
        .then((value) {
      if (value != null) {
        UserResponseModel userResponseModel = UserResponseModel.fromJson(value);
        signUpData.value = userResponseModel.data ?? UserData();
        saveDataToLocalStorage(userResponseModel);
        customLoader.hide();
        Get.back();
        toast('${userResponseModel.message} ');
      }
    }).onError((error, stackTrace) {
      customLoader.hide();
      print('stack $stackTrace');

      NetworkExceptions.getDioException(error, stackTrace, 'auth/editProfile');
      toast(NetworkExceptions.messageData);
    });
  }

  /// Save Data to Local Storage
  saveDataToLocalStorage(UserResponseModel value) {
    PreferenceManger().saveRegisterData(value);
    signUpData.value = value.data ?? UserData();
    PreferenceManger().saveAuthToken(value.data?.token);
  }

  @override
  void onReady() {
    hitProfileApi();
    super.onReady();
  }
}
