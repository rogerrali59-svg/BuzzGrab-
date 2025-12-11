import 'package:auto_height_grid_view/auto_height_grid_view.dart';
import 'package:buzzgrab/app/core/values/app_colors.dart';
import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:buzzgrab/app/core/values/text_styles.dart';
import 'package:buzzgrab/app/core/widgets/custom_appbar.dart';
import 'package:buzzgrab/app/core/widgets/shimmer_view_widget.dart';
import 'package:buzzgrab/app/core/widgets/text_view.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../routes/app_routes.dart';
import '../controller/product_detail_controller.dart';

class ProductDetailScreen extends StatelessWidget {
  final controller = Get.put(ProductDetailController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        actionWidget: [
          Obx(
            () => controller.cartList.isEmpty
                ? SizedBox()
                : Stack(
                    children: [
                      GestureDetector(
                          onTap: () {
                            Get.toNamed(AppRoutes.cartScreen)?.then(
                              (value) {
                                controller.callCartListApi();
                              },
                            );
                          },
                          child: Icon(Icons.shopping_cart)
                              .marginOnly(top: margin_10)),
                      Positioned(
                          top: 0,
                          right: 0,
                          child: TextView(
                              text: '${controller.cartList.length}',
                              textStyle: textStyleBodyMedium()
                                  .copyWith(fontWeight: FontWeight.bold)))
                    ],
                  ).marginOnly(right: margin_15),
          )
        ],
      ),
      backgroundColor: Colors.white,
      bottomNavigationBar: buildBottomBar(),
      body: Obx(() {
        if (controller.isLoading.value) {
          return ProductDetailShimmer();
        }

        return SingleChildScrollView(
          controller: controller.scrollController,
          child: Column(
            children: [
              /// 🔥🔥 ANIMATED PRODUCT HEADER
              AnimatedSwitcher(
                duration: Duration(milliseconds: 350),
                switchInCurve: Curves.easeOut,
                switchOutCurve: Curves.easeIn,

                transitionBuilder: (child, animation) {
                  return SlideTransition(
                    position: Tween<Offset>(
                      begin: Offset(0, 0.15),
                      end: Offset.zero,
                    ).animate(animation),
                    child: FadeTransition(
                      opacity: animation,
                      child: child,
                    ),
                  );
                },

                /// IMPORTANT: changes when product changes
                child: Column(
                  key: ValueKey(controller.productDetailDataModel.value.sId),
                  children: [
                    productImageWidget(),
                    productDetailWidget(),
                    const SizedBox(height: 20),
                    productDataWidget(),
                    const SizedBox(height: 12),
                    relatedProductList(),
                  ],
                ),
              ),
            ],
          ),
        );
      }),
    );
  }

  // ---------------- PRODUCT IMAGE ----------------
  Widget productImageWidget() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            CarouselSlider(
              items: controller.productDetailDataModel.value.productImg
                  ?.map((img) {
                return Image.network(
                  img.url ?? "",
                  width: double.infinity,
                  height: 200,
                  fit: BoxFit.cover,
                );
              }).toList(),
              options: CarouselOptions(
                height: 200,
                viewportFraction: 1,
                autoPlay: true,
                autoPlayInterval: Duration(seconds: 3),
              ),
            ),
            Positioned(
              right: 12,
              top: 12,
              child: GestureDetector(
                onTap: () {
                  if(controller.productDetailDataModel.value.isWishlist==true){
                    controller.callAddWishlistApi(value: false);
                  }else{
                    controller.callAddWishlistApi(value: true);
                  }

                },
                child: Icon(
                    controller.productDetailDataModel.value.isWishlist == true
                        ? Icons.favorite
                        : Icons.favorite_border,
                    color: controller.productDetailDataModel.value.isWishlist ==
                            true
                        ? Colors.red
                        : Colors.black),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ---------------- PRODUCT DETAILS ----------------
  Widget productDetailWidget() {
    return Obx(() => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Container(
            padding: EdgeInsets.all(18),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: Colors.white,
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                /// NAME + PRICE
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      controller.productDetailDataModel.value.productName ?? "",
                      style: TextStyle(
                          fontSize: font_18,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'inter'),
                    ),
                    Text(
                      "\$${controller.productDetailDataModel.value.mrp}",
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey,
                        decoration: TextDecoration.lineThrough,
                      ),
                    ),
                    Text(
                      "\$${controller.price.value}",
                      style: TextStyle(
                        fontSize: font_18,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue.shade600,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 5),
                Text(
                  "${controller.productDetailDataModel.value.size}",
                  style: TextStyle(color: Colors.grey),
                ),

                const SizedBox(height: 18),

                /// QUANTITY
                Row(
                  children: [
                    Text("Quantity", style: TextStyle(fontSize: 16)),
                    const SizedBox(width: 12),
                    Obx(() => Row(
                          children: [
                            buildCircleButton(
                              icon: Icons.remove,
                              onTap: controller.decrease,
                            ),
                            const SizedBox(width: 18),
                            Text(
                              controller.quantity.value.toString(),
                              style: TextStyle(
                                  fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(width: 18),
                            buildCircleButton(
                              icon: Icons.add,
                              onTap: controller.increase,
                            ),
                          ],
                        )),
                  ],
                ),
              ],
            ),
          ),
        ));
  }

  // ---------------- PRODUCT DATA ----------------
  Widget productDataWidget() {
    return Obx(() => Container(
          width: Get.width,
          padding: EdgeInsets.all(16),
          margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(radius_10),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              buildContentSection(
                title: "Brand",
                content:
                    "${controller.productDetailDataModel.value.brandDetails?.title}",
              ),
              buildContentSection(
                title: "Description",
                content: removeHtmlTags(
                    controller.productDetailDataModel.value.description ?? ""),
              ),
              buildContentSection(
                title: "Ingredients",
                content: removeHtmlTags(
                    controller.productDetailDataModel.value.ingredients ?? ""),
              ),
            ],
          ),
        ));
  }

  String removeHtmlTags(String htmlText) {
    final exp = RegExp(r"<[^>]*>", multiLine: true, caseSensitive: false);
    return htmlText.replaceAll(exp, "").trim();
  }

  // ---------------- RELATED LIST ----------------
  Widget relatedProductList() {
    return Obx(() => controller.productList.isEmpty
        ? SizedBox()
        : Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Text("Related Products",
                    style:
                        TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
              ),
              const SizedBox(height: 12),
              buildRelatedList(),
            ],
          ));
  }

  Widget buildRelatedList() {
    return Obx(() => SizedBox(
          width: Get.width,
          child: AutoHeightGridView(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: controller.productList.length,
            builder: (_, index) {
              final item = controller.productList[index];

              return GestureDetector(
                onTap: () {
                  /// 🔥 Load new product + trigger animation
                  // controller.loadNewProductForAnimation(item.sId);
                  controller.id = controller.productList[index].sId;
                  controller.scrollToTop();
                  controller.callProductDetailApi();
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(14),
                        child: Image.network(
                          item.productImg?[0].url ?? "",
                          height: 140,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.all(8),
                        child: Text(
                          item.productName ?? "",
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                              fontSize: font_14, fontWeight: FontWeight.w500),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: Text(
                          "\$${item.price}",
                          style: TextStyle(
                              fontSize: font_14,
                              color: Colors.blue,
                              fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ));
  }

  // ---------------- BUTTONS ----------------
  Widget buildBottomBar() {
    return Obx(() => controller.isLoading.value
        ? SizedBox()
        : Container(
            padding: EdgeInsets.all(16),
            height: 80,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                  backgroundColor: colorAppColor,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14))),
              onPressed: () => controller.callAddToCartProductApi(),
              icon: Icon(Icons.shopping_cart_outlined,
                  color: Colors.white, size: 22),
              label: Text("Add to Cart",
                  style: TextStyle(fontSize: 18, color: Colors.white)),
            ),
          ));
  }

  Widget buildCircleButton(
      {required IconData icon, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: CircleAvatar(
        backgroundColor: Color.fromRGBO(223, 234, 251, 1),
        child: Icon(icon, color: Colors.black),
      ),
    );
  }

  Widget buildContentSection({required String title, required String content}) {
    return Container(
      padding: EdgeInsets.all(10),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title,
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
        SizedBox(height: 3),
        Text(content,
            style: TextStyle(
                color: Color.fromRGBO(33, 33, 33, 0.54),
                fontWeight: FontWeight.w500)),
      ]),
    );
  }
}
