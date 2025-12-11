/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/authentication/controllers/forgot_controller.dart';

import '../../../../../export.dart';
import '../../../core/translations/local_keys.dart';

class ForgetScreen extends GetView<ForgotController> {
  final controller = Get.put(ForgotController());
  final forgotGlobalKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: CustomAppBar(),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: height_20,
            ),


            Text(
              keyForgotPassword.tr,
              style: TextStyle(
                color: Colors.black,
                fontWeight: FontWeight.bold,
                fontSize: font_20,
              ),
            ),
            SizedBox(
              height: height_10,
            ),
            Text(
              keyPleaseEntertheRegisterdEmail.tr,
              style: TextStyle(
                color: Colors.black.withOpacity(0.5),
                fontFamily: FontFamily.inter,
                fontWeight: FontWeight.w400,
                fontSize: font_14,
              ),
            ),
            SizedBox(height: height_25),
            Form(
              key: forgotGlobalKey,
              child: Column(
                children: [
                  TextFieldWidget(
                    tvHeading: keyEmail.tr,
                    fillColor: lightFieldColor,
                    maxLength: 50,
                    textController: controller.emailController,
                    inputAction: TextInputAction.next,
                    hint: keyEnterEmail.tr,
                    readOnly: false,
                    inputType: TextInputType.emailAddress,
                    focusNode: controller.emailFocusNode,
                    validate: (value) {
                      if (value == null || value.trim().isEmpty) {
                        return keyPleaseEnterEmail.tr;
                      } else if (!GetUtils.isEmail(value.trim())) {
                        return keyPleaseEnterValidEmail.tr;
                      }
                      return null;
                    },
                  ),
                ],
              ),
            ),
            SizedBox(height: height_25),
            ElevatedButton(
              onPressed: () {
                if (forgotGlobalKey.currentState!.validate()) {
                  controller.hitForgotPasswordApi();
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: colorAppColor,
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: Text(
                'Sent reset link',
                style: TextStyle(
                  color: Colors.white,
                  fontFamily: FontFamily.inter,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 25),
            // Row(
            //   mainAxisAlignment: MainAxisAlignment.center,
            //   crossAxisAlignment: CrossAxisAlignment.center,
            //   children: [
            //     Text(
            //       "Remember your password?",
            //       style: TextStyle(
            //         color: Colors.black,
            //         fontFamily: FontFamily.inter,
            //         fontWeight: FontWeight.w600,
            //       ),
            //     ),
            //     SizedBox(width: width_4),
            //     GestureDetector(
            //       onTap: () {
            //         Get.back();
            //       },
            //       child: Text(
            //         keyLogin.tr,
            //         style: TextStyle(
            //           color: colorAppColor,
            //           fontFamily: 'Inter',
            //           fontWeight: FontWeight.w600,
            //         ),
            //       ),
            //     )
            //   ],
            // )
          ],
        ).marginSymmetric(horizontal: margin_15),
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

  Widget checkEmailWidget() {
    return Column(
      children: [
        Align(
          alignment: Alignment.topCenter,
          child: headerImageWidget(),
        ),
        Expanded(
          child: Center(
            child: TextView(
              text: keyCheckEmailToResetPass.tr,
              textStyle: textStyleBodyMedium().copyWith(
                fontSize: font_16,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ],
    );
  }
}
