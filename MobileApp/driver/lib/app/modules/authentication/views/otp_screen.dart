import 'package:alcoholdeliverydriver/app/modules/authentication/controllers/otp_controller.dart';
import 'package:pinput/pinput.dart';

import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';

class OtpScreen extends GetView<OtpController> {
  final controller = Get.put(OtpController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: CustomAppBar(
          titleColor: colorAppText,
          appBarTitleText: "OTP",
          centerTitle: true,
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
                text: "Verify Email",
                textAlign: TextAlign.start,
                textStyle: TextStyle(
                  fontSize: font_16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextView(
                text: "Enter OTP sent on your email id",
                textStyle: TextStyle(fontSize: font_14),
              ),
              otpBox().paddingOnly(top: margin_20, right: margin_50),
            ],
          ).paddingSymmetric(horizontal: margin_15), // 👈 Add padding
        ),
        Column(
          children: [
            _resend(),
            SizedBox(
              height: height_10,
            ),
            MaterialButtonWidget(
              borderColor: Colors.transparent,
              buttonText: "Verify OTP",
              buttonColor: colorAppColor,
              onPressed: () {
                if (controller.otpTextController.text.isNotEmpty) {
                  if (controller.otpTextController.text.length < 6) {
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
          ],
        )
      ],
    ).paddingOnly(left: margin_15, right: margin_15, bottom: margin_15);
  }

  Widget otpBox() => Pinput(
        length: 6,
        controller: controller.otpTextController,
        focusNode: controller.otpFocusNode,
        pinContentAlignment: Alignment.center,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        inputFormatters: [OtpInputFormatter()],
        defaultPinTheme: PinTheme(
          width: 55, // or height_50
          height: 55,
          textStyle: textStyleBody1().copyWith(
            fontFamily: "Inter",
            fontSize: font_16,
            color: Colors.black,
          ),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: Colors.grey, // Inactive color
                width: 1.5,
              ),
            ),
          ),
        ),
        focusedPinTheme: PinTheme(
          width: 55,
          height: 55,
          textStyle: textStyleBody1().copyWith(
            fontFamily: "Inter",
            fontSize: font_16,
            color: Colors.black,
          ),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: colorAppColor, // Active/focused color
                width: 2,
              ),
            ),
          ),
        ),
        submittedPinTheme: PinTheme(
          width: 55,
          height: 55,
          textStyle: textStyleBody1().copyWith(
            fontFamily: "Inter",
            fontSize: font_16,
            color: Colors.black,
          ),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: colorAppColor,
                width: 2,
              ),
            ),
          ),
        ),
        hapticFeedbackType: HapticFeedbackType.lightImpact,
        onCompleted: (pin) {
          controller.otpTextController.text = pin;
        },
        onChanged: (value) {},
      );

  _resend() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextView(
          text: "Send code again ",
          textStyle: textStyleBody1().copyWith(
              color: Colors.black, fontSize: font_14, fontFamily: "Inter"),
        ),
        Obx(() => controller.start.value == 0
            ? GestureDetector(
                onTap: () {
                  controller.hitForgotPasswordResendOtp();
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
