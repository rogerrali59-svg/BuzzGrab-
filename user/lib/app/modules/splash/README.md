# splash





## Integrate with your tools
Add this in your .git modules

 [submodule "splash"]
    path = lib/app/modules/splash
    url = http://192.168.10.21/flutter/libs/splash.git

 
 
 Now clone using
 bash scripts/clone-submodules.sh   


Now Add the path to .gitignore file
 lib/app/modules/splash




## Name
splash

## Description
This guide demonstrates how to implement the SplashController, SplashAnimation, and the SplashScreen in your Flutter project using the GetX state management system.
 Features

    Easily configurable splash animations.

    Built using GetxController and AnimatedBuilder.


Supports various animation types:

    zoomIn

    zoomOut

    slideLeftToRight

    slideRightToLeft

    slideTopToBottom

    slideBottomToTop



## Installation
1. Initialize the Controller

When initializing SplashController, pass your desired animation type as a named parameter.

Get.put(SplashController(animationType: "zoomIn"));

    If not provided, the default animation type is slideLeftToRight.


 ## Usage   

2. Create the Splash Screen

Your SplashScreen should use GetBuilder to reactively build the UI based on the controller’s animation state.

class SplashScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GetBuilder<SplashController>(
        builder: (controller) {
          return Center(
            child: AnimatedBuilder(
              animation: controller.animationController,
              builder: (context, child) {
                // Choose transition based on the initialized animation type
                if (controller.splashAnimation.slideAnimation != null) {
                  return controller.splashAnimation.applySlideTransition(child!);
                } else {
                  return controller.splashAnimation.applyScaleTransition(child!);
                }
              },
              child: AssetImageWidget(imageUrl: iconAppLogo), // Your custom widget
            ),
          );
        },
      ),
    );
  }
}


3. SplashController Details

class SplashController extends GetxController
    with GetSingleTickerProviderStateMixin {
  late AnimationController animationController;
  late SplashAnimation splashAnimation;

  final String animationType;

  SplashController({this.animationType = "slideLeftToRight"});

  @override
  void onInit() {
    animationController = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );

    splashAnimation = SplashAnimation(
      controller: animationController,
      animationType: animationType,
    );

    animationController.forward(); // Start animation
    super.onInit();
  }
}



4. Available Animation Types

You can pass any of the following strings to control the animation style:
Animation Type	Description
zoomIn	Grows the widget from 0 to full size
zoomOut	Shrinks the widget from full size to 0
slideLeftToRight	Slides in from the left
slideRightToLeft	Slides in from the right
slideTopToBottom	Slides in from the top
slideBottomToTop	Slides in from the bottom
   

