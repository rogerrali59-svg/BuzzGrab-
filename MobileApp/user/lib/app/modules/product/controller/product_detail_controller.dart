import 'package:buzzgrab/app/data/remote_service/network/network_exceptions.dart';
import 'package:buzzgrab/app/modules/cart/model/cart_list_response_model.dart';
import 'package:buzzgrab/app/modules/product/model/product_detail_response_model.dart';
import 'package:buzzgrab/main.dart';
import '../../../../export.dart';
import '../model/product_list_response_model.dart';

class ProductDetailController extends TbaseController {
  RxInt quantity = 1.obs;
  RxInt price = 0.obs;
  RxBool isLoading = true.obs;

  /// Scroll Animation
  final ScrollController scrollController = ScrollController();

  /// Smooth scroll to top
  void scrollToTop() {
    scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOut,
    );
  }

  /// Increase Quantity
  void increase() {
    if (quantity < productDetailDataModel.value.quantity) {
      quantity++;
      calculatePrice();
    }
  }

  /// Decrease Quantity
  void decrease() {
    if (quantity > 1) {
      quantity--;
      calculatePrice();
    }
  }

  void calculatePrice() {
    int unitPrice =
        int.tryParse(productDetailDataModel.value.price.toString()) ?? 0;
    price.value = unitPrice * quantity.value;
  }

  var id;

  @override
  void onInit() {
    getArgument();
    super.onInit();
  }

  /// get Arguments
  getArgument() {
    if (Get.arguments != null) {
      id = Get.arguments['id'] ?? '';
    }
  }

  @override
  void onReady() {
    callProductDetailApi();
    callCartListApi();
    super.onReady();
  }

  /// Call Product detail Api
  ProductDetailResponseModel productDetailResponseModel =
      ProductDetailResponseModel();
  Rx<ProductDetailDataModel> productDetailDataModel =
      ProductDetailDataModel().obs;

  callProductDetailApi() async {
    await dioClient.get('users/product/details/${id}', skipAuth: false).then(
      (value) {
        if (value != null) {
          productDetailResponseModel =
              ProductDetailResponseModel.fromJson(value);
          productDetailDataModel.value = productDetailResponseModel.data!;
          price.value = productDetailDataModel.value.price;
          productDetailDataModel.refresh();
          isLoading.value = false;
          callRelatedProductListApi();
        }
      },
    ).onError(
      (error, stackTrace) {
        isLoading.value = false;
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/product/details/');
      },
    );
  }

  /// Call Add to Cart Product Api
  callAddToCartProductApi() async {
    var request = {
      'productId': id ?? "",
      'price': productDetailDataModel.value.price ?? "",
      'quantity': quantity.value,
      'size': productDetailDataModel.value.size ?? ""
    };
    await dioClient.post('users/cart/add', skipAuth: false, data: request).then(
      (value) {
        if (value != null) {
          MessageResponseModel messageResponseModel = MessageResponseModel.fromJson(value);
          customBottomToast(messageResponseModel.message ?? "");
          callProductDetailApi();
          callCartListApi();
        }
      },
    ).onError(
      (error, stackTrace) {
        NetworkExceptions.getDioException(error, stackTrace, 'users/cart/add');
      },
    );
  }

  /// Call Increase Quantity Api
  callIncreaseQuantityApi({quantity}) async {
    print('users/cart/increaseQuantity/${id}');
    var request = {
      'quantity': quantity,
    };
    await DioClient()
        .put('users/cart/increaseQuantity/${id}',
            skipAuth: false, data: request)
        .then(
      (value) {
        if (value != null) {
          MessageResponseModel messageResponseModel = MessageResponseModel();
          toast(messageResponseModel.message ?? "");
          callProductDetailApi();
        }
      },
    ).onError(
      (error, stackTrace) {
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/cart/increaseQuantity/');
      },
    );
  }

  /// Call Decrease Quantity Api
  callDecreaseQuantityApi({quantity}) async {
    var request = {
      'quantity': quantity ?? 0,
    };
    await dioClient
        .put('users/cart/decreaseQuantity/${id}',
            skipAuth: false, data: request)
        .then(
      (value) {
        if (value != null) {
          MessageResponseModel messageResponseModel = MessageResponseModel();
          toast(messageResponseModel.message ?? "");
          callProductDetailApi();
        }
      },
    ).onError(
      (error, stackTrace) {
        print('error----$error');
        print('stackTrace----$stackTrace');
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/cart/decreaseQuantity/');
      },
    );
  }

  /// Call Add Wishlist Api
  callAddWishlistApi({value=true}) async {
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
          callProductDetailApi();
        }
      },
    ).onError(
      (error, stackTrace) {
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/wishlist/add');
      },
    );
  }

  /// Call Related Product List Api

  ProductListResponseModel productListResponseModel =
      ProductListResponseModel();
  RxList<ProductDataModel> productList = <ProductDataModel>[].obs;

  callRelatedProductListApi() async {
    await dioClient.get('users/product/relatedProduct', skipAuth: false).then(
      (value) {
        if (value != null) {
          productListResponseModel = ProductListResponseModel.fromJson(value);
          productList.value = productListResponseModel.data ?? [];
        }
      },
    ).onError(
      (error, stackTrace) {
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/product/relatedProduct');
        toast(NetworkExceptions.messageData);
      },
    );
  }

  /// Call Cart list Api
  CartListResponseModel cartListResponseModel = CartListResponseModel();
  RxList<CartList> cartList = <CartList>[].obs;

  callCartListApi() async {
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
}
