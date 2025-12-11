import 'package:buzzgrab/app/modules/search/controller/filter_controller.dart';
import 'package:buzzgrab/export.dart';

class SearchBinding extends Bindings{
  @override
  void dependencies() {
    Get.lazyPut<SearchController>(() => SearchController(),);
    Get.lazyPut<FilterController>(() => FilterController(),);
  }
}
