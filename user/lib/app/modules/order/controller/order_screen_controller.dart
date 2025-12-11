import '../../../../export.dart';
import '../../home/model/order_model/new_order_model.dart';
import '../../home/model/order_model/order_model.dart';

class OrderScreenController extends TbaseController {
  RxInt selectedTab = 0.obs;
  RxInt page = 1.obs;

  RxList<OrderDataModel> myOrders = <OrderDataModel>[].obs;
  OrderModel orderModel = OrderModel();

  getOrders({
    status,
  }) async {
    await DioClient()
        .post('/api/driver-orders-listing-api/',
            queryParameters: {'page': page.value, 'status': status},
            skipAuth: false)
        .then((v) {
      myOrders.clear();
      orderModel = OrderModel.fromJson(v);
      myOrders.addAll(orderModel.data ?? []);
    }).onError((e, s) {
      ;
    });
  }

  @override
  void onInit() {
    getOrders(status: '4,8,9,10');
    super.onInit();
  }
}
