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

import 'package:lottie/lottie.dart';

import '../../../export.dart';
import '../translations/local_keys.dart';

class ImagePickerDialog extends StatelessWidget {
  final String? title;
  final galleryFunction;
  final cameraFunction;

  const ImagePickerDialog({
    Key? key,
    this.title,
    required this.galleryFunction,
    required this.cameraFunction,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: <Widget>[
        Container(
            width: Get.width,
            decoration: BoxDecoration(color: colorAppColor, borderRadius: BorderRadius.circular(margin_5)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _dialogTitle(),
                _dialogButton(),
              ],
            ).marginAll(margin_20)),
        _cancelButton()
      ],
    ).marginAll(margin_10);
  }

  Widget _dialogTitle() => TextView(
        text: title ?? "",
        textStyle: textStyleDisplayMedium().copyWith(
          fontSize: font_16,
          color: Colors.white,
          fontFamily: "Nunito",
        ),
        textAlign: TextAlign.start,
      ).paddingOnly(bottom: margin_15);

  _cancelButton() => MaterialButtonWidget(
        onPressed: () {
          Get.back();
        },
        buttonRadius: margin_5,
        buttonColor: colorAppColor,
        textColor: Colors.white,
        buttonText: keyCancel.tr,
      ).paddingSymmetric(vertical: margin_15);

  Widget _dialogButton() => Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          InkWell(
            onTap: cameraFunction,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
              Icon(Icons.camera_alt,color: Colors.white),
                TextView(
                  text: keyTakeImage.tr,
                  textStyle: textStyleBodyLarge().copyWith(color: Colors.white, fontFamily: "Nunito", fontWeight: FontWeight.w600),
                  textAlign: TextAlign.start,
                ).paddingSymmetric(vertical: margin_12),
              ],
            ),
          ),
          SizedBox(
            width: margin_2,
          ),
          InkWell(
            onTap: galleryFunction,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
               Icon(Icons.photo_library,color: Colors.white,),
                TextView(
                  text: keyChooseImage.tr,
                  textStyle: textStyleBodyLarge().copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontFamily: "Nunito",
                  ),
                  textAlign: TextAlign.start,
                ).paddingSymmetric(vertical: margin_12),
              ],
            ),
          )
        ],
      );
}
