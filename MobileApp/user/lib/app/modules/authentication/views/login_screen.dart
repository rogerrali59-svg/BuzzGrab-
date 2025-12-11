import 'package:buzzgrab/main.dart';

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
            SizedBox(height: height_70),
            Text(
             'Welcome Back',
              style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
                fontSize: font_22,
              ),
            ),
            SizedBox(height: height_5),
            Text(
              'Login to get started',
              style: TextStyle(
                color: Colors.grey,
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
            SizedBox(height: height_10),
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
                        // decoration: TextDecoration.underline,
                        decorationColor: colorAppColor),
                  ),
                ),
              ],
            ),
            SizedBox(height: height_30),
            ElevatedButton(
              onPressed: () {

                if (formGlobalKey.currentState!.validate()) {
                  controller.callLoginApi();
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: colorAppColor,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(radius_10),
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
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Row(mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Divider(
                        color: Colors.grey.shade300,
                        thickness: 2,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12.0),
                      child: Text(
                        'Or continue with',
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: font_12,
                          fontFamily: FontFamily.inter,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Expanded(
                      child: Divider(
                        color: Colors.grey.shade300,
                        thickness: 2,
                      ),
                    ),
                  ],
                ).paddingSymmetric(horizontal: margin_10),
                SizedBox(height: height_20),
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.only(right: 8), // space between buttons
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: GestureDetector(
                          onTap: () {
                            // Google login action
                          },

                          child: Image.asset(
                            'assets/icons/google.png', // your Google logo path
                            height: 20,
                            width: 20,
                          ).paddingSymmetric(vertical: margin_10),
                        ),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        margin: const EdgeInsets.only(left: 8),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: GestureDetector(
                          onTap: () {
                            // Facebook login action
                          },

                          child: Image.asset(
                            'assets/icons/facebook.png', // your Facebook logo path
                            height: 20,
                            width: 20,
                          ).paddingSymmetric(vertical: margin_10),
                        ),
                      ),
                    ),
                  ],
                )
,                SizedBox(height: height_20),

                RichText(
                  textAlign: TextAlign.center,
                  text: TextSpan(
                    children: [
                      TextSpan(
                        text: "Don't have an account? ",
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 13,
                          fontFamily: FontFamily.inter,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      TextSpan(
                        text: 'SignUp',
                        style: TextStyle(
                          color: Colors.blue,
                          decoration: TextDecoration.underline,
                          fontSize: 13,
                          fontFamily: FontFamily.inter,
                          fontWeight: FontWeight.w600,
                        ),
                        recognizer: TapGestureRecognizer()
                          ..onTap = () {
                            Get.toNamed(AppRoutes.signUp);
                          },
                      ),
                    ],
                  ),
                )
              ],
            ),
            SizedBox(
              height: height_15,
            ),
            SizedBox(height: height_20),
            // GestureDetector(
            //   onTap: () {
            //     // Get.toNamed(AppRoutes.signUp);
            //   },
            //   child: Center(
            //     child: Text.rich(
            //       TextSpan(
            //         text: keyBySigningUporLoggingIn.tr,
            //         style: textStyleBody1().copyWith(
            //           fontSize: font_12,
            //           color: Colors.black,
            //           fontWeight: FontWeight.w400,
            //           fontFamily: "Inter",
            //         ),
            //         children: [
            //           TextSpan(
            //             text: keyTermsOfUse.tr,
            //             recognizer: TapGestureRecognizer()
            //               ..onTap = () {
            //                 Get.toNamed(AppRoutes.staticPageScreen, arguments: {
            //                   "type_id": TYPE_TERM_CONDITION,
            //                   'title': 'Terms & Conditions'
            //                 });
            //               },
            //             style: textStyleBodyLarge().copyWith(
            //                 fontSize: font_12,
            //                 color: colorAppColor,
            //                 fontWeight: FontWeight.bold,
            //                 fontFamily: "Inter",
            //                 decoration: TextDecoration.underline,
            //                 decorationColor: colorAppColor),
            //           ),
            //           TextSpan(
            //             text: keyAnd.tr,
            //             style: textStyleBody1().copyWith(
            //               fontSize: font_12,
            //               color: Colors.black,
            //               fontWeight: FontWeight.w400,
            //               fontFamily: "Inter",
            //             ),
            //           ),
            //           TextSpan(
            //             text: keyPrivacyPolicy.tr,
            //             recognizer: TapGestureRecognizer()
            //               ..onTap = () {
            //                 Get.toNamed(AppRoutes.staticPageScreen, arguments: {
            //                   "type_id": TYPE_PRIVACY,
            //                   'title': 'Privacy Policy'
            //                 });
            //               },
            //             style: textStyleBodyLarge().copyWith(
            //                 fontSize: font_12,
            //                 color: colorAppColor,
            //                 fontWeight: FontWeight.bold,
            //                 fontFamily: "Inter",
            //                 decoration: TextDecoration.underline,
            //                 decorationColor: colorAppColor),
            //           ),
            //         ],
            //       ),
            //       textAlign: TextAlign.start,
            //     ),
            //   ),
            // ),
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
