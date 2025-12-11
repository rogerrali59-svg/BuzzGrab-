import 'package:intl_phone_field/countries.dart';
import 'package:intl_phone_field/phone_number.dart';

import '../../../export.dart';
import '../translations/local_keys.dart';
import '../utils/projectutils/validator.dart';
import 'intl_form_field.dart';

class CountryPicker extends StatelessWidget {
  Country? selectedCountry;
  final onCountryChanged;
  final onChange;
  final readOnly;
  final String? labelText;
  final String? hintText;
  final headingColor;
  final borderRadius;
  bool? prefixIcon;
  final borderColor;
  final decoration;
  bool? enabled;
  final dropdownIconPosition;
  final isShadow;
  final radius;
  final bottomMargin;
  final tvHeading;
  bool? showCountryFlag;
  final fillColor;
  final FutureOr Function(PhoneNumber?)? validator;
  final TextEditingController? textController;
  final FocusNode? focusNode;
  final TextEditingController? countryController;

  CountryPicker(
      {Key? key,
      this.showCountryFlag,
      this.readOnly,
      this.tvHeading,
      this.headingColor,
      this.bottomMargin,
      this.borderRadius,
      this.borderColor = false,
      this.decoration,
      this.radius,
      this.enabled,
      this.fillColor,
      this.validator,
      this.isShadow = false,
      required this.selectedCountry,
      required this.textController,
      this.focusNode,
      required this.countryController,
      required this.onCountryChanged,
      this.labelText,
      this.onChange,
      this.dropdownIconPosition,
      this.prefixIcon = false,
      this.hintText,
      required mobileNumberTextController});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: height_12,
        ),
        tvHeading.toString().isEmpty
            ? SizedBox()
            : Text(
                tvHeading ?? "",
                style: TextStyle(
                  color: Colors.black,
                  fontFamily: FontFamily.inter,
                  fontWeight: FontWeight.w600,
                ),
              ),
        SizedBox(
          height: height_12,
        ),
        IntlPhoneFieldd(
          cursorColor: Colors.white,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          showCountryFlag: showCountryFlag ?? true,
          showDropdownIcon: true,
          dropdownIcon: Icon(
            Icons.keyboard_arrow_down,
            color: Colors.grey,
          ),
          dropdownIconPosition: dropdownIconPosition ?? IconPosition.trailing,
          readOnly: readOnly ?? false,
          keyboardType: TextInputType.number,
          validator: (data) => PhoneNumberValidate.validatePhoneNumber(
              textController?.text ?? data.toString(), selectedCountry),
          initialCountryCode: selectedCountry?.code,
          enabled: enabled ?? true,
          invalidNumberMessage: keyPleasePhoneNumber.tr,
          dropdownTextStyle:
              textStyleHeadlineSmall().copyWith(fontSize: font_16),
          controller: textController,
          focusNode: focusNode,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          style: textStyleTitleSmall()
              .copyWith(fontWeight: FontWeight.w500, fontSize: font_15),
          decoration: InputDecoration(
            isCollapsed: true,
            isDense: true,
            filled: true,
            prefixIcon: prefixIcon!
                ? SizedBox(
                    width: height_2,
                    height: height_15,
                    child: VerticalDivider(
                      thickness: margin_1,
                    ).marginSymmetric(horizontal: margin_5),
                  )
                : emptySizeBox(),
            counterText: "",
            errorMaxLines: 2,
            errorStyle: Theme.of(Get.context!).textTheme.bodySmall!.copyWith(
                fontSize: font_10,
                fontWeight: FontWeight.w500,
                color: Colors.red),
            fillColor: lightFieldColor,
            labelText: labelText ?? '',
            hintText: hintText ?? '',
            labelStyle: TextStyle(
                color: Colors.grey,
                fontWeight: FontWeight.normal,
                fontFamily: "inter"),
            hintStyle: TextStyle(
                fontSize: font_14,
                color: Colors.white38,
                fontFamily: "inter",
                fontWeight: FontWeight.w400),
            focusedErrorBorder: decoration ??
                OutlineInputBorder(
                    borderRadius: BorderRadius.circular(radius ?? radius_10),
                    borderSide:
                        BorderSide(color: Color(0xFFe8e8e9), width: 1.0)),
            errorBorder: decoration ??
                OutlineInputBorder(
                    borderRadius: BorderRadius.circular(radius ?? radius_10),
                    borderSide:
                        BorderSide(color: Color(0xFFe8e8e9), width: 1.0)),
            enabledBorder: decoration ??
                OutlineInputBorder(
                    borderRadius: BorderRadius.circular(radius ?? radius_10),
                    borderSide:
                        BorderSide(color: Color(0xFFe8e8e9), width: 1.0)),
            border: decoration ??
                OutlineInputBorder(
                    borderRadius: BorderRadius.circular(radius ?? radius_10),
                    borderSide:
                        BorderSide(color: Color(0xFFe8e8e9), width: 1.0)),
            disabledBorder: decoration ??
                OutlineInputBorder(
                  borderRadius:
                      BorderRadius.circular(borderRadius ?? radius_10),
                  borderSide: BorderSide(color: Color(0xFFe8e8e9), width: 1.0),
                ),
            focusedBorder: decoration ??
                OutlineInputBorder(
                    borderRadius: BorderRadius.circular(radius ?? radius_10),
                    borderSide:
                        BorderSide(color: Color(0xFFe8e8e9), width: 1.0)),
          ),
          onChanged: onChange ?? (phone) {},
          onCountryChanged: onCountryChanged ??
              (country) {
                selectedCountry = country;
                countryController?.text = selectedCountry!.name;
                textController?.clear();
              },
        ),
      ],
    );
  }
}
