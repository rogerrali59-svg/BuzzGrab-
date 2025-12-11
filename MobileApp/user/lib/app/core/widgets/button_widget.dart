import 'package:buzzgrab/export.dart';

class MaterialButtonWidget extends StatelessWidget {
  final String? buttonText;
  final Color? buttonColor;
  final Color? textColor;
  final double? buttonRadius;
  final double? minWidth;
  final double? minHeight;
  final double? padding;
  final onPressed;
  final decoration;
  final Color? borderColor;
  final elevation;
  final bool? isSocial;
  final double? fontsize;
  final Widget? iconWidget;
  final fontWeight;

  const MaterialButtonWidget({
    Key? key,
    this.buttonText = "",
    this.buttonColor,
    this.borderColor,
    this.textColor,
    this.buttonRadius = defaultRaduis,
    this.decoration,
    this.isSocial = false,
    this.onPressed,
    this.elevation,
    this.fontWeight,
    this.iconWidget,
    this.fontsize,
    this.minWidth,
    this.minHeight,
    this.padding,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return  Container(
      decoration: decoration ?? BoxDecoration(
        color: buttonColor ?? colorAppColor,
        borderRadius: BorderRadius.circular(buttonRadius!),
        border: Border.all(color: borderColor ?? Colors.transparent,width: 0.1),
      ),
      child: MaterialButton(
        height: minHeight,
        splashColor: Colors.transparent,
        minWidth: minWidth ?? Get.width,
        color: Colors.transparent, // button ke liye transparent, color Container se milega
        elevation: elevation ?? 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(buttonRadius!), side: BorderSide(color: borderColor ?? Colors.transparent)),
        onPressed: onPressed,
        padding: EdgeInsets.symmetric(vertical: padding ?? margin_14),
        child: TextView(
          text: buttonText!,
          textStyle: textStyleButton().copyWith(
            color: textColor ?? Colors.white,
            fontSize: fontsize ?? font_14,
            fontWeight:fontWeight?? FontWeight.w600,
            fontFamily: "inter",
          ),
        ),
      ),
    );

  }
}
