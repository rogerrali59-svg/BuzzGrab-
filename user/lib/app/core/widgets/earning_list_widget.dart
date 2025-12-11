import '../../../export.dart';

class EarningListWidget extends StatelessWidget {
  final name,amount,date,transactionId;
   EarningListWidget({super.key, this.name, this.amount, this.date, this.transactionId});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        border: Border.all(color: borderColor),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(name??"",
                  style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold)),
              const Spacer(),
              Container(
                padding:
                const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: greenBg,
                  border: Border.all(color: Colors.green),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: const Text("Paid",
                    style: TextStyle(
                        color: Colors.green, fontWeight: FontWeight.normal)),
              ),
            ],
          ),
          SizedBox(height: height_2),
          Text("SAR ${amount??""}",
              style:
              TextStyle(fontWeight: FontWeight.normal, fontSize: font_13,color: Colors.grey)),
          SizedBox(height: height_6),
          Text("Date: ${date??""}",
              style: TextStyle(color: Colors.grey, fontSize: font_13)),
          Text("Transaction ID: ${transactionId??""}",
              style: TextStyle(color: Colors.grey, fontSize: font_13)),
        ],
      ),
    );
  }
}
