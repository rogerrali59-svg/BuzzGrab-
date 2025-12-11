/*
 *
 *  * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 *  * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 *  * All Rights Reserved.
 *  * Proprietary and confidential :  All information contained herein is, and remains
 *  * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 *  * Unauthorized copying of this file, via any medium is strictly prohibited.
 *
 */

import '../../../export.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? appBarTitleText;
  final actionWidget;
  final bottomPadding;
  final topPadding;
  final Color? bgColor;
  final appBarTitleWidget;
  final leadingIcon;
  final bool? isDrawerIcon;
  final bool? isBackIcon;
  final bool? centerTitle;
  final Function? onTap;
  final titleColor;
  final bottomOpacity;
  final shadowColor;
  final elevation;
  final leadingWidth;

  CustomAppBar({
    Key? key,
    this.appBarTitleText,
    this.titleColor,
    this.onTap,
    this.actionWidget,
    this.bottomPadding,
    this.topPadding,
    this.isDrawerIcon = false,
    this.appBarTitleWidget,
    this.leadingIcon,
    this.isBackIcon = true,
    this.centerTitle = true,
    this.bgColor,
    this.bottomOpacity,
    this.elevation,
    this.leadingWidth,
    this.shadowColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      toolbarHeight: height_50,
      elevation: elevation ?? 0.0,
      bottomOpacity: bottomOpacity ?? 0.0,
      leading: isBackIcon! ? _backIcon() : Container(),
      centerTitle: centerTitle ?? false,
      leadingWidth: leadingWidth ?? width_70,
      surfaceTintColor: Colors.white,
      title: appBarTitleWidget ??
          (appBarTitleText != "" || appBarTitleText != null
              ? TextView(
                  text: appBarTitleText ?? "",
                  textAlign: TextAlign.center,
                  textStyle: textStyleHeadlineMedium().copyWith(
                      fontWeight: FontWeight.w600,
                      color: titleColor,
                      fontFamily: "inter",
                      fontSize: font_16),
                ).paddingOnly(top: height_8)
              : SizedBox(
                  height: 0,
                  width: 0,
                )),
      shadowColor: shadowColor ?? Colors.transparent,
      backgroundColor: bgColor ?? colorWhite,
      actions: actionWidget ?? [],
    );
  }

  _backIcon() {
    return Align(
      alignment: Alignment.topLeft,
      child: InkWell(
        splashColor: Colors.transparent,
        child: leadingIcon ??
            AssetImageWidget(
              imageUrl: (isDrawerIcon == true ? ic_back : ic_back),
              imageWidth: isDrawerIcon == true ? height_65 : height_35,
              imageHeight: isDrawerIcon == true ? height_65 : height_35,
            ).paddingOnly(
              top: topPadding ?? margin_12,
              left: margin_15,
              bottom:
                  isDrawerIcon == false ? bottomPadding ?? margin_2 : margin_2,
            ),
        onTap: () {
          if (onTap == null) {
            Get.back(result: true);
          } else {
            onTap!();
          }
        },
      ),
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(height_50);
}
