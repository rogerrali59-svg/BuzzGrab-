/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/app/modules/splash_module/controllers/splash_controller.dart';

import '../../../../../export.dart';

class SplashScreen extends StatelessWidget {
  final controller = Get.find<SplashController>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GetBuilder<SplashController>(
        builder: (controller) {
          return Center(
            child: AnimatedBuilder(
              animation: controller.animationController,
              builder: (context, child) {
                if (controller.splashAnimation.slideAnimation != null) {
                  return controller.splashAnimation
                      .applySlideTransition(child!);
                } else {
                  return controller.splashAnimation
                      .applyScaleTransition(child!);
                }
              },
              child: Container(
                child: AssetImageWidget(
                  imageUrl: appIconWithName,
                  imageHeight: 100,
                  imageWidth: Get.width * .57,
                ),
              ), // Your custom widget
            ),
          );
        },
      ),
    );
  }
}
