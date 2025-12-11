/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import '../../../export.dart';
import '../translations/local_keys.dart';


bool _isSnackbarShowing = false;

toast(message, {int seconds = 2}) {
if(Get.isSnackbarOpen){
      return;
}
      Get.snackbar(
            'BuzzGrab',
            message,
            barBlur: radius_50,
            backgroundColor: colorAppColor,
            snackPosition: SnackPosition.TOP,
            colorText: Colors.white,
            duration: Duration(seconds: seconds),
            margin: EdgeInsets.all(margin_5),
            snackbarStatus: (status) {
                  if (status == SnackbarStatus.CLOSED) {
                        _isSnackbarShowing = false;  // Reset flag when snackbar is closed
                  }
            },
      );
}


bottomToast(message, {int seconds = 1}) => Get.snackbar(
      'BuzzGrab',
      '$message',
      borderRadius: 6.0,
      margin:
          EdgeInsets.only(left: margin_12, right: margin_12, bottom: margin_15),
      padding: EdgeInsets.all(margin_10),
      snackPosition: SnackPosition.BOTTOM,
      animationDuration: Duration(seconds: seconds),
      backgroundColor: colorAppColor,
      colorText: Colors.white,
    );


/// bottom short length toast
void customBottomToast(String message, {int seconds = 1}) {
      OverlayState overlayState = Overlay.of(Get.context!);
      late OverlayEntry overlayEntry;

      overlayEntry = OverlayEntry(
            builder: (context) => Positioned(
                  bottom: margin_40,
                  left: 0,
                  right: 0,
                  child: Align(
                        alignment: Alignment.bottomCenter,
                        child: Material(
                              color: Colors.transparent,
                              child: Container(
                                    padding: EdgeInsets.symmetric(
                                          horizontal: margin_10,
                                          vertical: margin_10,
                                    ),
                                    decoration: BoxDecoration(
                                          color: colorAppColor,
                                          borderRadius: BorderRadius.circular(30),
                                    ),
                                    child: Text(
                                          message,
                                          style: const TextStyle(
                                                color: Colors.white,
                                          ),
                                    ),
                              ),
                        ),
                  ),
            ),
      );

      overlayState.insert(overlayEntry);

      Future.delayed(Duration(seconds: seconds), () {
            overlayEntry.remove();
      });
}
