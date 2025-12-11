import 'package:buzzgrab/app/data/remote_service/network/network_exceptions.dart';
import 'package:buzzgrab/app/data/remote_service/network/tbase_controller.dart';
import 'package:buzzgrab/main.dart';
import 'package:get/get.dart';

import '../../../core/widgets/custom_flashbar.dart';
import '../../../data/common_models/message_response_model.dart';
import '../model/cart_list_response_model.dart';

class CartController extends TbaseController {
  RxList<CartItemModel> cartItems = <CartItemModel>[].obs;

  @override
  void onInit() {
    super.onInit();

    /// Dummy Data
    cartItems.addAll([
      CartItemModel(
        name: "Grey Goose Vodka",
        image: "https://images.unsplash.com/photo-1606756790138-8e25e8a7cdad",
        size: "750 ml",
        price: 39.99,
        quantity: 1,
      ),
      CartItemModel(
        name: "Heineken Pack 6",
        image: "https://images.unsplash.com/photo-1606756790138-8e25e8a7cdad",
        size: "750 ml",
        price: 12.20,
        quantity: 1,
      ),
    ]);
  }

  @override
  void onReady() {
    callCartListApi();
    super.onReady();
  }

  void increaseQty(int index) {
    callIncreaseQuantityApi(
        quantity: cartList[index].quantity++, id: cartList[index].sId);
  }

  void decreaseQty(int index) {
    callDecreaseQuantityApi(
        quantity: cartList[index].quantity--, id: cartList[index].sId);
    cartList.refresh();
  }

  void removeItem(int index) {
    cartItems.removeAt(index);
  }

  double get subtotal =>
      cartItems.fold(0, (sum, item) => sum + (item.price * item.quantity));

  double get tax => subtotal * 0.08;

  double get deliveryFee => 4.99;

  double get total => subtotal + tax + deliveryFee;

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

  /// Call Increase Quantity Api
  Future callIncreaseQuantityApi({quantity, id}) async {
    print('users/cart/increaseQuantity/${id}');
    var request = {
      'quantity': quantity,
    };
    await dioClient
        .put('users/cart/increaseQuantity/${id}',
            skipAuth: false, data: request)
        .then(
      (value) {
        if (value != null) {
          MessageResponseModel messageResponseModel = MessageResponseModel.fromJson(value);
          customBottomToast(messageResponseModel.message ?? "");
          callCartListApi();
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
  Future callDecreaseQuantityApi({quantity, id}) async {
    var request = {
      'quantity': quantity ?? 0,
    };
    await dioClient
        .put('users/cart/decreaseQuantity/${id}',
            skipAuth: false, data: request)
        .then(
      (value) {
        if (value != null) {
          MessageResponseModel messageResponseModel = MessageResponseModel.fromJson(value);
          customBottomToast(messageResponseModel.message ?? "");
          callCartListApi();
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

  /// Call Delete Cart Item Api

  callDeleteCartItemApi({id}) async {
    await dioClient.delete('users/cart/removeCart/${id}', skipAuth: false).then(
      (value) {
        if (value != null) {
          MessageResponseModel messageResponseModel =
              MessageResponseModel.fromJson(value);
          customBottomToast(messageResponseModel.message??"");
          callCartListApi();
        }
      },
    ).onError(
      (error, stackTrace) {
        NetworkExceptions.getDioException(
            error, stackTrace, 'users/cart/removeCart/');
      },
    );
  }
}

class CartItemModel {
  String name;
  String image;
  double price;
  int quantity;
  String size;

  CartItemModel({
    required this.name,
    required this.image,
    required this.price,
    required this.quantity,
    required this.size,
  });
}
