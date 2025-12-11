import 'package:get/get.dart';
import 'package:flutter/material.dart';

import '../../../../export.dart';
import '../../../../main.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../../home/model/category_list_response_model.dart';
import '../../product/model/product_list_response_model.dart';
import '../model/brand_list_response_model.dart';

class FilterController extends TbaseController {
  // CATEGORY
  var categories = ["ALL", "Alcohol", "Ice", "Snacks", "Soft Beverages"].obs;
  var selectedCategory = "ALL".obs;

  // BRAND
  var brands = ["Alcohol", "Alcohols", "Alcohoaal"].obs;
  var selectedBrands = <String>[].obs;

  // LOCATION
  var location = "".obs;
  TextEditingController locationController = TextEditingController();

  // POPULARITY
  var popularity = 3.0.obs;
  Rx<RangeValues> popularityRange = RangeValues(0, 5).obs;
  Rx<RangeValues> priceRange = RangeValues(20, 700).obs;

  // PRICE
  var selectedPrice = 250.0.obs;

  // STOCK
  var stockOptions = ["In Stock", "Low Stock"];
  var selectedStock = "".obs;

  // FILTER APPLIED FLAG
  var isFilterApplied = false.obs;

  // Product List
  var products = [
    {
      "name": "Grey Goose Vodka",
      "img": "https://picsum.photos/200",
      "rating": "4.7",
      "price": "\$39.99",
      "stock": "In stock"
    },
    {
      "name": "Jack Daniel’s",
      "img": "https://picsum.photos/200",
      "rating": "4.7",
      "price": "\$39.99",
      "stock": "In stock"
    }
  ].obs;

  // CLEAR FILTER
  void clearFilter() {
    selectedCategory.value = "ALL";
    selectedBrands.clear();
    selectedPrice.value = 250.0;
    popularity.value = 3.0;
    selectedStock.value = "";
    location.value = "";

    locationController.clear();
    isFilterApplied.value = false;
  }

  /// Call Category List Api
  RxBool isCategoryLoading = false.obs;
  CategoryListResponseModel categoryListResponseModel =
      CategoryListResponseModel();
  RxList<CategoryDataModel> categoryList = <CategoryDataModel>[].obs;
  RxString selectedCategoryId = "".obs; // single select
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
            categoryList.insert(0, CategoryDataModel(title: "All", sId: '12'));
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

  String get selectedCategoryName {
    final match = categoryList.firstWhere(
      (c) => c.sId == selectedCategoryId.value,
      orElse: () => CategoryDataModel(title: "All"),
    );
    return match.title ?? "";
  }

  List get selectedBrandNames {
    return brandList
        .where((b) => selectedBrandIds.contains(b.sId))
        .map((b) => b.title ?? "")
        .toList();
  }

  /// Call Brand List Api
  RxBool isBrandLoading = false.obs;
  BrandListResponseModel brandListResponseModel = BrandListResponseModel();
  RxList<BrandDataModel> brandList = <BrandDataModel>[].obs;
  RxList<String> selectedBrandIds = <String>[].obs; // multi select

  Future callBrandListApi({isLoading = false}) async {
    if (isLoading == true) {
      isBrandLoading.value = true;
    }
    await dioClient.get('brand/activeList', skipAuth: false).then(
      (value) {
        if (value != null) {
          try {
            brandListResponseModel = BrandListResponseModel.fromJson(value);
            brandList.value = brandListResponseModel.data ?? [];
            isBrandLoading.value = false;
          } catch (e, st) {
            isBrandLoading.value = false;
          }
        }
      },
    ).onError(
      (error, stackTrace) {
        isBrandLoading.value = false;
        NetworkExceptions.getDioException(
            error, stackTrace, 'brand/activeList');
        toast(NetworkExceptions.messageData);
      },
    );
  }

  /// Call Product List Api
  RxBool isProductLoading = false.obs;
  ProductListResponseModel productListResponseModel =
      ProductListResponseModel();
  RxList<ProductDataModel> productList = <ProductDataModel>[].obs;

  Future callProductListApi({isLoading = false, search}) async {
    if (isLoading == true) {
      isProductLoading.value = true;
    }
    await dioClient
        .get('users/product/allProduct', skipAuth: false, queryParameters: {
      'search': search ?? "",
      'categoryId':
          selectedCategoryId.value == '' || selectedCategoryId.value == '12'
              ? ''
              : selectedCategoryId.value,
      'brandId': selectedBrandIds.map((e) => e).toList(),
      'minPrice': priceRange.value.start,
      'maxPrice': priceRange.value.end,
      'minRating': popularityRange.value.start ?? '',
      'maxRating': popularityRange.value.end ?? '',
      'stockStatus': selectedStock.value == ''
          ? ''
          : selectedStock.value == 'In Stock'
              ? 1
              : 2
    }).then(
      (value) {
        if (value != null) {
          productListResponseModel = ProductListResponseModel.fromJson(value);
          productList.value = productListResponseModel.data ?? [];
          isFilterApplied.value = true;
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
    callCategoryListApi();
    callBrandListApi();
    super.onReady();
  }
}
