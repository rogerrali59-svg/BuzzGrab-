

import '../../../../export.dart';
import '../../../../main.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../model/product_list_response_model.dart';

class ProductListController extends TbaseController {
  // Sample Products Data
  Timer? debounce;
  var id;



  /// Show Search TextField
   RxBool isSearching = false.obs;
  RxString searchText = "".obs;

  void startSearch() {
    isSearching.value = true;
  }

  void stopSearch() {
    isSearching.value = false;
    searchText.value = "";
  }
  @override
  void onInit() {
    getArgument();
    super.onInit();
  }

  @override
  void onReady() {
    callProductListApi(isLoading: true);
    super.onReady();
  }

  /// getArgument
 getArgument(){
    if(Get.arguments!=null){
      id=Get.arguments['id']??"";
    }
 }


  /// Call Product List Api
  RxBool isProductLoading = false.obs;
  ProductListResponseModel productListResponseModel =
  ProductListResponseModel();
  RxList<ProductDataModel> productList = <ProductDataModel>[].obs;

  Future callProductListApi({isLoading = false}) async {
    if (isLoading == true) {
      isProductLoading.value = true;
    }
    await dioClient.get('users/product/allProduct', skipAuth: false,queryParameters: {'categoryId':id??""}).then(
          (value) {
        if (value != null) {
          productListResponseModel = ProductListResponseModel.fromJson(value);
          productList.value = productListResponseModel.data ?? [];
          isProductLoading.value = false;
        }
      },
    ).onError(
          (error, stackTrace) {
        isProductLoading.value = false;
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/product/allProduct');
        toast(NetworkExceptions.messageData);
      },
    );
  }


  /// Call Add Wishlist Api
  callAddWishlistApi({value=true,index}) async {
    var request = {
      'productId': id ?? "",
      'isWishlist': value
    };
    await dioClient
        .post('users/wishlist/add', skipAuth: false, data: request)
        .then(
          (value) {
        if (value != null) {
          MessageResponseModel messageResponseModel = MessageResponseModel.fromJson(value);
          customBottomToast(messageResponseModel.message ?? "");

        }
      },
    ).onError(
          (error, stackTrace) {
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/wishlist/add');
      },
    );
  }


}
