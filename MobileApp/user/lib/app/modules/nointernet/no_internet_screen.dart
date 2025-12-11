import 'package:connectivity_plus/connectivity_plus.dart';

import '../../../export.dart';


class NoInternetConnectionScreen extends StatefulWidget {
  final int? screenType;

  NoInternetConnectionScreen({super.key, this.screenType});

  @override
  State createState() => _NoInternetConnectionScreenState();
}

class _NoInternetConnectionScreenState extends State<NoInternetConnectionScreen> {
  var currentTime;
  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () {
        DateTime now = DateTime.now();
        if (currentTime == null || now.difference(currentTime) > Duration(seconds: 2)) {
          currentTime = now;
          bottomToast('keyExitApp.tr');
          return Future.value(false);
        }
        SystemNavigator.pop();

        return Future.value(true);
      },
      child: AnnotatedRegion(
        value: SystemUiOverlayStyle.light.copyWith(
          statusBarColor: Colors.transparent,
        ),
        child: Scaffold(
          backgroundColor: Colors.white,
          body: SizedBox(
            height: Get.height,
            width: Get.width,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'No Internet',
                  style: textStyleBodyMedium().copyWith(
                    fontSize: font_18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(
                  height: height_10,
                ),
                Text(
                  "No internet connection found. Check your connection or try again.",
                  textAlign: TextAlign.center,
                  style: textStyleBodyMedium().copyWith(
                    color: Colors.black45,
                    fontSize: font_15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(
                  height: height_15,
                ),
                SizedBox(
                  width: Get.width / 2.5,
                  child: MaterialButtonWidget(
                    onPressed: () {
                      checkInternet();
                    },
                    buttonRadius: radius_10,
                    textColor: Colors.white,
                    buttonText: 'Try again',
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void checkInternet() async {
    final connectivityResult = await (Connectivity().checkConnectivity());
    if (connectivityResult == ConnectivityResult.none) {
      bottomToast( 'No Internet Connection');
    } else {
      if (widget.screenType == 0) {
        Get.offAllNamed(AppRoutes.splash);
      } else {
        Get.back();
      }
    }
  }
}
