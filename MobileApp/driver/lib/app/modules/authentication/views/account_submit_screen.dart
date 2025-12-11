import 'package:alcoholdeliverydriver/app/modules/authentication/controllers/account_inreview_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../../core/utils/helper_widget.dart';
import '../../../core/utils/image_picker_and_cropper.dart';
import '../../../core/utils/projectutils/validator.dart';
import '../../../core/widgets/annotated_region_widget.dart';
import '../../../core/widgets/country_picker.dart';
import '../../../core/widgets/image_picker_dialog.dart';

class AccountSubmitScreen extends GetView<AccountInReviewController> {
  final controller = Get.put(AccountInReviewController());

  Future<void> _handleBackPress(BuildContext context) async {}

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegionWidget(
      statusBarBrightness: Brightness.light,
      statusBarColor: Colors.white,
      child: WillPopScope(
        onWillPop: () async {
          _handleBackPress(context);
          return true; // allow pop
        },
        child: SafeArea(
          child: Scaffold(
            backgroundColor: Colors.white,
            body: SafeArea(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  return Center(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        AssetImageWidget(
                          imageUrl: ic_account_submit,
                          imageHeight: height_60,
                        ),
                        SizedBox(
                          height: height_10,
                        ),
                        TextView(
                            text: controller.fromLogin.value
                                ? 'Account In Review!'
                                : keyAccountSubmitted.tr,
                            textStyle: TextStyle(
                                fontSize: font_18,
                                fontWeight: FontWeight.w600,
                                color: Colors.black)),
                        SizedBox(
                          height: height_5,
                        ),
                        TextView(
                            text: keyYourAccountIsUnderReview.tr,
                            textStyle: TextStyle(
                                fontSize: font_14,
                                fontWeight: FontWeight.w400,
                                color: Colors.black38)),
                        SizedBox(
                          height: height_10,
                        ),
                        MaterialButtonWidget(
                            buttonText: keyBackToLogin.tr,
                            buttonColor: colorAppColor,
                            fontsize: font_14,
                            textColor: Colors.black,
                            onPressed: () {
                              Get.toNamed(AppRoutes.logIn);
                            }),
                      ],
                    ).paddingSymmetric(horizontal: width_10),
                  );
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
