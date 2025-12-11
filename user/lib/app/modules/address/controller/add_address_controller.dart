import 'package:buzzgrab/app/modules/address/model/add_address_response_model.dart';
import 'package:buzzgrab/main.dart';
import 'package:geocoding/geocoding.dart';
import 'package:get/get.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../../core/widgets/custom_flashbar.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../../routes/app_routes.dart';

class AddAddressController extends GetxController {
  // Selected map location
  var selectedLocation = "24th Street, New York, NY 10010".obs;
  RxBool isEdit = false.obs;

  // Text controllers
  var houseNoController = TextEditingController();
  var blockController = TextEditingController();
  var landmarkController = TextEditingController();
  var receiverNameController = TextEditingController();
  var phoneController = TextEditingController();
  Rx<Placemark> placemark = Placemark().obs;
  Rx<LatLng> selectedLatLng = const LatLng(40.7128, -74.0060).obs; // fallback
  @override
  void onInit() {
    receiverNameController.text = signUpData.value.fullName ?? "";
    phoneController.text = signUpData.value.mobileNo ?? "";
    getArgument();
    super.onInit();
  }

  getArgument() {
    if (Get.arguments != null) {
      if (Get.arguments['address'] != null) {
        placemark.value = Get.arguments['address'] ?? Placemark();
        selectedLatLng.value =
            Get.arguments['latlng'] ?? LatLng(40.7128, -74.0060);
        houseNoController.text = placemark.value.subThoroughfare ?? "";
        blockController.text = placemark.value.postalCode ?? "";
        landmarkController.text = placemark.value.street ?? "";
      } else {
        addressDataModel.value = Get.arguments['addressData'] ?? Placemark();
        isEdit.value = Get.arguments['isEdit'] ?? false;
        selectedLatLng.value = LatLng(
            addressDataModel.value.location?.coordinates?[0] ?? 0.0,
            addressDataModel.value.location?.coordinates?[1] ?? 0.0);
        houseNoController.text = addressDataModel.value.house ?? "";
        blockController.text = addressDataModel.value.landMark ?? "";
        landmarkController.text = addressDataModel.value.building ?? "";
        receiverNameController.text = signUpData.value.fullName ?? "";
        phoneController.text = signUpData.value.mobileNo ?? "";
      }
    }
  }

  void changeLocation() {
    if (isEdit.value) {
      Get.offNamed(AppRoutes.locationPickerScreen, arguments: {'isAdd': true});
    } else {
      Get.back();
    }
  }

  void confirmLocation() {
    Get.snackbar("Success", "Address Saved Successfully!");
  }

  /// Call Add Address Api
  //users/cart/add
  AddAddressResponseModel addAddressResponseModel = AddAddressResponseModel();
  Rx<AddressDataModel> addressDataModel = AddressDataModel().obs;

  callAddAddressApi() async {
    // customLoader.show(Get.overlayContext);
    var request = {
      'name': signUpData.value.fullName ?? "",
      'countryCode': signUpData.value.countryCode,
      'mobile': signUpData.value.mobileNo,
      'house': placemark.value.name ?? "",
      'building': placemark.value.street ?? "",
      'landMark': placemark.value.locality ?? "",
      'latitude': selectedLatLng.value.latitude,
      'longitude': selectedLatLng.value.longitude
    };
    await dioClient
        .post('users/address/add', skipAuth: false, data: request)
        .then((value) async {
      if (value != null) {
        addAddressResponseModel = AddAddressResponseModel.fromJson(value);
        addressDataModel.value = addAddressResponseModel.data!;
        Get.offAllNamed(AppRoutes.mainScreen,
            arguments: {'bottom_nav_index': 3});
      }
      customLoader.hide();
    }).onError((error, stackTrace) {
      NetworkExceptions.getDioException(error, stackTrace, "users/address/add");
      toast(NetworkExceptions.messageData);
    });
  }

  /// Edit Address Api
  callEditAddressApi() async {
    // customLoader.show(Get.overlayContext);
    var request = {
      'name': signUpData.value.fullName ?? "",
      'countryCode': signUpData.value.countryCode,
      'mobile': signUpData.value.mobileNo,
      'house': houseNoController.text ?? "",
      'building': blockController.text ?? "",
      'landMark': landmarkController.text ?? "",
      'latitude': selectedLatLng.value.latitude,
      'longitude': selectedLatLng.value.longitude
    };
    await dioClient
        .put('users/address/edit/${addressDataModel.value.sId}',
            skipAuth: false, data: request)
        .then((value) async {
      if (value != null) {
        addAddressResponseModel = AddAddressResponseModel.fromJson(value);
        addressDataModel.value = addAddressResponseModel.data!;
        Get.offAllNamed(AppRoutes.mainScreen,
            arguments: {'bottom_nav_index': 3});
      }
      customLoader.hide();
    }).onError((error, stackTrace) {
      NetworkExceptions.getDioException(
          error, stackTrace, "users/address/edit/");
      toast(NetworkExceptions.messageData);
    });
  }
}
