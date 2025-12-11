import 'package:buzzgrab/app/modules/earning/controller/earning_controller.dart';
import 'package:buzzgrab/app/modules/earning/controller/transaction_history_controller.dart';
import 'package:buzzgrab/app/modules/favourite/controller/wishlist_product_list_controller.dart';
import 'package:buzzgrab/export.dart';

class WishlistBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<WishlistProductListController>(() => WishlistProductListController());

  }
}
