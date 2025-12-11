import 'package:buzzgrab/export.dart';

import '../../../../main.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../product/model/product_list_response_model.dart';
import '../model/wishlist_response_model.dart';

class WishlistProductListController extends TbaseController{
  // Sample Products Data
  RxList<Map<String, dynamic>> products = [
    {
      "name": "Grey Goose Vodka",
      "size": "750 ml",
      "price": "39.99",
      "image":
      "https://i.ibb.co/6sFtV7H/greygoose.jpg",
      "stock": true,
      "isFav": false,
    },
    {
      "name": "Smirnoff Vodka",
      "size": "750 ml",
      "price": "39.99",
      "image":
      "https://i.ibb.co/MRrtdZj/smirnoff.jpg",
      "stock": true,
      "isFav": false,
    },
    {
      "name": "Smirnoff Vodka",
      "size": "750 ml",
      "price": "39.99",
      "image":
      "https://i.ibb.co/2Ft8F0z/beer.jpg",
      "stock": true,
      "isFav": false,
    },
    {
      "name": "Smirnoff Vodka",
      "size": "750 ml",
      "price": "39.99",
      "image":
      "https://i.ibb.co/dk5SsqG/drink1.jpg",
      "stock": true,
      "isFav": false,
    },
    {
      "name": "Smirnoff Vodka",
      "size": "750 ml",
      "price": "39.99",
      "image":
      "https://i.ibb.co/9bSbq7t/heineken.jpg",
      "stock": true,
      "isFav": false,
    },
    {
      "name": "Smirnoff Vodka",
      "size": "750 ml",
      "price": "39.99",
      "image":
      "https://i.ibb.co/CMdpWHn/whiskey.jpg",
      "stock": false,
      "isFav": false,
    },
  ].obs;

  void toggleFav(int i) {
    products[i]["isFav"] = !products[i]["isFav"];
    products.refresh();
  }

  /// Call Product List Api
  RxBool isProductLoading = false.obs;
  WishListResponseModel wishListResponseModel =
  WishListResponseModel();
  RxList<WishlistDataModel> wishList = <WishlistDataModel>[].obs;

  Future callProductListApi({isLoading = false}) async {
    if (isLoading == true) {
      isProductLoading.value = true;
    }
    await dioClient.get('users/wishlist/list', skipAuth: false).then(
          (value) {
        if (value != null) {
          wishListResponseModel = WishListResponseModel.fromJson(value);
          wishList.value = wishListResponseModel.data ?? [];
          isProductLoading.value = false;
        }
      },
    ).onError(
          (error, stackTrace) {
        isProductLoading.value = false;
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/wishlist/list');
        toast(NetworkExceptions.messageData);
      },
    );
  }

  @override
  void onReady() {
    // callProductListApi();
    super.onReady();
  }
}