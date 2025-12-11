import 'package:intl_phone_field/countries.dart';
import 'package:alcoholdeliverydriver/app/modules/authentication/model/signup_response_model.dart';
import 'package:alcoholdeliverydriver/export.dart';

import '../../../../main.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../../data/remote_service/network/tbase_controller.dart';

class ContactUsController extends TbaseController {
  final GlobalKey<FormState> contactFormGlobalKey = GlobalKey<FormState>();
  TextEditingController fullNameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController codeController = TextEditingController();
  TextEditingController messageController = TextEditingController();
  TextEditingController mobileNumberController = TextEditingController();
  TextEditingController countryController = TextEditingController();
  FocusNode mobileNumberFocusNode = FocusNode();
  Rx<UserResponseModel> userResponseModel = UserResponseModel().obs;
  PreferenceManger preferenceManger = PreferenceManger();

  Rx<Country> selectedCountry = Country(
    name: "United States",
    flag: "🇺🇸",
    code: "US",
    dialCode: "1",
    minLength: 10,
    maxLength: 10,
    nameTranslations: {},
  ).obs;

  @override
  void onReady() {
    getSavedRememberData();
    super.onReady();
  }

  getSavedRememberData() async {
    userResponseModel.value = (await preferenceManger.getSavedLoginData())!;
    fullNameController.text =
        "${userResponseModel.value.data?.fullName.toString()}".trim();
    emailController.text = userResponseModel.value.data?.email ?? '';
    countries.forEach((element) {
      // if (element.dialCode == userResponseModel.value.detail?..toString().replaceFirst('+', '')) {
      //   selectedCountry.value = element;
      // }
    });
  }

  hitContactUsApi() async {
    customLoader.show(Get.overlayContext!);
    try {
      var requestModal = {
        'fullName': fullNameController.text.trim(),
        "email": emailController.text.trim().toString(),
        "phoneNumber": mobileNumberController.text.trim().toString(),
        "countryCode": selectedCountry.value.dialCode,
        // "country_iso_code": selectedCountry.value.code,
        "message": messageController.text.toString()
      };
      final response = DioClient().post(
        "/contactUs/add",
        data: FormData.fromMap(requestModal),
        skipAuth: false,
      );
      MessageResponseModel messageResponseModel =
          MessageResponseModel.fromJson(await response);
      Get.offAllNamed(AppRoutes.mainScreen);
      toast(messageResponseModel.message);
      customLoader.hide();
    } catch (e, str) {
      customLoader.hide();
      Future.error(
          NetworkExceptions.getDioException(e, str, "api/contact-us-api/"));
    }
  }
}
