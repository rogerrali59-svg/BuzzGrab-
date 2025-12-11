import 'package:connectivity_plus/connectivity_plus.dart';

import '../../../export.dart';
import 'no_internet_screen.dart';

class NetworkController extends GetxController {
  final Connectivity _connectivity = Connectivity();

  @override
  void onInit() {
    super.onInit();
    _connectivity.onConnectivityChanged.listen(_updateConnectionStatus);
  }

  void _updateConnectionStatus(ConnectivityResult connectivityResult) {
    if (connectivityResult == ConnectivityResult.none) {
      // offlineSheet();
      if (Get.currentRoute == AppRoutes.splash) {
        Get.to(NoInternetConnectionScreen(
          screenType: 1,
        ));
      } else {
        Get.to(NoInternetConnectionScreen());
      }
      update();
    } else {
      if (Get.previousRoute == AppRoutes.splash) {
        Get.offAllNamed(AppRoutes.splash);
      }
    }
  }

  offlineSheet() {
    return Get.dialog(
        barrierDismissible: false,
        WillPopScope(
          onWillPop: () {
            return Future.value(false);
          },
          child: Container(
            width: Get.width * 0.70,
            decoration: BoxDecoration(
              color: Colors.transparent,
            ),
          ),
        ));
  }

  offlineDialog() {
    return Get.dialog(
        barrierDismissible: false,
        WillPopScope(
          onWillPop: () {
            return Future.value(false);
          },
          child: Column(mainAxisSize: MainAxisSize.min, mainAxisAlignment: MainAxisAlignment.center, children: [
            Center(
                child: Container(
                    width: Get.width * 0.70,
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(margin_20)),
                    child: Column(
                      children: [
                        // AssetImageWidget(
                        //   imageUrl: iconsIcLogo,
                        //   imageHeight: height_100,
                        // ),
                        TextView(text: 'No internet connection', textStyle: textStyleBodySmall().copyWith(fontSize: font_17, fontWeight: FontWeight.bold))
                            .paddingSymmetric(vertical: margin_8),
                        TextView(text: "Check Your Internet Connection", textStyle: textStyleBodySmall().copyWith(fontSize: font_15, fontWeight: FontWeight.bold))
                            .paddingSymmetric(vertical: margin_8),
                      ],
                    ).paddingSymmetric(vertical: margin_15)))
          ]),
        ));
  }
}
