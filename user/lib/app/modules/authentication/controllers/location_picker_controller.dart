import 'package:buzzgrab/app/data/remote_service/network/network_exceptions.dart';
import 'package:buzzgrab/main.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';

import '../../../../export.dart';

class LocationPickerController extends TbaseController {
  Rx<LatLng> selectedLatLng = const LatLng(28.6139, 77.2090).obs;
  RxString selectedAddress = "Fetching address...".obs;
  RxBool loadingAddress = false.obs;
  RxBool isAddAddress = false.obs;

  GoogleMapController? mapController;
  Placemark locationResponseModel = Placemark();

  @override
  void onInit() {
    super.onInit();
    getArgument();
    initLocation();   // FIXED
  }

  getArgument() {
    if (Get.arguments != null) {
      isAddAddress.value = Get.arguments['isAdd'] ?? false;
    }
  }

  Future<void> initLocation() async {
    LocationPermission permission = await Geolocator.checkPermission();

    if (permission == LocationPermission.denied ||
        permission == LocationPermission.deniedForever) {
      permission = await Geolocator.requestPermission();
    }

    getCurrentLocation();
  }

  Future<void> getCurrentLocation() async {
    try {
      final pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      final current = LatLng(pos.latitude, pos.longitude);
      selectedLatLng.value = current;

      if (mapController != null) {
        mapController!.animateCamera(
          CameraUpdate.newLatLngZoom(current, 15),
        );
      }

      fetchAddress(current);
    } catch (e) {
      selectedAddress.value = "Unable to get location";
    }
  }

  Future<void> fetchAddress(LatLng pos) async {
    try {
      loadingAddress.value = true;

      final result =
      await placemarkFromCoordinates(pos.latitude, pos.longitude);
      final place = result.first;

      locationResponseModel = place;
      selectedAddress.value =
      "${place.street}, ${place.locality}, ${place.administrativeArea} ${place.postalCode}";
    } catch (e) {
      selectedAddress.value = "Cannot fetch address";
    }

    loadingAddress.value = false;
  }

  void onMapCreated(GoogleMapController controller) {
    mapController = controller;
  }

  void onCameraMove(CameraPosition pos) {
    selectedLatLng.value = pos.target;
  }

  void onCameraIdle() {
    fetchAddress(selectedLatLng.value);
  }

  callSetAddressApi() async {
    customLoader.show(Get.context);
    var request = {
      'address': selectedAddress.value,
      'latitude': selectedLatLng.value.latitude,
      'longitude': selectedLatLng.value.longitude,
    };

    await dioClient
        .put('auth/editProfile',
        skipAuth: false, data: FormData.fromMap(request))
        .then((value) {
      if (value != null) {
        Get.toNamed(AppRoutes.iDVerificationScreen);

      customLoader.hide();}
    }).onError((error, stackTrace) {
      customLoader.hide();
      NetworkExceptions.getDioException(
          error, stackTrace, 'auth/editProfile');
    });
  }
}

