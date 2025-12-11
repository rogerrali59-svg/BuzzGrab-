/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import '../../../../export.dart';

Widget buildImage(String assetName, {double? width, double? height = 200}) {
  return Container(
    height: height,
    child: Image.asset(
      assetName,
      width: width,
      height: height,
    ),
  );
}

List<Widget> pages = [
  OnBoardingScreen(
    label: "Welcome to pub.dev Reader\n\nWhere you can enjoy the reading experience with our app.",
    image: iconImg1,
    footer: iconSlider1,
  ),
  OnBoardingScreen(
    label: 'To start the reading experience, you have to login to Flutter/library, download a book, and then enjoy reading.',
    image: iconImg2,
    footer: iconSlider2,
  ),
  OnBoardingScreen(
    label: 'Print reader provides a customizable reading experience, and other features where you can lend books to friends or family or gift it as a gift.',
    image: iconImg3,
    footer: iconSlider3,
  ),
];

class OnBoardingScreen extends StatelessWidget {
  const OnBoardingScreen({Key? key, required this.label, required this.image, required this.footer}) : super(key: key);
  final String label;
  final String image;
  final String footer;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Center(
          child: Column(
            children: [
              Spacer(),
              Column(
                children: [
                  buildImage(image).marginOnly(bottom: margin_30),
                  TextView(text: label, maxLine: 4, textStyle: textStyleTitle(), textAlign: TextAlign.center),
                ],
              ),
              Spacer(),
              AssetImageWidget(imageUrl: footer, imageHeight: 12, imageWidth: 90, imageFitType: BoxFit.contain)
            ],
          ),
        ),
      ),
    );
  }
}
