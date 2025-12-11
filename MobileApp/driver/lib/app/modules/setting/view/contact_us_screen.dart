import 'package:alcoholdeliverydriver/app/modules/setting/controller/contact_us_controller.dart';
import 'package:alcoholdeliverydriver/export.dart';

import '../../../core/translations/local_keys.dart';
import '../../../core/utils/projectutils/validator.dart';
import '../../../core/widgets/country_picker.dart';

class ContactUsScreen extends GetView<ContactUsController> {
  const ContactUsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        appBarTitleText: keyContactUs.tr,
      ),
      body: _body(),
    );
  }

  _body() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: height_10,
          ),
          TextView(
              text: 'Contact Support',
              textStyle: textStyleBodyMedium()
                  .copyWith(fontWeight: FontWeight.bold, fontSize: font_15)),
          SizedBox(
            height: height_5,
          ),
          TextView(
            text:
                'You can get touch with us through below platforms. Our Team will reach out to you as soon as it would be possible',
            textStyle: textStyleBodyMedium()
                .copyWith(color: Colors.grey, fontSize: font_13),
            textAlign: TextAlign.start,
          ),
          SizedBox(
            height: height_30,
          ),
          rowWidget(
              icon: 'assets/icons/call.png',
              title: 'Contact Number',
              subtitle: '+91-8447817368',
              onTap: () {
                launchCaller(
                  '+91-8447817368',
                );
              }),
          Divider(
            color: Colors.grey.shade300,
          ).marginSymmetric(vertical: margin_12),
          rowWidget(
              icon: 'assets/icons/email.png',
              title: 'Email Address',
              subtitle: 'info@alcoholdeliverydriver.com',
              onTap: () {
                launchEmail(
                  toEmail: 'info@alcoholdeliverydriver.com',
                  subject: 'Hello',
                  body: 'I am contacting you from my Cold Beer app.',
                );
              }),

          Divider(
            color: Colors.grey.shade300,
          ).marginSymmetric(vertical: margin_12),
          rowWidget(

              icon:iconChat ,
              title: 'Chat Support',
              subtitle: '',
              onTap: () {
               Get.toNamed(AppRoutes.chatScreen,arguments: {'receiverName':'Support'});
              }),


        ],
      ).paddingOnly(left: margin_15, right: margin_15),
    );
  }

  rowWidget({icon, title, subtitle, onTap}) {
    return InkWell(
      splashColor: Colors.transparent,
      onTap: onTap ?? () {},
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AssetImageWidget(
              imageUrl: icon, imageHeight: height_28, imageWidth: width_28),
          Column(mainAxisAlignment: MainAxisAlignment.start,crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextView(
                  text: title ?? "",
                  textStyle: textStyleBodyMedium().copyWith(
                      fontWeight: FontWeight.bold, fontSize: font_14)),
              TextView(
                  text: subtitle ?? "",
                  textStyle: textStyleBodyMedium()
                      .copyWith(color: Colors.grey, fontSize: font_12)),
            ],
          ).marginOnly(left: margin_15)
        ],
      ),
    );
  }

// _body() {
//   return SingleChildScrollView(
//     child: Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//
//         _form(),
//         MaterialButtonWidget(
//           onPressed: () {
//             if (controller.contactFormGlobalKey.currentState!.validate()) {
//               controller.hitContactUsApi();
//             }
//           },
//           buttonRadius: radius_30,
//           buttonText: keySave.tr,
//           fontsize: font_16,
//         ).marginSymmetric(vertical: margin_30),
//       ],
//     ).paddingOnly(left: margin_15, right: margin_15),
//   );
// }
//
// _form() => Form(
//       key: controller.contactFormGlobalKey,
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           _field(
//             label: keyName.tr,
//             style: TextStyle(fontSize: font_14, color: Colors.grey),
//             textEditingController: controller.fullNameController,
//             validator: (data) => PasswordFormValidator.fieldChecker(value: data, message: "Name"),
//           ),
//           _field(
//             label: keyEmail.tr,
//             style: TextStyle(fontSize: font_14, color: Colors.grey),
//             textEditingController: controller.emailController,
//             validator: (data) => PasswordFormValidator.fieldChecker(value: data, message: "Email"),
//           ),
//           _phoneWidget(),
//           _field(
//             label: keyMessage.tr,
//             onChange: (value) {
//               if (value.isNotEmpty) {
//                 if (value[0] == " ") {
//                   controller.messageController.text = value.trimLeft();
//                 }
//               }
//             },
//             style: TextStyle(fontSize: font_14, color: Colors.grey),
//             textEditingController: controller.messageController,
//             minLine: 5,
//             maxLine: 5,
//             validator: (value) => FieldChecker.fieldChecker(value: value.toString().trim(), message: keyMessage.tr),
//           ),
//         ],
//       ),
//     );
//
//
// _phoneWidget() {
//   return Obx(
//         () => CountryPicker(
//       borderColor: true,
//       labelText: 'Phone Number',
//       selectedCountry: controller.selectedCountry.value,
//       textController: controller.mobileNumberController,
//       countryController: controller.countryController,
//       focusNode: controller.mobileNumberFocusNode,
//       onCountryChanged: (country) {
//         controller.selectedCountry.value = country;
//         controller.selectedCountry.refresh();
//       },
//       onChange: (phone) {
//         if (phone.number == "0") {
//           controller.mobileNumberController.text = "";
//         }
//       },
//     ),
//   );
// }
//
//
// Widget _field({style, required TextEditingController textEditingController, maxLine, minLine, onChange, String? Function(String?)? validator, onTap, label}) {
//   return TextFieldWidget(
//     labelText: label,
//     hintStyle: style,
//     textController: textEditingController,
//     onTap: onTap,
//     maxline: maxLine,
//     minLine: minLine,
//     validate: validator,
//     // bgColor: Colors.transparent,
//   );
// }
}
