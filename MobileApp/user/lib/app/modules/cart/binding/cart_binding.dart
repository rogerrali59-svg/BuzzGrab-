import 'package:buzzgrab/app/modules/cart/controller/cart_controller.dart';
import 'package:buzzgrab/app/modules/cart/controller/check_out_controller.dart';
import 'package:buzzgrab/export.dart';

class CartBinding extends Bindings{
  @override
  void dependencies() {
    Get.lazyPut<CartController>(() => CartController(),);
    Get.lazyPut<CheckOutController>(() => CheckOutController(),);
  }

}