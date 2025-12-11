import 'package:buzzgrab/app/core/utils/helper_widget.dart';
import 'package:buzzgrab/app/core/values/app_colors.dart';
import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:buzzgrab/app/core/widgets/custom_appbar.dart';
import 'package:buzzgrab/app/modules/network-image/network_image.dart';
import 'package:buzzgrab/app/modules/product/controller/product_list_controller.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../core/widgets/shimmer_view_widget.dart';

class ProductListScreen extends StatelessWidget {
  final controller = Get.put(ProductListController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: CustomAppBar(
        centerTitle: true,
        appBarTitleWidget: Obx(() {
          return controller.isSearching.value
              ? _searchField()
              : Text(
                  "Alcohol",
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                );
        }),
        actionWidget: [
          Obx(() {
            return controller.isSearching.value
                ? GestureDetector(
                    onTap: () => controller.stopSearch(),
                    child: Padding(
                      padding: const EdgeInsets.only(right: 12),
                      child: Text(
                        "Cancel",
                        style: TextStyle(
                          color: Colors.red,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  )
                : GestureDetector(
                    onTap: () => controller.startSearch(),
                    child: Padding(
                      padding: const EdgeInsets.only(right: 12),
                      child: Icon(Icons.search, color: Colors.black),
                    ),
                  );
          }),
        ],
      ),
      body: Obx(() => controller.isProductLoading.value == true
          ? shimmerGrid()
          : controller.productList.isEmpty
              ? noDataToShow()
              : GridView.builder(
                  padding: EdgeInsets.all(16),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.68,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                  ),
                  itemCount: controller.productList.length,
                  itemBuilder: (context, index) {
                    final p = controller.productList[index];

                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.grey.shade300),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // IMAGE SECTION
                          Stack(
                            children: [
                              NetworkImageWidget(
                                imageurl: p.productImg?[0].url ?? "",
                                imageHeight: 140,
                                imageWidth: double.infinity,
                                imageFitType: BoxFit.cover,
                                radiusAll: 14,
                              ),

                              // STATUS BADGE
                              Positioned(
                                top: 10,
                                left: 10,
                                child: Container(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 5),
                                  decoration: BoxDecoration(
                                    color: p.quantity >= 1
                                        ? Colors.green
                                        : Colors.red,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    p.quantity >= 1
                                        ? "In stock"
                                        : "Out of stock",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),

                              // FAVORITE ICON
                              Obx(() => Positioned(
                                top: 10,
                                right: 10,
                                child: GestureDetector(
                                  onTap: () async{
                                    if( p.isWishlist==true){

                                      await controller.callAddWishlistApi();
                                      p.isWishlist.value = false;
                                      print('p.isWishlist.value---${p.isWishlist.value}');
                                      controller.update();
                                    }else{
                                      await controller.callAddWishlistApi();
                                      p.isWishlist.value = true;
                                      print('p.isWishlist.value---${p.isWishlist.value}');
                                      controller.update();
                                    }

                                  },
                                  child: Icon(
                                    p.isWishlist == true
                                        ? Icons.favorite
                                        : Icons.favorite_border,
                                    color: p.isWishlist == true
                                        ? Colors.red
                                        : Colors.black,
                                    size: 24,
                                  ),
                                ),
                              ),),
                            ],
                          ),

                          // PRODUCT NAME
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(
                              p.productName ?? "",
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: Colors.black87,
                              ),
                            ),
                          ),

                          // SIZE
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8),
                            child: Text(
                              p.size ?? "",
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 13,
                              ),
                            ),
                          ),

                          SizedBox(height: 4),

                          // PRICE
                          Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8),
                            child: productPrice(p.price,p.price)/*Text(
                              "\$${p.price}",
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.blue,
                                fontWeight: FontWeight.w700,
                              ),
                            ),*/
                          ),
                        ],
                      ),
                    );
                  },
                )),
    );
  }

  Widget productPrice(var price, var mrp) {
    return Row(
      children: [
        // Selling Price
        Text(
          "\$${mrp.toStringAsFixed(2)}",
          style: TextStyle(
            fontSize: 11,
            color: Colors.grey,
            decoration: TextDecoration.lineThrough,
          ),
        ),

        SizedBox(width: 4),
        // Original MRP with strikethrough
        Text(
          "\$${price.toStringAsFixed(2)}",
          style: TextStyle(
            fontSize: font_13,
            color: colorAppColor,
            fontWeight: FontWeight.w700,
          ),
        ),
        SizedBox(width: 4),

        // Optional discount %
        if (mrp > price)
          Container(
            padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            decoration: BoxDecoration(
              color: Colors.green.shade100,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              "${(((mrp - price) / mrp) * 100).round()}% OFF",
              style: TextStyle(
                fontSize: 12,
                color: Colors.green.shade800,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
      ],
    );
  }


  Widget _searchField() {
    return Container(
      // height: 40,
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(10),
      ),
      child: TextField(
        autofocus: true,
        onChanged: (v) => controller.searchText.value = v,
        decoration: const InputDecoration(
          hintText: "Search...",
          border: InputBorder.none,
          // remove underline
          enabledBorder: InputBorder.none,
          // remove underline
          focusedBorder: InputBorder.none,
          // remove underline
          disabledBorder: InputBorder.none,
          // remove underline
          errorBorder: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        ),
      ),
    );
  }
}
