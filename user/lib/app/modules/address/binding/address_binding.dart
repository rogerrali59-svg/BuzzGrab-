import 'package:buzzgrab/app/modules/address/controller/add_address_controller.dart';
import 'package:buzzgrab/app/modules/address/controller/address_controller.dart';
import 'package:buzzgrab/export.dart';

class AddressBinding extends Bindings{
  @override
  void dependencies() {
    Get.lazyPut<AddressController>(() => AddressController(),);
    Get.lazyPut<AddAddressController>(() => AddAddressController(),);
  }

}