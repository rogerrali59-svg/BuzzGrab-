import 'package:buzzgrab/app/data/remote_service/network/network_exceptions.dart';
import 'package:buzzgrab/app/data/remote_service/network/tbase_controller.dart';
import 'package:buzzgrab/export.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../../../main.dart';
import '../model/order_model/order_detail_model.dart';

class LiveOrderController extends TbaseController {
  TextEditingController otpController = TextEditingController();
  Rx<GoogleMapController?> mapController = Rx<GoogleMapController?>(null);

  Rx<PolylinePoints> polylinePoints =
      PolylinePoints(apiKey: "AIzaSyCUYRJVXr2z4hwANWdTGzvOlfyhLY1f5bs").obs;
  RxSet<Marker> markers = <Marker>{}.obs;
  RxSet<Polyline> polylines = <Polyline>{}.obs;

  void addMarker(LatLng position, String name, {add}) {
    final String markerId = position.toString();
    loadBikeIcon();
    markers.add(
      Marker(
        markerId: MarkerId(markerId),
        position: position,
        icon: add == true && bikeIcon.value != null
            ? bikeIcon.value!
            : BitmapDescriptor.defaultMarker,
        infoWindow: InfoWindow(
          title: name, // Name displayed when marker tapped
        ),
      ),
    );
  }

  LatLngBounds getBounds(List<LatLng> points) {
    double? x0, x1, y0, y1;
    for (LatLng latLng in points) {
      if (x0 == null) {
        x0 = x1 = latLng.latitude;
        y0 = y1 = latLng.longitude;
      } else {
        if (latLng.latitude > x1!) x1 = latLng.latitude;
        if (latLng.latitude < x0) x0 = latLng.latitude;
        if (latLng.longitude > y1!) y1 = latLng.longitude;
        if (latLng.longitude < y0!) y0 = latLng.longitude;
      }
    }
    return LatLngBounds(
      southwest: LatLng(x0!, y0!),
      northeast: LatLng(x1!, y1!),
    );
  }

  void zoomToPolyline(List<LatLng> points) async {
    if (mapController.value == null || points.isEmpty) return;

    LatLngBounds bounds = getBounds(points);

    // Delay until the map is fully rendered
    await Future.delayed(Duration(milliseconds: 100));

    try {
      await mapController.value!.animateCamera(
        CameraUpdate.newLatLngBounds(bounds, 50),
      );
    } catch (e) {
      print("Camera update failed: $e");
    }
  }

  getPolyline({destinationLat, destinationLng}) async {
    print('getPolyline $destinationLat \n $destinationLng');
    polylines.clear();
    polylinePoints.value =
        PolylinePoints(apiKey: 'AIzaSyCUYRJVXr2z4hwANWdTGzvOlfyhLY1f5bs');
    PolylineResult result;

    result = await polylinePoints.value
        .getRouteBetweenCoordinates(
      request: PolylineRequest(
        origin: PointLatLng(currentPosition.value!.latitude ?? 0.0,
            currentPosition.value!.longitude ?? 0.0),
        destination: PointLatLng(double.parse('${destinationLat}'),
            double.parse('${destinationLng}')),
        mode: TravelMode.driving,
      ),
    )
        .onError((e, s) {
      print("Camera update failed: eeeeeeeeeeeeeeeeee $e");
      print("Camera update failed: ssssssssssssssssss $s");
      return Future.value(PolylineResult());
    });
    // }

    if (result.points.isNotEmpty) {
      List<LatLng> polylineCoordinates = result.points
          .map((point) => LatLng(point.latitude, point.longitude))
          .toList();

      // Create a Polyline object
      Polyline polyline = Polyline(
        polylineId: PolylineId("route"),
        color: Colors.blue,
        width: 5,
        points: polylineCoordinates,
      );

      // Add it to the set
      polylines.add(polyline);
      polylines.refresh();
    }
  }

  // The current active step (0 to 3)
  var currentStep = 0.obs;

  void nextStep() {
    print('currentStep.value ${currentStep.value}');
    if (currentStep.value < 4) {
      // 4 total steps
      if (currentStep.value == 0) {
        changeOrderStatus(orderId: orderDetailsModel.value.data?.id, choice: 9);
      } else if (currentStep.value == 2) {
        changeOrderStatus(
            orderId: orderDetailsModel.value.data?.id, choice: 10);
      }
    }
  }

  markCompleteOrder() async {
    if (otpController.text.isEmpty) {
      toast('Enter OTP to proceed');
      return;
    }
    customLoader.show(Get.context);
    await DioClient()
        .post('/api/mark-order-complete-api/',
            skipAuth: false,
            data: FormData.fromMap({
              'order_id': orderId,
              'otp': otpController.text.trim(),
            }))
        .then((v) {
      MessageResponseModel messageResponseModel =
          MessageResponseModel.fromJson(v);
      Get.offAllNamed(AppRoutes.mainScreen);
      currentStep.value++;
      customLoader.hide();
      toast(messageResponseModel.message);
    }).onError((e, s) {
      customLoader.hide();
      return NetworkExceptions.getDioException(
          e, s, '/api/mark-order-complete-api/');
    });
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
      getOrderDetails();
      currentStep.value++;
      // Get.toNamed(AppRoutes.liveOrderScreen);
      customLoader.hide();
      toast(messageResponseModel.message);
    }).onError((e, s) {
      customLoader.hide();
    });
  }

  Future<void> openPolylineInGoogleMaps({required List<LatLng> points}) async {
    // Build polyline path string: "lat1,lng1/lat2,lng2/lat3,lng3..."
    final path = points.map((p) => "${p.latitude},${p.longitude}").join("/");

    final Uri url = Uri.parse("https://www.google.com/maps/dir/$path");

    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      throw "Could not open Google Maps.";
    }
  }

  Future<void> openGoogleMapNavigation(double lat, double lng) async {
    final Uri url = Uri.parse("google.navigation:q=$lat,$lng&mode=d");

    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      throw "Could not open Google Maps navigation.";
    }
  }

  Future<void> openBikeRoute(double lat, double lng) async {
    final Uri url = Uri.parse(
        "https://www.google.com/maps/dir/?api=1&destination=$lat,$lng&travelmode=bicycling");

    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      throw "Could not open Google Maps.";
    }
  }

  var orderId;
  RxBool completed = false.obs;
  Rx<OrderDetailsModel> orderDetailsModel = OrderDetailsModel().obs;
  RxList<LatLng> allPoints = <LatLng>[].obs;
  RxBool isLoading = false.obs;

  getOrderDetails({loading = false}) async {
    if (orderId == null) {
      return;
    }
    // if (loading == true) {
    //   isLoading.value = true;
    // }
    await DioClient()
        .get('/api/order-detail-api/', skipAuth: false, queryParameters: {
      'order_id': orderId,
    }).then((v) async {
      orderDetailsModel.value = OrderDetailsModel.fromJson(v);
      allPoints.clear();

      if (orderDetailsModel.value.data?.status == ORDER_OUT_FOR_DELIVERY) {
        currentStep.value = 2;
      }
      updateStatus();
      if (orderDetailsModel.value.data?.status == ORDER_OUT_FOR_DELIVERY ||
          orderDetailsModel.value.data?.status == 10 ||
          orderDetailsModel.value.data?.status == 4) {
        await getPolyline(
          destinationLat:
              orderDetailsModel.value.data?.deliveryAddress?.latitude,
          destinationLng:
              orderDetailsModel.value.data?.deliveryAddress?.longitude,
        );
        markers.clear();
        addMarker(
            LatLng(
                double.parse(
                    '${orderDetailsModel.value.data?.deliveryAddress?.latitude}'),
                double.parse(
                    '${orderDetailsModel.value.data?.deliveryAddress?.longitude}')),
            '${orderDetailsModel.value.data?.deliveryAddress?.fullName ?? ''}');
      } else {
        if (orderDetailsModel.value.data?.status == 9) {
        } else {
          await getPolyline(
            destinationLat: orderDetailsModel.value.data?.restaurant?.latitude,
            destinationLng: orderDetailsModel.value.data?.restaurant?.longitude,
          );
          markers.clear();
          addMarker(
              LatLng(
                  double.parse(
                      '${orderDetailsModel.value.data?.restaurant?.latitude}'),
                  double.parse(
                      '${orderDetailsModel.value.data?.restaurant?.longitude}')),
              '${orderDetailsModel.value.data?.restaurant?.restaurantName ?? ''}');
        }
      }
      print(
          'orderDetailsModel.value.data?.createdBy?.latitude ${orderDetailsModel.value.data?.deliveryAddress?.latitude}');
      print(
          'orderDetailsModel.value.data?.createdBy?.latitude ${orderDetailsModel.value.data?.deliveryAddress?.longitude}');

      allPoints.value =
          polylines.expand((polyline) => polyline.points).toList();
      allPoints.refresh();

      zoomToPolyline(allPoints);
      // if (orderDetailsModel.value.data?.status == 5 ||
      //     orderDetailsModel.value.data?.status == 4 ||
      //     orderDetailsModel.value.data?.status == 10 ||
      //     orderDetailsModel.value.data?.status == 9) {
      //   timer?.cancel();
      // }
      isLoading.value = false;
    }).onError((e, s) {
      isLoading.value = false;
    });
  }

  updateStatus() {
    print(
        'orderDetailsModel.value.data?.status ${orderDetailsModel.value.data?.status}');
    if (orderDetailsModel.value.data?.status == ORDER_COMPLETED) {
      currentStep.value = 4;
    } else if (orderDetailsModel.value.data?.status == 9) {
      currentStep.value = 1;
    } else if (orderDetailsModel.value.data?.status == 4) {
      currentStep.value = 2;
    } else if (orderDetailsModel.value.data?.status == 10) {
      currentStep.value = 3;
    }
  }

  getArgs() {
    print('Get.arguments ${Get.arguments}');
    if (Get.arguments != null) {
      orderId = Get.arguments['orderId'];
      completed.value = Get.arguments['completed'] ?? false;

      addMarker(
          add: true,
          LatLng(
            currentPosition.value!.latitude ?? 0.0,
            currentPosition.value!.longitude ?? 0.0,
          ),
          '');
      if ((Get.currentRoute == AppRoutes.deliveryRequestScreen ||
              Get.currentRoute == AppRoutes.liveOrderScreen ||
              Get.currentRoute == AppRoutes.home) &&
          completed.value == false) {
        if (orderDetailsModel.value.data?.status == '9' ||
            orderDetailsModel.value.data?.status == '10' ||
            orderDetailsModel.value.data?.status == '4') {
          timer?.cancel();
        } else {
          timer = Timer.periodic(Duration(seconds: 5), (v) async {
            await getOrderDetails();
          });
        }
      } else {
        getOrderDetails(loading: true);
      }
    }
  }

  // BitmapDescriptor? bikeIcon;

  Rx<BitmapDescriptor?> bikeIcon = Rx<BitmapDescriptor?>(null);

  @override
  void onInit() {
    super.onInit();
  }

  Timer? timer;

  @override
  void onReady() {
    getArgs();

    super.onReady();
  }

  @override
  void onClose() {
    timer?.cancel();
    super.onClose();
  }

  void loadBikeIcon() async {
    bikeIcon.value = await BitmapDescriptor.asset(
      ImageConfiguration(size: Size(48, 48)), // optional: size
      restaurant_icon,
    );

    bikeIcon.refresh();
  }
}
