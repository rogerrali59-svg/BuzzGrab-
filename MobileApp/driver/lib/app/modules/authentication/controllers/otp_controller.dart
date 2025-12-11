import '../../../../export.dart';
import '../../../../main.dart';
import '../../../core/values/app_global_values.dart';
import '../../../core/values/route_arguments.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../model/signup_response_model.dart';

class OtpController extends TbaseController {
  final GlobalKey<FormState> otpVerifyFormGlobalKey = GlobalKey<FormState>();
  TextEditingController otpTextController = TextEditingController();
  FocusNode otpFocusNode = FocusNode();
  RxInt start = 30.obs;
  RxBool hide = false.obs;
  var email, phoneNumber, otp;
  var countryCode;
  RxBool isForgot = false.obs;
  Timer? timer;
  RxBool isLogin = false.obs;
  var mobileNumber;

  RxBool isOTPVerified = false.obs;
  UserResponseModel userResponseModel = UserResponseModel();

  onInit() {
    getArguments();
    startTimer();
    super.onInit();
  }

  getArguments() {
    if (Get.arguments != null) {
      isLogin.value = Get.arguments['isLogin'] ?? false;
      isForgot.value = Get.arguments['isForgot'] ?? false;
      email = Get.arguments['email'] ?? '';
    }
  }

  void showVerificationDialog() {
    // Open the dialog
    Get.dialog(
      AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: Colors.green,
              child: Icon(Icons.check, color: Colors.white, size: 40),
            ),
            SizedBox(height: 20),
            Text(
              'You are in! 👋',
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  fontFamily: "Inter"),
            ),
            SizedBox(height: 10),
            Text(
              'Thanks for verifying your account',
              style: TextStyle(fontFamily: "Inter"),
            ),
          ],
        ),
      ),
      barrierDismissible: false, // Prevent closing by tapping outside
    );
  }

  hitUserResendOtp() async {
    customLoader.show(Get.context);
    try {
      var data = {
        "email": signUpData.value.email ?? "",
      };
      final response = await DioClient()
          .post("api/resend-otp-api/", data: FormData.fromMap(data));
      MessageResponseModel messageResponseModel =
          MessageResponseModel.fromJson(await response);

      debugPrint("ssdsdsdsd===> ${response}");
      customLoader.hide();
      otp = "${response['detail']}";
      otpTextController.text = "";
      start.value = 30;
      start.refresh();
      startTimer();
      toast("${messageResponseModel.message}");
      customLoader.hide();
    } catch (e, str) {
      print("error${e}");
      print("str${str}");
      customLoader.hide();
      Future.error(
          NetworkExceptions.getDioException(e, str, "api/resend-otp-api/"));
      customLoader.hide();
      showInSnackBar(message: NetworkExceptions.messageData);
    }
  }

  hitForgotPasswordResendOtp() async {
    customLoader.show(Get.overlayContext);
    try {
      var data = {
        "email": email ?? "",
      };
      final response = await DioClient().post(
          "/api/forgot-password-resend-otp/",
          data: FormData.fromMap(data));
      MessageResponseModel messageResponseModel =
          MessageResponseModel.fromJson(await response);
      debugPrint("ssdsdsdsd===> ${response}");
      customLoader.hide();
      otp = "${response['detail']}";
      otpTextController.text = "";
      start.value = 30;
      start.refresh();
      startTimer();
      toast("${messageResponseModel.message}");
      customLoader.hide();
    } catch (e, str) {
      print("error${e}");
      print("str${str}");
      customLoader.hide();
      Future.error(NetworkExceptions.getDioException(
          e, str, "api/forgot-password-resend-otp/"));
      customLoader.hide();
      showInSnackBar(message: NetworkExceptions.messageData);
    }
  }

  void startTimer() {
    const oneSec = const Duration(seconds: 1);
    timer = new Timer.periodic(
      oneSec,
      (Timer timer) {
        if (start.value == 0) {
          timer.cancel();
        } else {
          start.value--;
        }
        update();
      },
    );
  }



  hitVerifyForgotOtp() async {
    customLoader.show(Get.overlayContext);
    try {
      var request = {
        "otp": otpTextController.text.trim() ?? "",
        "email": email,
        "mobile_no": '',
      };
      otpTextController.clear();
      final response = await DioClient()

          // .put("/auth/verifyOtp/", data: FormData.fromMap(data),skipAuth: true,
          .put("/auth/verifyOtp/", data: request,skipAuth: true,



      );
      UserResponseModel userResponseModel =
          UserResponseModel.fromJson(await response);
      preferenceManger.saveAuthToken(userResponseModel.data?.token);
      toast(userResponseModel.message);
      if (isForgot.value == true) {
        Get.offNamed(AppRoutes.setNewPassword,
            arguments: { 'email': email});
      } else {
        Get.offAllNamed(AppRoutes.accountSubmitScreen);
      }
      customLoader.hide();
    } catch (e, str) {
      customLoader.hide();
      Future.error(
          NetworkExceptions.getDioException(e, str, "api/auth/verifyOtp"));
      showInSnackBar(message: NetworkExceptions.messageData);
    }
  }
}
