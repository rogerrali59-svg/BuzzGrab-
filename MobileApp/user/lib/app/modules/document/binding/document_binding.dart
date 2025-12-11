import 'package:buzzgrab/app/modules/address/controller/add_address_controller.dart';
import 'package:buzzgrab/app/modules/address/controller/address_controller.dart';
import 'package:buzzgrab/export.dart';

import '../controller/document_controller.dart';

class DocumentBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<DocumentsController>(
      () => DocumentsController(),
    );
  }
}
