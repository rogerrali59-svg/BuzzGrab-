import 'package:alcoholdeliverydriver/app/data/remote_service/network/tbase_controller.dart';
import 'package:get/get_rx/src/rx_types/rx_types.dart';

class EarningController extends TbaseController {
  RxInt selectedTab = 0.obs;

  // Example data (you can replace with real data)
  RxDouble totalBalance = 1245.00.obs;
  RxDouble thisWeekEarnings = 545.00.obs;
  RxInt totalOrders = 24.obs;
  RxDouble avgPerOrder = 8.95.obs;

  // Example data for each tab
  RxInt todaysOrders = 24.obs;
  RxDouble averagePerOrder = 8.75.obs;
}
