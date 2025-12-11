import '../../../../export.dart';
import '../../home/model/order_model/new_order_model.dart';
import '../../home/model/order_model/order_model.dart';

class OrderScreenController extends TbaseController {
  RxInt selectedTab = 0.obs;
  RxInt page = 1.obs;

  RxList<OrderDataModel> myOrders = <OrderDataModel>[].obs;
  OrderModel orderModel = OrderModel();

  getOrders({status}) async {
    // Remove API for now & generate static list
    await Future.delayed(Duration(milliseconds: 400));

    List<OrderDataModel> allOrders = [

      // -------------------- NEW / ASSIGNED ORDER -------------------- //
      OrderDataModel(
        id: 201,
        orderId: "DRV-201",
        status: 4, // new
        finalAmount: 750.00,
        restaurant: DeliveryAddress(
          id: 101,
          restaurantName: "Royal Liquor Hub",
          address: "Sector 22 Market, Chandigarh",
          latitude: 30.7048, // near your provided location
          longitude: 76.7175,
        ),
        deliveryAddress: DeliveryAddress(
          id: 501,
          fullName: "Rohit Verma",
          address: "House No. 411, Sector 36B, Chandigarh",
          latitude: 30.7063,
          longitude: 76.7189,
        ),
      ),

      // -------------------- ACCEPTED / READY FOR PICKUP -------------------- //
      OrderDataModel(
        id: 202,
        orderId: "DRV-202",
        status: 8, // accepted
        finalAmount: 1250.50,
        restaurant: DeliveryAddress(
          id: 102,
          restaurantName: "The Wine Shop",
          address: "Sector 17 Plaza, Chandigarh",
          latitude: 30.7051,
          longitude: 76.7164,
        ),
        deliveryAddress: DeliveryAddress(
          id: 502,
          fullName: "Priya Thakur",
          address: "Sector 41, Chandigarh",
          latitude: 30.7037,
          longitude: 76.7192,
        ),
      ),

      // -------------------- COMPLETED ORDER -------------------- //
      OrderDataModel(
        id: 203,
        orderId: "DRV-203",
        status: 5, // completed
        finalAmount: 980.00,
        restaurant: DeliveryAddress(
          id: 103,
          restaurantName: "Cheers Wine & Beer",
          address: "Sector 26 Madhya Marg",
          latitude: 30.7045,
          longitude: 76.7178,
        ),
        deliveryAddress: DeliveryAddress(
          id: 503,
          fullName: "Simran Kaur",
          address: "PGI Sector 12, Chandigarh",
          latitude: 30.7060,
          longitude: 76.7196,
        ),
      ),
    ];

    if(status == '5'){              // completed tab
      myOrders.assignAll(allOrders.where((e) => e.status == 5));
    }else{                          // new/active tab
      myOrders.assignAll(allOrders.where((e) => e.status != 5));
    }

    print("📦 Driver Orders Loaded: ${myOrders.length}");
  }



  // getOrders({
  //   status,
  // }) async {
  //   await DioClient()
  //       .post('/api/driver-orders-listing-api/',
  //           queryParameters: {'page': page.value, 'status': status},
  //           skipAuth: false)
  //       .then((v) {
  //     myOrders.clear();
  //     orderModel = OrderModel.fromJson(v);
  //     myOrders.addAll(orderModel.data ?? []);
  //   }).onError((e, s) {
  //     ;
  //   });
  // }

  @override
  void onInit() {
    getOrders(status: '4,8,9,10');
    super.onInit();
  }
}
