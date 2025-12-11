import 'package:buzzgrab/app/data/remote_service/network/tbase_controller.dart';
import 'package:get/get_rx/src/rx_types/rx_types.dart';

class TransactionHistoryController extends TbaseController {
  // Sample list of transactions (replace with real data)
  RxList<Map<String, String>> transactions = RxList([
    {
      "name": "Ahmed Al-Khalid",
      "amount": "\$19.00",
      "date": "2024-09-20",
      "transactionId": "STC_001234567",
      "status": "Paid"
    },
    {
      "name": "Ahmed Al-Khalid",
      "amount": "\$19.00",
      "date": "2024-09-20",
      "transactionId": "STC_001234567",
      "status": "Paid"
    },
    {
      "name": "Ahmed Al-Khalid",
      "amount": "\$19.00",
      "date": "2024-09-20",
      "transactionId": "STC_001234567",
      "status": "Paid"
    },
  ]);
}
