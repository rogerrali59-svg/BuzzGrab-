import 'package:buzzgrab/export.dart';
import '../../../core/translations/local_keys.dart';
import '../controller/transaction_history_controller.dart';

class TransactionHistoryScreen extends GetView<TransactionHistoryController> {
  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (didPop) async {
        if (didPop) {
          return;
        }
        bool shouldExit = await onBackPressed(context);
        if (shouldExit) {
          exit(0);
        }
      },
      child: SafeArea(
        child: Scaffold(
          resizeToAvoidBottomInset: false,
          appBar: CustomAppBar(
            isBackIcon: true,
            appBarTitleText: keyTransactionHistory.tr,
            centerTitle: true,
          ),
          body: _body(),
        ),
      ),
    );
  }

  Widget _body() {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Transaction History List
          Obx(() {
            return ListView.builder(
              shrinkWrap: true,
              itemCount: controller.transactions.length,
              itemBuilder: (context, index) {
                var transaction = controller.transactions[index];
                return _transactionCard(transaction);
              },
            );
          })
        ],
      ).marginSymmetric(horizontal: margin_15).marginOnly(top: margin_20),
    );
  }

  // Widget for displaying each transaction
  Widget _transactionCard(Map<String, String> transaction) {
    return Container(
      padding: EdgeInsets.all(15),
      margin: EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Transaction Name
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    transaction['name'] ?? "",
                    style: TextStyle(
                        fontSize: font_16, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(
                    height: height_8,
                  ),
                  Text(
                    transaction['amount'] ?? "",
                    style: TextStyle(fontSize: font_14, color: Colors.black54),
                  ),
                ],
              ),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(40, 20),
                    backgroundColor: transaction['status'] == "Paid"
                        ? lightGreen
                        : Colors.grey,
                    shape: RoundedRectangleBorder(
                      side: BorderSide(color: darkGreen),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    padding: EdgeInsets.symmetric(horizontal: 20, vertical: 5),
                  ),
                  child: Text(
                    transaction['status'] ?? "",
                    style: TextStyle(color: Colors.black),
                  ),
                ),
              ),
            ],
          ),
          SizedBox(
            height: height_8,
          ),

          Text(
            transaction['date'] ?? "",
            style: TextStyle(fontSize: font_14, color: Colors.black54),
          ),
          SizedBox(height: height_8),
          // Transaction ID
          Text(
            "Transaction ID: ${transaction['transactionId']}",
            style: TextStyle(fontSize: font_12, color: Colors.black38),
          ),
          SizedBox(height: 10),
          // Status button
        ],
      ),
    );
  }
}
