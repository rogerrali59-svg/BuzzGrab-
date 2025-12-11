import 'package:buzzgrab/app/data/remote_service/network/tbase_controller.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
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
  var dob = Rxn<DateTime>();
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

  TextEditingController fullNameController =
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
    if(kDebugMode){
      passwordController.text='Admin@123';
    }
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
        'fullName': fullNameController.text.trim(),
        'email': emailController.text.trim(),
        'mobile': phoneController.text.trim(),
        'countryCode': '+${selectedCountry.value.dialCode}',
        'IOSCode': '${selectedCountry.value.code}',
        'dob': DateFormat('MM-dd-yyyy').format(dob.value!),
        'gender': selectedGender.value=="Male"?MALE:selectedGender.value=='Female'?FEMALE:OTHER,
        'roleId': USER,
        'password': passwordController.text.trim(),
        'device_type': ANDROID,
        'device_token': '${deviceToken ?? 1212}' ?? "321",
        'device_name': '$deviceName',
      };

      debugPrint("request_payload ====>${request}");

      await DioClient()
          .post('auth/signup',
              data: request, skipAuth: true)
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
            error, stackTrace, 'auth/signup');
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

}
