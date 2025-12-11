/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/modules/authentication/model/signup_response_model.dart';
import 'package:buzzgrab/app/modules/home/model/category_list_response_model.dart';
import '../../../../../export.dart';
import '../../../../main.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../cart/model/cart_list_response_model.dart';
import '../../product/model/product_list_response_model.dart';
import '../../splash_module/controllers/splash_controller.dart';
import '../model/banner_list_response_model.dart';
import '../model/order_model/new_order_model.dart';
import 'package:http/http.dart' as http;

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
    callApi();
  }

  @override
  void onReady() {
    callApi();
    super.onReady();
  }

  callApi() async {
    Future.wait([
      callCategoryListApi(isLoading: true),
      callProductListApi(isLoading: true),
      callBannerListApi(isLoading: true),
      callCartListApi(),
      hitProfileApi(),
    ]);
  }

  Future hitProfileApi() async {
    try {
      final response = DioClient().get('auth/profile', skipAuth: false);
      userResponseModel = UserResponseModel.fromJson(await response);
      if (userResponseModel.data != null) {
        signUpData.value = userResponseModel.data ?? UserData();
      }
    } catch (e, str) {

      return NetworkExceptions.getDioException(e, str, "auth/profile");
    }
  }

  /// User check api
  void hitCheckApi() async {
    try {
      final response = DioClient().get('api/check-user-api/', skipAuth: false);
      UserResponseModel userResponseModel =
          UserResponseModel.fromJson(await response);

    } catch (e, str) {
      Future.error(
          NetworkExceptions.getDioException(e, str, "api/check-user-api/"));
      toast(NetworkExceptions.messageData);
    }
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


    super.onInit();
  }

  @override
  void onClose() {
    timer?.cancel();
    super.onClose();
  }

  /// Static List data
  var categories = [
    {"icon": 'assets/icons/category_img.png', "title": "Alcohol"},
    {"icon": 'assets/icons/category_img.png', "title": "Ice"},
    {"icon": 'assets/icons/category_img.png', "title": "Snacks"},
    {"icon": 'assets/icons/category_img.png', "title": "Soft Drinks"},
  ].obs;

  var products = [
    {
      "image": 'assets/icons/product_img.png',
      "title": "Grey Goose Vodka",
      "rating": 4.7,
      "price": 39.99,
      "tag": "20% off"
    },
    {
      "image": 'assets/icons/product_img.png',
      "title": "Jack Daniel’s",
      "rating": 4.7,
      "price": 39.99,
      "tag": "In stock"
    },
    {
      "image": 'assets/icons/product_img.png',
      "title": "Heineken Pack 6",
      "rating": 4.7,
      "price": 39.99,
      "tag": "20% off"
    },
  ].obs;

  /// Call Category List Api
  RxBool isCategoryLoading = false.obs;
  CategoryListResponseModel categoryListResponseModel =
      CategoryListResponseModel();
  RxList<CategoryDataModel> categoryList = <CategoryDataModel>[].obs;

  Future callCategoryListApi({isLoading = false}) async {
    if (isLoading == true) {
      isCategoryLoading.value = true;
    }
    await dioClient.get('category/activeList', skipAuth: false).then(
      (value) {
        if (value != null) {
          try {
            categoryListResponseModel =
                CategoryListResponseModel.fromJson(value);
            categoryList.value = categoryListResponseModel.data ?? [];
            isCategoryLoading.value = false;
          } catch (e, st) {
            isCategoryLoading.value = false;
          }
        }
      },
    ).onError(
      (error, stackTrace) {
        isCategoryLoading.value = false;
        NetworkExceptions.getDioException(
            error, stackTrace, 'category/activeList');
        toast(NetworkExceptions.messageData);
      },
    );
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
    await dioClient.get('users/product/allProduct', skipAuth: false).then(
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

  /// Call Cart list Api
  CartListResponseModel cartListResponseModel = CartListResponseModel();
  RxList<CartList> cartList = <CartList>[].obs;

  Future callCartListApi() async {
    await dioClient.get('users/cart/list', skipAuth: false).then(
      (value) {
        if (value != null) {
          cartListResponseModel = CartListResponseModel.fromJson(value);
          cartList.value = cartListResponseModel.data?.cartList ?? [];
        }
      },
    ).onError(
      (error, stackTrace) {
        NetworkExceptions.getDioException(error, stackTrace, 'users/cart/list');
      },
    );
  }

  /// Call Banner list Api
  RxBool isBannerLoading=false.obs;
  BannerListResponseModel bannerListResponseModel = BannerListResponseModel();
  RxList<BannerDataModel> bannerList = <BannerDataModel>[].obs;

  Future callBannerListApi({isLoading}) async {
    if(isLoading==true){
      isBannerLoading.value=true;
    }
    await dioClient.get('banner/activeBanners', skipAuth: false).then(
      (value) {
        if (value != null) {
          bannerListResponseModel = BannerListResponseModel.fromJson(value);
          bannerList.value = bannerListResponseModel.data ?? [];
          isBannerLoading.value=false;
          bannerList.refresh();
        }
      },
    ).onError(
      (error, stackTrace) {
        isBannerLoading.value=false;
        isBannerLoading.value=false;
        NetworkExceptions.getDioException(
            error, stackTrace, 'banner/activeBanners');
      },
    );
  }
}

class LocationDetails {
  dynamic latitude;
  dynamic longitude;
  dynamic placeName;

  LocationDetails({this.latitude, this.longitude, this.placeName});
}
