/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/app/modules/authentication/model/signup_response_model.dart';
import '../../../../../export.dart';
import '../../../../main.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../splash_module/controllers/splash_controller.dart';
import '../model/order_model/new_order_model.dart';
import 'package:http/http.dart' as http;

import '../widget/header_widget.dart';

class HomeController extends TbaseController {
  @override
  void onDetached() {
    // TODO: implement onDetached
  }

  @override
  void onHidden() {
    // TODO: implement onHidden
  }

  @override
  void onInactive() {
    // TODO: implement onInactive
  }

  @override
  void onPaused() {
    // TODO: implement onPaused
  }

  @override
  void onResumed() {
    // TODO: implement onResumed
  }

  @override
  void onReady() {
    super.onReady();
  }



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

  Future<Map<String, dynamic>> getDistanceTime({
    required double pickupLat,
    required double pickupLng,
    required double dropLat,
    required double dropLng,
  }) async {
    final apiKey = "YOUR_GOOGLE_API_KEY";

    final url = "https://maps.googleapis.com/maps/api/directions/json?"
        "origin=$pickupLat,$pickupLng&"
        "destination=$dropLat,$dropLng&"
        "mode=driving&"
        "key=$apiKey";

    final response = await http.get(Uri.parse(url));
    final data = jsonDecode(response.body);

    if (data['status'] != 'OK') {
      throw "Error fetching directions: ${data['status']}";
    }

    final route = data["routes"][0]["legs"][0];

    final distance = route["distance"]["text"]; // e.g. "12.4 km"
    final duration = route["duration"]["text"]; // e.g. "18 mins"

    return {
      "distance": distance,
      "duration": duration,
    };
  }

  Timer? timer;

  @override
  void onInit() {
    // hitCheckApi();

    // timer = Timer.periodic(Duration(seconds: 5), (v) async {
    //   await getNewOrder();
    // });

    super.onInit();
  }

  @override
  void onClose() {
    timer?.cancel();
    super.onClose();
  }


  /// User check api
  void hitCheckApi() async {
    try {
      final response = DioClient().get('/auth/profile', skipAuth: false);
      userResponseModel = UserResponseModel.fromJson(await response);
      if (userResponseModel.data != null) {
        signUpData.value = userResponseModel.data ?? UserData();
        if (signUpData.value.isVerified == false) {
          Get.offAllNamed(AppRoutes.logIn);
        } else {
          Get.offAllNamed(AppRoutes.mainScreen);
        }
      }
    } catch (e, str) {
      // Get.toNamed(AppRoutes.chooseLanguageScreen);
      if (e.toString().contains("No route to host")) {
        toast('Server error, please try again later');
        networkDialog(
          server: true,
          onRetry: () {
            hitCheckApi();
            //  Get.back();
          },
        );
      } else if (e.toString().contains("SocketException") ||
          e.toString().contains("Network is unreachable") ||
          e.toString().contains("Failed host lookup")) {
        networkDialog(
          onRetry: () {
            hitCheckApi();
            //  Get.back();
          },
        );
      }
      Get.offAllNamed(AppRoutes.logIn);
      return NetworkExceptions.getDioException(e, str, "/auth/profile");
      toast(NetworkExceptions.messageData);
    }
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
      });
      customLoader.hide();
      toast(messageResponseModel.message);
    }).onError((e, s) {
      customLoader.hide();
    });
  }
}

class LocationDetails {
  dynamic latitude;
  dynamic longitude;
  dynamic placeName;

  LocationDetails({this.latitude, this.longitude, this.placeName});
}
