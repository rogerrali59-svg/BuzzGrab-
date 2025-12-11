import 'package:buzzgrab/main.dart';
import 'package:dots_indicator/dots_indicator.dart';
import '../../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../controllers/onboarding_controller.dart';

class OnboardingScreen extends GetView<OnboardingController> {
// Initialize the controller only once using Get.find() since it's already bound
  final controller = Get.find<OnboardingController>();

  @override
  Widget build(BuildContext context) {
// MediaQuery for responsive design
    final screenWidth = MediaQuery.of(context).size.width;

// TextStyle variables to keep the styling consistent
    final TextStyle titleStyle = TextStyle(
      color: Colors.white,
      fontSize: font_26,
      fontWeight: FontWeight.w600,
      fontFamily: "Inter",
    );

    final TextStyle subtitleStyle = TextStyle(
      color: Colors.white70,
      fontSize: font_14,
      fontWeight: FontWeight.w400,
      fontFamily: "Inter",
    );

    final TextStyle buttonTextStyle = textStyleBody1().copyWith(
      color: Colors.black,
      fontFamily: 'Inter',
      fontWeight: FontWeight.w600,
      fontSize: font_13,
    );

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
// Image pageview, background image
          Positioned.fill(
            child: Image.asset(
              ic_onBoading,
              fit: BoxFit.cover,
            ),
          ),

// Shadow image at the bottom
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 200, // your required height
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black.withOpacity(0.0), // top transparent
                    Colors.black.withOpacity(0.7), // bottom dark
                    Colors.black, // bottom dark
                  ],
                ),
              ),
            ),
          )
,

// Get Started Button
          Positioned(
              bottom: 10,
              left: 20,
              right: 20,
              child: Column(
                children: [
                  Text(
                    'BuzzGrab',
                    style: titleStyle,
                  ),
                  SizedBox(height: 8),
                  Text(
                    keyManageDeliveries.tr,
                    style: subtitleStyle,
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 16),
                  GestureDetector(
                    onTap: () {
                      preferenceManger.firstLaunch(true);
                      Get.toNamed(AppRoutes.logIn);
                    },
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: TextView(
                          text: keyGetStarted.tr,
                          textStyle: buttonTextStyle,
                        ).paddingSymmetric(vertical: margin_15),
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      preferenceManger.firstLaunch(true);
                      Get.toNamed(AppRoutes.logIn);
                    },
                    child: Container(
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: TextView(
                          text: "Login",
                          textStyle: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ).paddingSymmetric(vertical: margin_15),
                      ),
                    ),
                  ),
                ],
              )),

// Bottom black rectangle image
        ],
      ),
    );
  }
}
