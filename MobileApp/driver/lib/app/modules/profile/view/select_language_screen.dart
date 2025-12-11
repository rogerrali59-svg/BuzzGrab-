import 'package:alcoholdeliverydriver/app/core/translations/local_keys.dart';

import '../../../../export.dart';
import '../controller/select_language_controller.dart';

class SelectLanguageScreen extends GetView<SelectLanguageController> {
  final controller = Get.put(SelectLanguageController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        appBarTitleText: keyLanguage.tr,
        centerTitle: true,
      ),
      body: Obx(
        () => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextView(
              text: 'Suggested',
              textStyle: textStyleBodyMedium().copyWith(
                color: Colors.grey,
                fontWeight: FontWeight.bold,
                fontSize: font_14,
              ),
            ),
            rowWidget(
              title: '${keyEnglish.tr} (US)',
              widget: Radio<int>(
                value: 0,
                groupValue: controller.radioValue.value,
                onChanged: controller.selectLanguage, // 🔁 Updated
              ),
            ),
            TextView(
              text: 'Others',
              textStyle: textStyleBodyMedium().copyWith(
                color: Colors.grey,
                fontWeight: FontWeight.bold,
                fontSize: font_14,
              ),
            ),
            rowWidget(
              title: 'Français',
              widget: Radio<int>(
                value: 1,
                groupValue: controller.radioValue.value,
                onChanged: controller.selectLanguage,
              ),
            ),
            rowWidget(
              title: 'Português',
              widget: Radio<int>(
                value: 2,
                groupValue: controller.radioValue.value,
                onChanged: controller.selectLanguage,
              ),
            ),
          ],
        ).marginOnly(left: margin_12, right: margin_5, top: margin_10),
      ),
    );
  }

  Widget rowWidget({required String title, required Widget widget}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        TextView(
          text: title,
          textStyle: textStyleBodyMedium().copyWith(
            color: Colors.grey.shade600,
          ),
        ),
        widget,
      ],
    );
  }
}
