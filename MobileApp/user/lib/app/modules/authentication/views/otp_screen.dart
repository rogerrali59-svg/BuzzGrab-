import 'package:buzzgrab/app/modules/authentication/controllers/otp_controller.dart';
import 'package:pinput/pinput.dart';

import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';

class OtpScreen extends GetView<OtpController> {
  final controller = Get.put(OtpController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: CustomAppBar(
          onTap: () {
            if (controller.isLogin.value == true) {
              Get.offAllNamed(AppRoutes.logIn);
            } else {
              Get.back(result: true);
            }
          },
        ),
        body: _body());
  }

  _body() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              SizedBox(height: height_15),
              TextView(
                text: "Verify Mobile Number",
                textAlign: TextAlign.start,
                textStyle: TextStyle(
                  fontSize: font_18,
                  fontWeight: FontWeight.bold,
                ),
              ),

              SizedBox(height: height_10),

              TextView(
                textAlign: TextAlign.start,
                text: "We've sent a 6-digit OTP to ${controller.email}",
                textStyle: TextStyle(fontSize: font_14),
              ),

              otpBox().paddingOnly(top: margin_20,bottom: margin_20),
              MaterialButtonWidget(
                borderColor: Colors.transparent,
                buttonText: "Verify OTP",
                buttonColor: colorAppColor,
                buttonRadius: radius_10,
                onPressed: () {
                  //

                  if (controller.otpTextController.text.isNotEmpty) {
                    if (controller.otpTextController.text.length < 4) {
                      toast(keyInvalidOTP.tr);
                    } else {
                      // Get.toNamed(AppRoutes.home);
                      controller.hitVerifyForgotOtp();
                    }
                  } else {
                    toast(keyOTPBlank.tr);
                  }

                  // showVerificationDialog();
                },
              ),
              SizedBox(
                height: height_20,
              ),
              _resend(),
              SizedBox(
                height: height_10,
              ),
            ],
          ).paddingSymmetric(horizontal: margin_15), // 👈 Add padding
        ),

      ],
    ).paddingOnly(left: margin_10, right: margin_10, bottom: margin_15);
  }

  Widget otpBox() => Pinput(
    length: 6, // 🔥 changed to 6 digits
    controller: controller.otpTextController,
    focusNode: controller.otpFocusNode,
    pinContentAlignment: Alignment.center,
    mainAxisAlignment: MainAxisAlignment.spaceBetween, // 🔥 spreads boxes full width
    inputFormatters: [OtpInputFormatter()],

    // ---------- INACTIVE BOX ----------
    defaultPinTheme: PinTheme(
      width: Get.width,   //🔥 automatically full-width equally spaced
      height: 50,
      textStyle: textStyleBody1().copyWith(
        fontFamily: "Inter",
        fontSize: font_16,
        color: Colors.black,
      ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: Colors.grey.shade300,
          width: 1,
        ),
      ),
    ),

    // ---------- FOCUSED BOX ----------
    focusedPinTheme: PinTheme(
      width: Get.width,
      height: 50,
      textStyle: textStyleBody1().copyWith(
        fontFamily: "Inter",
        fontSize: font_16,
        color: Colors.black,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: colorAppColor, // your primary color
          width: 2,
        ),
      ),
    ),

    // ---------- SUBMITTED BOX ----------
    submittedPinTheme: PinTheme(
      width: Get.width,
      height: 50,
      textStyle: textStyleBody1().copyWith(
        fontFamily: "Inter",
        fontSize: font_16,
        color: Colors.black,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: colorAppColor,
          width: 2,
        ),
      ),
    ),

    hapticFeedbackType: HapticFeedbackType.lightImpact,

    onCompleted: (pin) {
      controller.otpTextController.text = pin;
    },
  );

  _resend() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextView(
          text: "Didn't receive the code? ",
          textStyle: textStyleBody1().copyWith(
              color: Colors.black, fontSize: font_14,),
        ),
        Obx(() => controller.start.value == 0
            ? GestureDetector(
                onTap: () {
                  controller.hitUserResendOtp();
                  // if (controller.isForgot == true) {
                  //   controller.hitForgotPasswordResendOtp();
                  // } else {
                  //   controller.hitUserResendOtp();
                  // }
                },
                child: Text(
                  "Resend Code",
                  style: TextStyle(
                    decorationColor: Colors.black,
                    color: colorAppColor,
                    fontSize: font_14,
                    fontWeight: FontWeight.w400,
                    fontFamily: "Inter",
                  ),
                ),
              )
            : Align(
                alignment: Alignment.centerLeft,
                child: Obx(
                  () => controller.start.value == 0
                      ? emptySizeBox()
                      : Text(
                          controller.start.value.toString() != "0"
                              ? '00:${controller.start.value} sec '
                              : '',
                          style: textStyleBody1().copyWith(
                            color: Colors.black,
                            fontSize: font_14,
                            fontFamily: "Inter",
                          )),
                ),
              ).paddingOnly(top: margin_1))
      ],
    ).paddingOnly(top: margin_10);
  }
}

class OtpInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    final newText = newValue.text;
    if (newText.length > 6) {
      // 👈 Allow up to 6 characters
      return TextEditingValue(
        text: newText.substring(0, 6),
        selection: TextSelection.collapsed(offset: 6),
      );
    }
    if (newText.contains(RegExp(r'[^0-9]'))) {
      return TextEditingValue(
        text: newText.replaceAll(RegExp(r'[^0-9]'), ''),
        selection: newValue.selection,
      );
    }
    return newValue;
  }
}
