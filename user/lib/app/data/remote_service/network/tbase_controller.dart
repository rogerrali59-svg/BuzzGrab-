import 'package:get/get.dart';
import '../../../../main.dart';

class TbaseController extends SuperController {
  @override
  void onDetached() {
    // TODO: implement onDetached
  }

  @override
  void onHidden() {
    // TODO: implement onHidden
  }

  @override
  void onInactive() {
    // TODO: implement onInactive
  }

  @override
  void onPaused() {
    customLoader.hide();
  }

  @override
  void onResumed() {
    // TODO: implement onResumed
  }
}
