import 'package:buzzgrab/app/modules/address/model/add_address_response_model.dart';
import 'package:buzzgrab/app/modules/address/model/address_list_response_model.dart';
import 'package:get/get.dart';

import '../../../../main.dart';
import '../../../core/widgets/custom_flashbar.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../../routes/app_routes.dart';

class AddressController extends GetxController {
  var selectedIndex = 0.obs;

  // var addressList = <AddressModel>[
  //   AddressModel(
  //     name: "Sonwani",
  //     address: "Flat no. 367, ABC Apartment, Mohali, Chandigarh, 124563",
  //     phone: "+1 986** ***56",
  //   ),
  //   AddressModel(
  //     name: "Sonwani",
  //     address: "Flat no. 367, ABC Apartment, Mohali, Chandigarh, 124563",
  //     phone: "+1 986** ***56",
  //   ),
  //   AddressModel(
  //     name: "Sonwani",
  //     address: "Flat no. 367, ABC Apartment, Mohali, Chandigarh, 124563",
  //     phone: "+11 986** ***56",
  //   ),
  // ].obs;

  void selectAddress(int index) {
    selectedIndex.value = index;
  }

  void editAddress(int index) {
 Get.toNamed(AppRoutes.addAddressScreen,arguments: {'addressData':addressList[index],'isEdit':true});
  }

  void addNewAddress() {
    Get.toNamed(AppRoutes.locationPickerScreen,arguments: {'isAdd':true});
  }


  /// Call Address list Api
  RxBool isLoading=true.obs;
  AddressListResponseModel addressListResponseModel=AddressListResponseModel();
  RxList<AddressDataModel> addressList=<AddressDataModel>[].obs;
 callAddressListApi() async {
    await dioClient
        .get('users/address/list',skipAuth: false)
        .then((value) async {
      if (value != null) {
        addressListResponseModel=AddressListResponseModel.fromJson(value);
        addressList.value=addressListResponseModel.data??[];
        isLoading.value=false;
      }
    }).onError((error, stackTrace) {
      isLoading.value=false;
      NetworkExceptions.getDioException(
          error, stackTrace, "users/address/list");
      toast(NetworkExceptions.messageData);
    });
  }

  /// onReady Method
  @override
  void onReady() {
    callAddressListApi();
    super.onReady();
  }
}

class AddressModel {
  String name;
  String address;
  String phone;

  AddressModel({
    required this.name,
    required this.address,
    required this.phone,
  });
}
