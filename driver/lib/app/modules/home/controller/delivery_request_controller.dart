import '../../../../export.dart';
import '../../../../main.dart';
import '../model/order_model/new_order_model.dart';

class DeliveryRequestController extends TbaseController {
  RxList<NewOrderData> newOrders = <NewOrderData>[].obs;

  getNewOrder() async {
    await DioClient()
        .get('/api/available-order-listing-api/', skipAuth: false)
        .then((v) {
      newOrders.clear();
      NewOrderModel newOrderModel = NewOrderModel.fromJson(v);
      newOrders.addAll(newOrderModel.data ?? []);
    }).onError((e, s) {
      ;
    });
  }

  @override
  void onInit() {
    getNewOrder();
    super.onInit();
  }

  changeOrderStatus({choice, orderId}) async {
    customLoader.show(Get.context);
    await DioClient()
        .post('/api/change-order-status-api/',
            data: FormData.fromMap({
              'order_id': orderId,
              'choice': choice,
            }),
            skipAuth: false)
        .then((v) {
      MessageResponseModel messageResponseModel =
          MessageResponseModel.fromJson(v);
      getNewOrder();
      Get.toNamed(AppRoutes.liveOrderScreen, arguments: {
        'orderId': orderId,
      })?.then((e) {
        newOrders.clear();
        getNewOrder();
      });
      customLoader.hide();
      toast(messageResponseModel.message);
    }).onError((e, s) {
      customLoader.hide();
    });
  }
}
