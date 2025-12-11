import 'package:buzzgrab/main.dart';
import 'package:carousel_slider/carousel_slider.dart';

import '../../../../../export.dart';
import '../../../core/widgets/banner_item_widget.dart';
import '../../../core/widgets/category_item_widget.dart';
import '../../../core/widgets/product_card_widget.dart';
import '../../../core/widgets/shimmer_view_widget.dart';
import '../../search/views/search_screen.dart';
import '../controller/home_controller.dart';

class HomeScreen extends StatelessWidget {
  final controller = Get.put(HomeController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: colorAppColor, // BLUE TOP
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 15),

              /// Header
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("${signUpData.value.fullName ?? ''}",
                          style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: Colors.white))
                          .marginSymmetric(horizontal: margin_10),
                      Row(
                        children: [
                          Icon(Icons.location_on_outlined,
                              size: 18, color: Colors.white),
                          Text("San Francisco, CA",
                              style:
                              TextStyle(fontSize: 13, color: Colors.white)),
                          Icon(Icons.keyboard_arrow_down, color: Colors.white),
                        ],
                      ).marginSymmetric(horizontal: margin_10),
                    ],
                  ),
                  SizedBox(height: height_20),
                  Spacer(),
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
                            child: Icon(
                              Icons.shopping_cart,
                              color: Colors.white,
                            ).marginOnly(top: margin_10)),
                        Positioned(
                            top: 0,
                            right: 0,
                            child: TextView(
                                text: '${controller.cartList.length}',
                                textStyle: textStyleBodyMedium().copyWith(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white)))
                      ],
                    ).marginOnly(right: margin_15),
                  )
                ],
              ),

              SizedBox(height: 10),

              /// WHITE SECTION STARTS — FIX APPLIED BELOW
              LayoutBuilder(
                builder: (context, constraints) {
                  return ConstrainedBox(
                    constraints: BoxConstraints(
                      minHeight: Get.height - 120,
                      // Adjust -120 based on header height
                    ),
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 15),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(radius_30),
                          topRight: Radius.circular(radius_30),
                        ),
                      ),

                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SizedBox(height: 20),

                          /// Search
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(15),
                            ),
                            child: TextFieldWidget(
                                onTap: () {
                                  Get.toNamed(AppRoutes.searchScreen);
                                },
                                prefixIcon:
                                Icon(Icons.search, color: Colors.grey),
                                topMargin: margin_0,
                                isHeading: false,
                                hint: 'Search here...',
                                suffixIcon: Icon(Icons.tune_rounded)),
                          ),

                          SizedBox(height: 25),

                          /// Categories Title
                          Obx(
                                () => controller.categoryList.isEmpty
                                ? SizedBox()
                                : Text("Categories",
                                style: TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.bold)),
                          ),
                          SizedBox(height: 20),

                          /// Categories Row
                          Obx(() {
                            return controller.isCategoryLoading.value == true
                                ? Row(
                              children: List.generate(
                                4,
                                    (index) => shimmerContainer(
                                  height: 70,
                                  width: 70,
                                  radius: 15,
                                ).marginOnly(right: 10),
                              ),
                            )
                                : Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: controller.categoryList
                                  .map((cat) => CategoryItem(
                                onTap: () {
                                  Get.toNamed(
                                      AppRoutes
                                          .productListScreen,
                                      arguments: {'id': cat.sId});
                                },
                                icon: cat.image ?? "",
                                title: cat.title ?? "",
                              ))
                                  .toList(),
                            );
                          }),

                          SizedBox(height: 25),

                          /// Banner
                          bannerCartWidget(),

                          SizedBox(height: 25),

                          /// Popular
                          Obx(
                                () => controller.productList.isEmpty
                                ? SizedBox()
                                : Row(
                              mainAxisAlignment:
                              MainAxisAlignment.spaceBetween,
                              children: [
                                Text("Popular Near You",
                                    style: TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold)),
                                Text("See All",
                                    style: TextStyle(
                                        fontSize: 16,
                                        color: Colors.blue)),
                              ],
                            ),
                          ),

                          SizedBox(height: 15),

                          /// Product List
                          Obx(() => controller.isProductLoading.value == true
                              ? Column(
                            children: List.generate(
                              4,
                                  (index) => Row(
                                children: [
                                  shimmerContainer(
                                    height: 90,
                                    width: 90,
                                    radius: 12,
                                  ),
                                  SizedBox(width: 15),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                      children: [
                                        shimmerContainer(
                                            height: 18, width: 140),
                                        SizedBox(height: 10),
                                        shimmerContainer(
                                            height: 16, width: 80),
                                        SizedBox(height: 10),
                                        shimmerContainer(
                                            height: 18, width: 100),
                                      ],
                                    ),
                                  ),
                                  shimmerContainer(
                                      height: 30,
                                      width: 60,
                                      radius: 20),
                                ],
                              ).paddingOnly(bottom: 20),
                            ),
                          )
                              : ListView.builder(
                            itemCount: controller.productList.length,
                            physics: NeverScrollableScrollPhysics(),
                            shrinkWrap: true,
                            itemBuilder: (context, index) {
                              final p = controller.productList[index];
                              return ProductCard(
                                quantity: p.quantity,
                                image: p.productImg?[0].url ?? "",
                                title: p.productName ?? "",
                                rating: p.averageRating ?? "",
                                price: p.price ?? "",
                                tag: p.quantity >= 1
                                    ? "In stock"
                                    : 'Out of Stock',
                                onTap: () {
                                  Get.toNamed(
                                    AppRoutes.productDetailScreen,
                                    arguments: {'id': p.sId},
                                  )?.then((value) {
                                    controller.callApi();
                                  });
                                },
                              );
                            },
                          )),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  bannerCartWidget() {
    return Obx(
          () => controller.isBannerLoading.value == true
          ? shimmerContainer(height: 180, width: Get.width)
          : controller.bannerList.isEmpty
          ? SizedBox()
          : CarouselSlider(
        options: CarouselOptions(
          height: 150,
          autoPlay: true,
          enlargeCenterPage: true,
          viewportFraction: 1.0,
          aspectRatio: 16 / 9,
          autoPlayInterval: Duration(seconds: 3),
          autoPlayAnimationDuration: Duration(milliseconds: 800),
        ),
        items: controller.bannerList.map((imagePath) {
          return Builder(
            builder: (BuildContext context) {
              return Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  image: DecorationImage(
                    image: NetworkImage(imagePath.bannerImg),
                    fit: BoxFit.cover,
                  ),
                ),
                padding: EdgeInsets.symmetric(horizontal: 20,vertical: margin_8),
                alignment: Alignment.centerLeft,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Get Special Discount\nUpto 45%",
                      style: TextStyle(
                        fontSize: font_18,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        shadows: [
                          Shadow(
                            blurRadius: 6,
                            color: Colors.black.withOpacity(0.5),
                            offset: Offset(2, 2),
                          )
                        ],
                      ),
                    ),
                    SizedBox(height: 10),
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: colorAppColor,
                        shape: StadiumBorder(),
                        padding: EdgeInsets.symmetric(
                          horizontal: 25,
                          vertical: 3,
                        ),
                      ),
                      child: Text(
                        "Claim Now",
                        style: textStyleBodyMedium()
                            .copyWith(color: Colors.white),
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        }).toList(),
      ),
    );
  }
}
