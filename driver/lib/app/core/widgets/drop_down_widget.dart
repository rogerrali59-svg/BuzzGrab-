/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import '../../../export.dart';

class DropDownWidget extends StatelessWidget {
  final String? hint;
  final String? tvHeading;
  final FocusNode? focusNode;
  final Color? color;
  final Color? containerClr;
  final EdgeInsets? contentPadding;
  final Color? borderSide;
  final double? radius;
  final List<DropdownMenuItem<Object?>>? items;
  final icon;
  final itemSelected;
  final onTap;
  final padding;
  final void Function(Object?)? onChanged;
  final String? Function(Object?)? validator;
  final RxBool isFocused = false.obs;

  DropDownWidget({
    Key? key,
    this.hint,
    this.tvHeading,
    this.focusNode,
    this.onTap,
    this.onChanged,
    this.radius,
    this.items,
    this.itemSelected,
    this.contentPadding,
    this.color,
    this.icon,
    this.validator,
    this.borderSide,
    this.containerClr,
    this.padding,
  }) {
    isFocused.value = focusNode?.hasFocus == true;
    focusNode?.addListener(() {
      isFocused.value = focusNode?.hasFocus == true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ButtonTheme(
          alignedDropdown: true,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(radius_25),
            ),
            child: Theme(
              data: ThemeData(canvasColor: Colors.grey.shade300),
              child: DropdownButtonFormField<Object?>(
                onTap: onTap ?? () {},
                borderRadius: BorderRadius.circular(radius ?? radius_25),
                padding: padding ?? null,
                focusNode: focusNode,
                validator: validator,
                isDense: true,
                dropdownColor: colorAppColor,
                decoration: dropDownDecoration(
                  contentPadding: contentPadding,
                ),
                style: Theme.of(Get.context!).textTheme.headlineLarge!.copyWith(fontSize: font_16, fontWeight: FontWeight.w500, color: Colors.white, fontFamily: "Nunito"),
                hint: TextView(
                  text: hint ?? "Select Item",
                  textStyle: textStyleBody1().copyWith(color: Colors.white70, fontWeight: FontWeight.w600, fontFamily: "Nunito"),
                ),
                isExpanded: true,
                icon: icon ??
                    Icon(
                      Icons.keyboard_arrow_down_outlined,
                      color: Colors.white,
                      size: height_20,
                    ).paddingOnly(right: margin_5),
                iconSize: margin_15,
                iconEnabledColor: color ?? Colors.grey,
                value: itemSelected,
                // items: dropdownMenuItems,
                autovalidateMode: AutovalidateMode.onUserInteraction,
                menuMaxHeight: Get.height * 0.5,
                onChanged: onChanged, items: items,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

InputDecoration dropDownDecoration({contentPadding}) => InputDecoration(
    errorStyle: textStyleBody1().copyWith(color: Colors.red.shade300, fontSize: font_10),
    contentPadding: contentPadding ?? EdgeInsets.symmetric(vertical: margin_15, horizontal: margin_12),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(radius_25),
      borderSide: BorderSide(color: Colors.white70),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(radius_25),
      borderSide: BorderSide(color: Colors.white70),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(radius_25),
      borderSide: BorderSide(color: Colors.white70),
    ),
    disabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(radius_25),
      borderSide: BorderSide(color: Colors.white70),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(radius_25),
      borderSide: BorderSide(color: Colors.white70),
    ),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(radius_25),
      borderSide: BorderSide(color: Colors.white70),
    ));
