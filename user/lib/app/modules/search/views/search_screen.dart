import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:buzzgrab/app/core/widgets/custom_textfield.dart';
import 'package:buzzgrab/app/modules/search/views/filter_screen.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../core/widgets/product_card_widget.dart';
import '../../../routes/app_routes.dart';
import '../controller/search_screen_controller.dart';

class SearchScreen extends StatelessWidget {
  final controller = Get.put(SearchScreenController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _header(),
            _searchBar(),
            _historyList(),
            SizedBox(height: 20),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text("Recent Searches",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
            ),
            Expanded(child: _productList())
          ],
        ),
      ),
    );
  }

  // 🔹 Header
  Widget _header() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 15, vertical: 15),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => Get.back(),
            child: Icon(Icons.arrow_back, size: 25),
          ),
          Expanded(
            child: Center(
              child: Text("Search",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            ),
          ),
          SizedBox(width: 25),
        ],
      ),
    );
  }

  // 🔹 Search Box
  Widget _searchBar() {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 15),
      child: Container(
        decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(12)),
        child: Row(
          children: [
            Expanded(
              child: TextFieldWidget(
                isHeading: false,
                topMargin: margin_0,
                prefixIcon: Icon(Icons.search, color: Colors.grey),
                onFieldSubmitted: (value) =>
                    controller.callProductListApi(search: value),
                suffixIcon: InkWell(
                    splashColor: Colors.transparent,
                    onTap: () {
                      Get.toNamed(AppRoutes.filterScreen);
                    },
                    child: Icon(Icons.tune_rounded, color: Colors.grey)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 🔹 Recent search history list
  Widget _historyList() {
    return Obx(() => Column(
          children: controller.searchHistory.map((item) {
            int index = controller.searchHistory.indexOf(item);
            return Padding(
              padding: EdgeInsets.symmetric(horizontal: 15, vertical: 10),
              child: Row(
                children: [
                  Icon(Icons.history, color: Colors.grey),
                  SizedBox(width: 15),
                  Expanded(
                      child: Text(item,
                          style:
                              TextStyle(fontSize: 16, color: Colors.black87))),
                  GestureDetector(
                    onTap: () => controller.removeItem(index),
                    child: Icon(Icons.close, size: 22, color: Colors.grey),
                  )
                ],
              ),
            );
          }).toList(),
        ));
  }

  // 🔹 Product Cards List
  Widget _productList() {
    return Obx(() => ListView.builder(
          padding: EdgeInsets.symmetric(horizontal: 15),
          itemCount: controller.productList.length,
          itemBuilder: (context, index) {
            var p = controller.productList[index];
            return ProductCard(
              quantity: p.quantity,
              image: p.productImg?[0].url ?? "",
              title: p.productName ?? "",
              rating: p.averageRating ?? "",
              price: p.price ?? "",
              tag: p.quantity >= 1 ? "In stock" : 'Out of Stock',
              onTap: () {
                Get.toNamed(
                  AppRoutes.productDetailScreen,
                  arguments: {'id': p.sId},
                )?.then((value) {
                  controller.callProductListApi();
                });
              },
            );
          },
        ));
  }
}
