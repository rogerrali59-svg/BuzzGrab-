

import 'package:buzzgrab/app/modules/ratings/controller/rating_controller.dart';
import 'package:buzzgrab/export.dart';

class RatingBinding extends Bindings{
  @override
  void dependencies() {

    Get.lazyPut<RatingController>(()=> RatingController());

  }

}