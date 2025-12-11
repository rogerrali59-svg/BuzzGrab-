import '../../../export.dart';
import '../utils/helper_widget.dart';

class OtherScreenHeading extends StatelessWidget {
  String title;
  final textStyle;
  final actionIcon;
  final onIconPress;
  final isDrawerIcon;
  final leadingIcon;
  final appBarTitleWidget;
  final fontSize;
  final actionWidget;
  final color;
  final centerTitle;
  final double? buttonRadius;

  OtherScreenHeading(
      {Key? key,
      required this.title,
      this.actionIcon,
      this.fontSize,
      this.isDrawerIcon,
      this.textStyle,
      this.leadingIcon,
      this.onIconPress,
      this.appBarTitleWidget,
      this.actionWidget,
      this.centerTitle,
      this.color,
      this.buttonRadius})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: margin_15, horizontal: margin_15),
      decoration: BoxDecoration(
        color: colorAppColor,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(26.0),
          bottomRight: Radius.circular(26.0),
        ),
      ),
      child: AppBar(
        scrolledUnderElevation: 0,
        leadingWidth: width_30,
        backgroundColor: colorAppColor,
        actions: [actionWidget ?? emptySizeBox()],
        title: TextView(
          maxLine: 2,
          text: title,
          textAlign: TextAlign.start,
          textStyle: textStyleHeadlineSmall().copyWith(
              fontWeight: FontWeight.w500,
              color: Colors.white,
              fontSize: fontSize ?? font_18),
        ).marginOnly(bottom: margin_5),
        leading: InkWell(
          onTap: () {
            Get.back();
          },
          child: Align(
            alignment: Alignment.topLeft,
            child: AssetImageWidget(
              color: Colors.white,
              imageUrl: iconBack,
              imageWidth: width_30,
              imageHeight: height_30,
            ),
          ),
        ).marginOnly(top: margin_8),
      ),
    );
  }
}
