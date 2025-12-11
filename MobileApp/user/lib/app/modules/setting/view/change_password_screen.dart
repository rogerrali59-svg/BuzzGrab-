import 'package:buzzgrab/app/modules/setting/controller/change_password_controller.dart';
import 'package:buzzgrab/export.dart';

import '../../../core/translations/local_keys.dart';
import '../../../core/utils/projectutils/validator.dart';

class ChangePasswordScreen extends GetView<ChangePasswordController> {
  final controller = Get.put(ChangePasswordController());

  final passwordGlobalKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: CustomAppBar(
        appBarTitleText: controller.isForgot.value==true?'Reset Password': 'Change pasword',
      ),
      body: _bodyWidget(),
    );
  }

  _bodyWidget() {
    return SingleChildScrollView(
      child: Form(
        key: passwordGlobalKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              height: height_10,
            ),
            Text(
              "Please enter your new password",
              style: TextStyle(
                color: Colors.black,
                fontFamily: FontFamily.inter,
                fontWeight: FontWeight.w500,
                fontSize: font_16,
              ),
            ),
            Obx(
              () => controller.isForgot.value==true?SizedBox(): TextFieldWidget(
                  tvHeading: 'Current Password'.tr,
                  hint: keyEnterPassword.tr,
                  fillColor: lightFieldColor,
                  textController: controller.oldPasswordTextEditingController,
                  inputType: TextInputType.emailAddress,
                  obscureText: controller.viewCunPassword.value,
                  suffixIcon: GestureDetector(
                    onTap: () {
                      controller.showOrHideCurrentPasswordVisibility();
                    },
                    child: Icon(
                      (controller.viewCunPassword.value == true)
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: Colors.grey,
                      size: font_18,
                    ),
                  ),
                  validate: (value) => FieldChecker.fieldChecker(
                      value: value, message: 'Current Password'),
                  focusNode: controller.currentPasswordFocusNode),
            ),
            Obx(
              () => TextFieldWidget(
                  tvHeading: keyPassword.tr,
                  hint: keyEnterPassword.tr,
                  fillColor: lightFieldColor,
                  textController: controller.newPasswordTextEditingController,
                  inputType: TextInputType.emailAddress,
                  obscureText: controller.viewNewPassword.value,
                  suffixIcon: GestureDetector(
                    onTap: () {
                      controller.showOrHideNewPasswordVisibility();
                    },
                    child: Icon(
                      (controller.viewNewPassword.value == true)
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: Colors.grey,
                      size: font_18,
                    ),
                  ),
                  validate: (value) =>
                      PasswordFormValidator.validatePassword(value),
                  focusNode: controller.newPasswordFocusNode),
            ),
            SizedBox(height: height_10),
            Obx(
              () => TextFieldWidget(
                tvHeading: keyConfirmPassword.tr,
                hint: keyEnterConfirmPassword.tr,
                fillColor: lightFieldColor,
                textController: controller.confirmPasswordTextEditingController,
                inputAction: TextInputAction.next,
                inputType: TextInputType.emailAddress,
                obscureText: controller.viewConPassword.value,
                suffixIcon: GestureDetector(
                  onTap: () {
                    controller.showOrHideConfirmPasswordVisibility();
                  },
                  child: Icon(
                    (controller.viewConPassword.value == true)
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    color: Colors.grey,
                    size: font_18,
                  ),
                ),
                validate: (value) {
                  return PasswordFormValidator.validateConfirmPasswordMatch(
                      value: value,
                      valueMessage: keyConfirmPasswordSame.tr,
                      password:
                          controller.newPasswordTextEditingController.text);
                },
              ),
            ),
            // SizedBox(height: height_25),
            // _buildLabel("Email"),
            // TextFieldWidget(
            //   color: const Color(0xFFF8F8F8),
            //   maxLength: 50,
            //   textController: controller.emailController,
            //   inputAction: TextInputAction.next,
            //   labelText: 'Enter email',
            //   inputType: TextInputType.emailAddress,
            //   focusNode: controller.emailFocusNode,
            // ),
            SizedBox(height: height_25),
            MaterialButtonWidget(
              onPressed: () {
                if (passwordGlobalKey.currentState!.validate()) {
                  if (controller.isForgot.value) {
                    controller.hitResetPasswordApi();
                  } else {
                    controller.hitChangePasswordApi();
                  }
                }
              },
              buttonText: 'Save',
            ),
            const SizedBox(height: 25),
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
}
