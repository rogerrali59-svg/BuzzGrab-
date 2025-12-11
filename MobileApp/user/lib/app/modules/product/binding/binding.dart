import 'package:buzzgrab/app/modules/product/controller/product_detail_controller.dart';
import 'package:buzzgrab/app/modules/product/controller/product_list_controller.dart';
import 'package:buzzgrab/export.dart';


class ProductBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<ProductListController>(()=> ProductListController());
    Get.lazyPut<ProductDetailController>(()=> ProductDetailController());
  }
}