

import 'package:alcoholdeliverydriver/app/modules/ratings/controller/rating_controller.dart';
import 'package:alcoholdeliverydriver/export.dart';

class RatingBinding extends Bindings{
  @override
  void dependencies() {

    Get.lazyPut<RatingController>(()=> RatingController());

  }

}