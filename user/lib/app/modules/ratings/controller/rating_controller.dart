import 'package:buzzgrab/app/data/remote_service/network/tbase_controller.dart';
import 'package:get/get_rx/src/rx_types/rx_types.dart';

class RatingController extends TbaseController {
  // 0 = All, 1 = Customer, 2 = Restaurant
  RxInt selectedTab = 0.obs;

  // Example dummy rating data
  List<Map<String, dynamic>> allRatings = [
    {
      "name": "Ahmed Al-Sabah",
      "type": "Customer",
      "rating": 4,
      "date": "2025-10-08",
      "ratingDes": "Very professional and delivered on time. Great service!"
    },
    {
      "name": "La Pizzeria",
      "type": "Restaurant",
      "rating": 5,
      "date": "2025-10-06",
      "ratingDes": "Quick pickup and very polite delivery partner."
    },
  ];

  List<Map<String, dynamic>> get filteredRatings {
    if (selectedTab.value == 1) {
      return allRatings.where((r) => r["type"] == "Customer").toList();
    } else if (selectedTab.value == 2) {
      return allRatings.where((r) => r["type"] == "Restaurant").toList();
    }
    return allRatings;
  }
}
