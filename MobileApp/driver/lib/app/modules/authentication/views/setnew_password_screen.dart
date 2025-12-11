import 'package:alcoholdeliverydriver/export.dart';

import '../../../core/translations/local_keys.dart';
import '../../../core/utils/projectutils/validator.dart';
import '../controllers/setnew_password_controller.dart';

class SetNewPasswordScreen extends GetView<SetNewPasswordController> {
  final controller = Get.put(SetNewPasswordController());

  final passwordGlobalKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: CustomAppBar(
        appBarTitleText: 'Set New pasword',
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
                  () => TextFieldWidget(
                  tvHeading: 'New Password',
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
                tvHeading: 'Confirm New Password',
                hint: 'Confirm New Password',
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

            SizedBox(height: height_25),
            MaterialButtonWidget(
              buttonRadius: radius_10,
              onPressed: () {
                if (passwordGlobalKey.currentState!.validate()) {
                  if (controller.isForgot.value) {
                    controller.hitChangePasswordApi();
                  } else {
                    controller.hitChangePasswordApi();
                  }
                }
              },
              buttonText: 'Save',
              textColor: Colors.white,
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
