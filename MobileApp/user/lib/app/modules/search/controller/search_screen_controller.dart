import 'package:buzzgrab/app/data/remote_service/network/tbase_controller.dart';
import 'package:get/get.dart';

import '../../../../main.dart';
import '../../../core/widgets/custom_flashbar.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../product/model/product_list_response_model.dart';

class SearchScreenController extends TbaseController {
  var searchText = "".obs;

  // Search history
  var searchHistory = ["Circuits", "Membrane", "Switches", "EC"].obs;

  // Recent product search results


  /// Add to recent search
  void addSearch(String text) {
    if (text.trim().isEmpty) return;
    searchHistory.insert(0, text);
    searchText("");
  }

  /// Remove single search history item
  void removeItem(int index) {
    searchHistory.removeAt(index);
  }

  /// Clear all
  void clearAll() {
    searchHistory.clear();
  }

  /// Call Product List Api
  RxBool isProductLoading = false.obs;
  ProductListResponseModel productListResponseModel =
      ProductListResponseModel();
  RxList<ProductDataModel> productList = <ProductDataModel>[].obs;

  Future callProductListApi({isLoading = false,search}) async {
    if (isLoading == true) {
      isProductLoading.value = true;
    }
    await dioClient.get('users/product/allProduct', skipAuth: false,queryParameters: {'search':search??""}).then(
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

  @override
  void onReady() {
    callProductListApi();
    super.onReady();
  }
}
