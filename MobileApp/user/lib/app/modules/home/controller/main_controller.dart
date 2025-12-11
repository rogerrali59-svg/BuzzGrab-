import 'package:buzzgrab/app/modules/authentication/model/signup_response_model.dart';
import 'package:buzzgrab/app/modules/favourite/controller/wishlist_product_list_controller.dart';
import 'package:buzzgrab/app/modules/order/controller/order_screen_controller.dart';
import 'package:geolocator/geolocator.dart';
import 'package:buzzgrab/app/modules/home/controller/home_controller.dart';
import '../../../../../export.dart';

class MainController extends GetxController {
  Rx<UserResponseModel> userResponseModel = UserResponseModel().obs;
  Rx<TextEditingController> searchTextEditingController =
      TextEditingController().obs;
  PreferenceManger preferenceManger = PreferenceManger();
  RxString name = ''.obs;
  RxBool isSearchLoading = false.obs;

  RxBool isLikeProductLoading = true.obs;
  FocusNode searchFocusNode = FocusNode();
  RxInt bottomNavIndex = 0.obs;

  @override
  void onInit() async {
    if (Get.arguments != null) {
      bottomNavIndex.value = Get.arguments["bottom_nav_index"] ?? 0;
    } else {
      bottomNavIndex.value = 0;
    }

    super.onInit();
  }

  RxString currentAddress = RxString("");
  Position? _currentPosition;

  RxInt categoryCurrentIndex = 0.obs;
  RxInt isFavaouriteIndex = 0.obs;
  RxInt cannebisListIndex = 0.obs;

  var selectedShopCategory = (-1).obs;
  RxString profileImage = ''.obs;

  RxInt selectedShopSellIndex = 0.obs;

  updateBottomNavIndex(int index) {
    bottomNavIndex.value = index;
    update();
    switch (bottomNavIndex.value) {
      case 0:
        if (Get.isRegistered<HomeController>()) {
          Get.find<HomeController>().onReady();
        }
      case 1:
        Get.find<WishlistProductListController>().onReady();
      case 2:
    }
  }

  Future<bool> onWillPop() {
    debugPrint(backPressCounter.toString());
    if (backPressCounter < 1) {
      Get.snackbar(
        'Serfix',
        stringExitWarning,
        borderRadius: 6.0,
        backgroundColor: colorAppColors,
        margin: EdgeInsets.zero,
        colorText: Colors.black,
      );
      backPressCounter++;
      Future.delayed(Duration(milliseconds: 1500), () {
        backPressCounter--;
      });
      return Future.value(false);
    } else {
      if (GetPlatform.isAndroid) {
        SystemNavigator.pop();
      }
      return Future.value(true);
    }
  }
}
