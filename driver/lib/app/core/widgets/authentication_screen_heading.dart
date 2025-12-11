/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 *  Proprietary and confidential :  All information contained herein is, and remains
 *  the property of ToXSL Technologies Pvt. Ltd. and its partners.
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 */

import '../../../../export.dart';

class AuthenticationScreenHeading extends StatelessWidget {
  final String title;
  final textStyle;
  final TextAlign textAlign;
  final topMargin;
  AlignmentGeometry? alignmentGeometry;

  AuthenticationScreenHeading({
    Key? key,
    required this.title,
    this.textStyle,
    this.topMargin,
    this.textAlign = TextAlign.center,
    this.alignmentGeometry = Alignment.center,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Align(
        alignment: alignmentGeometry ?? Alignment.center,
        child: TextView(
          text: title.tr,
          textAlign: textAlign,
          textStyle: textStyle ??
              textStyleHeadlineSmall().copyWith(
                  fontWeight: FontWeight.w600,
                  color: Colors.black,
                  fontSize: font_26),
        )).paddingOnly(top: topMargin ?? margin_0);
  }
}
