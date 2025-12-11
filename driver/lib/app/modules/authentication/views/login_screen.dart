import 'package:alcoholdeliverydriver/main.dart';

import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../../core/utils/projectutils/validator.dart';
import '../../../core/values/route_arguments.dart';
import '../../../core/widgets/country_picker.dart';

class LoginScreen extends GetView<LoginController> {
  final controller = Get.put(LoginController());

  final formGlobalKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return PopScope(
        canPop: false,
        onPopInvoked: (didPop) async {
          if (didPop) {
            return;
          }
          bool shouldExit = await onBackPressed(context);
          if (shouldExit) {
            exit(0);
          }
        },
        child: Scaffold(
          backgroundColor: Colors.white,
          body: _body(context),
        ));
  }

  _body(context) {
    return SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.only(
            left: margin_15, right: margin_15, bottom: margin_15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: height_55),
            Text(
              'Welcome Back',
              style: TextStyle(
                color: Colors.black,
                fontFamily: 'Inter',
                fontWeight: FontWeight.w600,
                fontSize: font_22,
              ),
            ),
            SizedBox(height: height_10),
            Text(
              'Login to Get Started',
              // keyLoginOrSignUpToProceed.tr,
              style: TextStyle(
                color: Colors.black.withOpacity(0.5),
                fontFamily: FontFamily.inter,
                fontWeight: FontWeight.w400,
                fontSize: font_15,
              ),
            ),
            Form(
              key: formGlobalKey,
              child: Column(
                children: [
                  TextFieldWidget(
                    tvHeading: keyEmail.tr,
                    color: const Color(0xFFF8F8F8),
                    maxLength: 50,
                    textController: controller.emailController,
                    inputAction: TextInputAction.next,
                    labelText: keyEmailID.tr,
                    inputType: TextInputType.emailAddress,
                    validate: (value) => controller.validateEmail(value),
                    focusNode: controller.emailFocusNode,
                  ),
                  Obx(
                    () => TextFieldWidget(
                      tvHeading: keyPassword.tr,
                      hint: keyEnterPassword.tr,
                      hintStyle: TextStyle(color: Colors.black38),
                      obscureText: controller.viewPassword.value,
                      inputFormatter: [
                        FilteringTextInputFormatter.deny(RegExp(r'\s')),
                        FilteringTextInputFormatter.deny(
                          RegExp(
                            r'(\u00a9|\u00ae|[\u2000-\u3300]|'
                            r'\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|'
                            r'\ud83e[\ud000-\udfff])',
                          ),
                        ),
                      ],
                      validate: (value) => controller.validatePassword(value),
                      textController: controller.passwordController,
                      suffixIcon: IconButton(
                        onPressed: controller.showOrHidePasswordVisibility,
                        color: Colors.black,
                        splashColor: Colors.transparent,
                        highlightColor: Colors.transparent,
                        icon: Icon(
                          controller.viewPassword.value
                              ? Icons.visibility_off_outlined
                              : Icons.visibility_outlined,
                          size: font_20,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: height_30),
            Row(
              children: [
                rememberMeWidget(),
                Spacer(),
                TextButton(
                  onPressed: () {
                    Get.toNamed(AppRoutes.forgotPassword);
                  },
                  style: TextButton.styleFrom(
                    padding: EdgeInsets.zero,
                    minimumSize: Size(0, 0),
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: Text(
                    keyForgotPassword.tr,
                    style: TextStyle(
                        color: colorAppColor,
                        fontFamily: FontFamily.inter,
                        fontWeight: FontWeight.w400,
                        fontSize: font_14,
                        decoration: TextDecoration.underline,
                        decorationColor: colorAppColor),
                  ),
                ),
              ],
            ),
            SizedBox(height: height_30),
            ElevatedButton(
              onPressed: () {
                // Get.toNamed(AppRoutes.mainScreen);
                if (formGlobalKey.currentState!.validate()) {
                  controller.callLoginApi();
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: colorAppColor,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(radius_8),
                ),
              ),
              child: Text(
                keyLogin.tr,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: font_14,
                  fontFamily: FontFamily.inter,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            SizedBox(
              height: height_15,
            ),
            // Column(
            //   mainAxisAlignment: MainAxisAlignment.center,
            //   crossAxisAlignment: CrossAxisAlignment.center,
            //   children: [
            //     Text(
            //       keyOr.tr,
            //       style: TextStyle(
            //         color: Colors.black,
            //         fontFamily: FontFamily.inter,
            //         fontWeight: FontWeight.w600,
            //       ),
            //     ),
            //     SizedBox(height: height_15),
            //     ElevatedButton(
            //       onPressed: () {
            //         Get.toNamed(AppRoutes.signUp);
            //       },
            //       style: ElevatedButton.styleFrom(
            //           backgroundColor: Colors.white,
            //           minimumSize: const Size(double.infinity, 50),
            //           shape: RoundedRectangleBorder(
            //             borderRadius: BorderRadius.circular(radius_50),
            //           ),
            //           side: const BorderSide(color: colorAppColor)),
            //       child: Text(
            //         keySignUp.tr,
            //         style: TextStyle(
            //           color: colorAppColor,
            //           fontSize: font_14,
            //           fontFamily: FontFamily.inter,
            //           fontWeight: FontWeight.w600,
            //         ),
            //       ),
            //     ),
            //   ],
            // ),
            // SizedBox(
            //   height: height_15,
            // ),            // Column(
            //   mainAxisAlignment: MainAxisAlignment.center,
            //   crossAxisAlignment: CrossAxisAlignment.center,
            //   children: [
            //     Text(
            //       keyOr.tr,
            //       style: TextStyle(
            //         color: Colors.black,
            //         fontFamily: FontFamily.inter,
            //         fontWeight: FontWeight.w600,
            //       ),
            //     ),
            //     SizedBox(height: height_15),
            //     ElevatedButton(
            //       onPressed: () {
            //         Get.toNamed(AppRoutes.signUp);
            //       },
            //       style: ElevatedButton.styleFrom(
            //           backgroundColor: Colors.white,
            //           minimumSize: const Size(double.infinity, 50),
            //           shape: RoundedRectangleBorder(
            //             borderRadius: BorderRadius.circular(radius_50),
            //           ),
            //           side: const BorderSide(color: colorAppColor)),
            //       child: Text(
            //         keySignUp.tr,
            //         style: TextStyle(
            //           color: colorAppColor,
            //           fontSize: font_14,
            //           fontFamily: FontFamily.inter,
            //           fontWeight: FontWeight.w600,
            //         ),
            //       ),
            //     ),
            //   ],
            // ),
            // SizedBox(
            //   height: height_15,
            // ),
            SizedBox(height: height_20),
            GestureDetector(
              onTap: () {
                // Get.toNamed(AppRoutes.signUp);
              },
              child: Center(
                child: Text.rich(
                  TextSpan(
                    text: keyBySigningUporLoggingIn.tr,
                    style: textStyleBody1().copyWith(
                      fontSize: font_12,
                      color: Colors.black,
                      fontWeight: FontWeight.w400,
                      fontFamily: "Inter",
                    ),
                    children: [
                      TextSpan(
                        text: keyTermsOfUse.tr,
                        recognizer: TapGestureRecognizer()
                          ..onTap = () {
                            Get.toNamed(AppRoutes.staticPageScreen, arguments: {
                              "type_id": TYPE_TERM_CONDITION,
                              'title': 'Terms & Conditions'
                            });
                          },
                        style: textStyleBodyLarge().copyWith(
                            fontSize: font_12,
                            color: colorAppColor,
                            fontWeight: FontWeight.bold,
                            fontFamily: "Inter",
                            decoration: TextDecoration.underline,
                            decorationColor: colorAppColor),
                      ),
                      TextSpan(
                        text: keyAnd.tr,
                        style: textStyleBody1().copyWith(
                          fontSize: font_12,
                          color: Colors.black,
                          fontWeight: FontWeight.w400,
                          fontFamily: "Inter",
                        ),
                      ),
                      TextSpan(
                        text: keyPrivacyPolicy.tr,
                        recognizer: TapGestureRecognizer()
                          ..onTap = () {
                            Get.toNamed(AppRoutes.staticPageScreen, arguments: {
                              "type_id": TYPE_PRIVACY,
                              'title': 'Privacy Policy'
                            });
                          },
                        style: textStyleBodyLarge().copyWith(
                            fontSize: font_12,
                            color: colorAppColor,
                            fontWeight: FontWeight.bold,
                            fontFamily: "Inter",
                            decoration: TextDecoration.underline,
                            decorationColor: colorAppColor),
                      ),
                    ],
                  ),
                  textAlign: TextAlign.start,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) => Text(
        text,
        style: TextStyle(
          color: Colors.black,
          fontFamily: FontFamily.inter,
          fontWeight: FontWeight.w600,
          fontSize: font_16,
        ),
      );

  rememberMeWidget() {
    return Row(
      children: [
        Obx(
          () => Transform.scale(
            scale: height_1,
            child: Checkbox(
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              visualDensity: VisualDensity(horizontal: -3, vertical: -3),
              checkColor: Colors.white,
              side: MaterialStateBorderSide.resolveWith(
                (states) =>
                    BorderSide(width: width_1, color: Colors.transparent),
              ),
              fillColor: MaterialStateProperty.resolveWith((states) {
                return colorAppColor;
              }),
              value: controller.isRememberMe.value,
              onChanged: (val) {
                controller.isRememberMe.value = val!;
                controller.update();
              },
            ),
          ),
        ),
        TextView(
          text: "  Remember me",
          textStyle: textStyleBodyMedium().copyWith(
            color: Colors.black38,
            fontWeight: FontWeight.w400,
            fontFamily: FontFamily.inter,
            fontSize: font_14,
          ),
        )
      ],
    );
  }
}
