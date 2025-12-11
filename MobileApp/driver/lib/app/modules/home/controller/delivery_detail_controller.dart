import 'package:alcoholdeliverydriver/app/data/remote_service/network/tbase_controller.dart';
import 'package:alcoholdeliverydriver/export.dart';

class DeliveryDetailController extends TbaseController {
  // Reactive state variables
  var isAccepted = false.obs;

  void acceptOrder() {
    isAccepted.value = true;
    // Implement the logic for accepting the order here
  }

  void rejectOrder() {
    isAccepted.value = false;
    // Implement the logic for rejecting the order here
  }
}
