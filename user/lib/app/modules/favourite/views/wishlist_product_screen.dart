import 'package:buzzgrab/app/modules/favourite/controller/wishlist_product_list_controller.dart';

import '../../../../export.dart';

class WishlistProductScreen extends StatelessWidget {
final controller= Get.put(WishlistProductListController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        leadingWidth: width_0,
        isBackIcon: false,
        appBarTitleText: 'Favourite',
        centerTitle: false,
      ),
      body: Obx(() => controller.wishList.isEmpty?Center(child: noDataToShow(),): GridView.builder(
        padding: EdgeInsets.all(16),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.68,
          crossAxisSpacing: 14,
          mainAxisSpacing: 14,
        ),
        itemCount: controller.wishList.length,
        itemBuilder: (context, index) {
          final product = controller.wishList[index];

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
                    ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Image.network(
                        product.productDetails?.productImg?[0].url??'',
                        height: 140,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
                    ),

                    // STATUS BADGE
                    Positioned(
                      top: 10,
                      left: 10,
                      child: Container(
                        padding: EdgeInsets.symmetric(
                            horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          color:
                               Colors.green
                             ,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          "In stock" ,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),

                    // FAVORITE ICON
                    Positioned(
                      top: 10,
                      right: 10,
                      child: GestureDetector(
                        onTap: () => controller.toggleFav(index),
                        child: Icon(
                          product.isWishlist==true
                              ? Icons.favorite
                              : Icons.favorite_border,
                          color: product.isWishlist==true
                              ? Colors.red
                              : Colors.white,
                          size: 24,
                        ),
                      ),
                    ),
                  ],
                ),

                // PRODUCT NAME
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                    product.productDetails?.productName??"",
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
                    product.productDetails?.size??"",
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
                  child: Text(
                    "\$${product.productDetails?.price}",
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.blue,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      )),
    );
  }
}
