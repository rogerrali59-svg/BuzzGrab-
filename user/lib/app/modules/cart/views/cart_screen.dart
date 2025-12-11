import 'package:buzzgrab/app/core/utils/helper_widget.dart';
import 'package:buzzgrab/app/core/values/app_colors.dart';
import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:buzzgrab/app/core/values/text_styles.dart';
import 'package:buzzgrab/app/core/widgets/custom_textfield.dart';
import 'package:buzzgrab/app/core/widgets/text_view.dart';
import 'package:buzzgrab/app/modules/cart/model/cart_list_response_model.dart';
import 'package:buzzgrab/app/modules/network-image/network_image.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../routes/app_routes.dart';
import '../controller/cart_controller.dart';

class CartScreen extends StatelessWidget {
  final CartController controller = Get.put(CartController());

  @override
  Widget build(BuildContext context) {
    return Obx(
      () => Scaffold(
        appBar: AppBar(
          title: Text("Cart(${controller.cartList.length})",
              style: TextStyle(color: Colors.black)),
          backgroundColor: Colors.white,
          centerTitle: true,
          elevation: 0,
          leading: const BackButton(color: Colors.black),
        ),
        body: Obx(() {
          return SingleChildScrollView(
            child: Column(
              children: [
                controller.cartList.isEmpty
                    ? noDataToShow(inputText: 'No Cart Item Found')
                    : ListView.builder(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        itemCount: controller.cartList.length,
                        itemBuilder: (context, index) {
                          final item = controller.cartList[index];
                          return _cartItem(item, index);
                        },
                      ),
                Container(
                    padding: EdgeInsets.symmetric(
                        horizontal: margin_10, vertical: margin_15),
                    decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey.shade200),
                        borderRadius: BorderRadius.circular(radius_7)),
                    child: Row(
                      children: [
                        TextView(
                            text: 'View all coupons',
                            textStyle: textStyleBodyMedium().copyWith(
                                color: Colors.black,
                                fontWeight: FontWeight.w500,
                                fontSize: font_14)),
                        Spacer(),
                        Icon(
                          Icons.arrow_forward_ios_rounded,
                          color: colorAppColor,
                        )
                      ],
                    )).marginSymmetric(horizontal: 16),
                SizedBox(height: height_10,),
                Container(
                  child: Row(
                    children: [
                      Expanded(
                        child: TextFieldWidget(
                          isHeading: false,
                          topMargin: margin_0,
                        ),
                      ),
                      SizedBox(width: width_10,),
                      Container(
                        padding: EdgeInsets.symmetric(
                            horizontal: margin_5, vertical: margin_12),
                        decoration: BoxDecoration(
                            color: colorAppColor,
                            borderRadius: BorderRadius.circular(radius_5)),
                        child: TextView(
                            text: 'Apply',
                            textStyle: textStyleBodyMedium()
                                .copyWith(color: Colors.white)),
                      )
                    ],
                  ),
                ).marginSymmetric(horizontal: 16),
                Obx(
                  () => controller.cartList.isEmpty
                      ? SizedBox()
                      : _priceSummary(),
                ),
                Obx(
                  () => controller.cartList.isEmpty
                      ? SizedBox()
                      : _checkoutButton(),
                ),
                SizedBox(
                  height: height_30,
                )
              ],
            ),
          );
        }),
      ),
    );
  }

  /// ---------------- CART ITEM CARD ----------------
  Widget _cartItem(CartList item, int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.grey.shade200)),
      child: Row(
        children: [
          NetworkImageWidget(
            imageurl: item.productDetails?.productImg?[0].url ?? "",
            imageHeight: 70,
            imageWidth: 70,
            imageFitType: BoxFit.cover,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.productDetails?.productName ?? "",
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                const SizedBox(height: 3),
                Text(item.size ?? "", style: TextStyle(color: Colors.black54)),
                const SizedBox(height: 6),
                Text("\$${item.price ?? '0'}",
                    style: TextStyle(
                        fontSize: 16,
                        color: Colors.blue,
                        fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              /// delete icon
              InkWell(
                onTap: () {
                  controller.callDeleteCartItemApi(id: item.sId);
                },
                child: Icon(Icons.delete_outline, color: Colors.red),
              ),
              SizedBox(
                height: height_8,
              ),

              /// Quantity buttons
              Row(
                children: [
                  _qtyButton(
                    icon: Icons.remove,
                    onTap: () {
                      controller.callDecreaseQuantityApi(
                        id: item.sId,
                        quantity: 1,
                      );
                    },
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: Text(
                      '${item.quantity}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  _qtyButton(
                    icon: Icons.add,
                    onTap: () {
                      controller.callIncreaseQuantityApi(
                        id: item?.sId,
                        quantity: 1,
                      );
                    },
                  ),
                ],
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _qtyButton({required IconData icon, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: 32,
        width: 32,
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, size: 18),
      ),
    );
  }

  /// ---------------- PRICE SUMMARY ----------------
  Widget _priceSummary() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      child: Column(
        children: [
          _priceRow("Subtotal",
              '${controller.cartListResponseModel.data?.subTotal ?? ""}'),
          _priceRow("Taxes",
              '${controller.cartListResponseModel.data?.orderTotal ?? "0"}'),
          _priceRow("Delivery Fee",
              '${controller.cartListResponseModel.data?.orderTotal ?? "0"}'),
          Divider(),
          _priceRow(
              "Total", '${controller.cartListResponseModel.data?.total ?? "0"}',
              highlight: true),
        ],
      ),
    );
  }

  Widget _priceRow(String title, amount, {bool highlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title,
              style: TextStyle(
                  fontSize: 15,
                  color: highlight ? Colors.black : Colors.grey.shade600)),
          Text(
            "\$${amount}",
            style: TextStyle(
              fontSize: highlight ? 18 : 15,
              fontWeight: highlight ? FontWeight.bold : FontWeight.normal,
              color: highlight ? Colors.blue : Colors.black87,
            ),
          )
        ],
      ),
    );
  }

  /// ---------------- CHECKOUT BUTTON ----------------
  Widget _checkoutButton() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () {
          Get.toNamed(AppRoutes.checkoutScreen);
        },
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          backgroundColor: colorAppColor,
        ),
        child: const Text(
          "Proceed to Checkout",
          style: TextStyle(fontSize: 16, color: Colors.white),
        ),
      ),
    );
  }
}
