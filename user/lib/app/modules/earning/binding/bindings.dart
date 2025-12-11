import 'package:buzzgrab/app/modules/earning/controller/earning_controller.dart';
import 'package:buzzgrab/app/modules/earning/controller/transaction_history_controller.dart';
import 'package:buzzgrab/export.dart';

class EarningBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<EarningController>(() => EarningController());
    Get.lazyPut<TransactionHistoryController>(() => TransactionHistoryController());
  }
}
