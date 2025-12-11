import 'package:buzzgrab/export.dart';
import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';


/// Edit profile Screen Shimmer View
class EditProfileShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 16),

          /// Profile Picture Shimmer
          Center(
            child: Shimmer.fromColors(
              baseColor: Colors.grey.shade300,
              highlightColor: Colors.grey.shade100,
              child: Container(
                height: 100,
                width: 100,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
              ),
            ),
          ),

          SizedBox(height: 20),

          /// Full Name Label
          shimmerLine(width: 120, height: 14),
          SizedBox(height: 10),

          /// Full Name Field
          shimmerBox(height: 55),

          SizedBox(height: 15),

          /// DOB Label
          shimmerLine(width: 140, height: 14),
          SizedBox(height: 10),

          /// DOB Field
          shimmerBox(height: 55),

          SizedBox(height: 15),

          /// Gender Label
          shimmerLine(width: 100, height: 14),
          SizedBox(height: 10),

          /// Gender Selector (3 Boxes)
          Row(
            children: [
              Expanded(child: shimmerBox(height: 50)),
              SizedBox(width: 10),
              Expanded(child: shimmerBox(height: 50)),
              SizedBox(width: 10),
              Expanded(child: shimmerBox(height: 50)),
            ],
          ),

          SizedBox(height: 20),

          /// Email Label
          shimmerLine(width: 100, height: 14),
          SizedBox(height: 10),

          /// Email Field
          shimmerBox(height: 55),

          SizedBox(height: 20),

          /// Phone Label
          shimmerLine(width: 120, height: 14),
          SizedBox(height: 10),

          /// Phone Field
          shimmerBox(height: 55),

          SizedBox(height: 30),

          /// Save Button
          shimmerBox(height: 55, radius: 12),
        ],
      ),
    );
  }

  /// ▼ Helper Widgets ▼

  Widget shimmerLine({double width = double.infinity, double height = 16}) {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(6),
        ),
      ),
    );
  }

  Widget shimmerBox({double height = 50, double radius = 10}) {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        height: height,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}


/// Static page UI Shimmer View

class StaticPageShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 15),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          // Title shimmer
          Shimmer.fromColors(
            baseColor: Colors.grey.shade300,
            highlightColor: Colors.grey.shade100,
            child: Container(
              height: 20,
              width: 200,
              margin: const EdgeInsets.only(top: 20, bottom: 15),
              color: Colors.white,
            ),
          ),

          // Multiple lines of content shimmer
          ...List.generate(
            10,
                (index) => Shimmer.fromColors(
              baseColor: Colors.grey.shade300,
              highlightColor: Colors.grey.shade100,
              child: Container(
                height: 14,
                width: index % 2 == 0 ? double.infinity : 250,
                margin: const EdgeInsets.only(bottom: 10),
                color: Colors.white,
              ),
            ),
          )
        ],
      ),
    );
  }
}


/// Address list Shimmer View

class AddressShimmer extends StatelessWidget {
  const AddressShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: 5,
      separatorBuilder: (_, __) => Divider(color: Colors.grey.shade300),
      itemBuilder: (context, index) {
        return Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            // Radio circle shimmer
            Shimmer.fromColors(
              baseColor: Colors.grey.shade300,
              highlightColor: Colors.grey.shade100,
              child: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                ),
              ),
            ),

            SizedBox(width: 12),

            // Details shimmer
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  shimmerLine(width: 120, height: 16),
                  SizedBox(height: 6),
                  shimmerLine(width: double.infinity, height: 14),
                  SizedBox(height: 6),
                  shimmerLine(width: 100, height: 14),
                ],
              ),
            ),

            SizedBox(width: 12),

            // Edit button shimmer
            Shimmer.fromColors(
              baseColor: Colors.grey.shade300,
              highlightColor: Colors.grey.shade100,
              child: Container(
                width: 50,
                height: 22,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(6),
                  color: Colors.white,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget shimmerLine({double width = double.infinity, double height = 14}) {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: Colors.white,
        ),
      ),
    );
  }
}


/// Product Detail Shimmer View



class ProductDetailShimmer extends StatelessWidget {
  const ProductDetailShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      bottomNavigationBar: _bottomShimmer(),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              // Top Carousel Shimmer
              Padding(
                padding: const EdgeInsets.all(16),
                child: ShimmerBox(
                  height: 200,
                  width: double.infinity,
                  radius: 20,
                ),
              ),

              // Product Title Box
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      color: Colors.white,
                      border: Border.all(color: Colors.grey.shade200)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title + Price
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ShimmerBox(height: 18, width: 150),
                          ShimmerBox(height: 20, width: 60),
                        ],
                      ),
                      const SizedBox(height: 10),

                      ShimmerBox(height: 14, width: 100),
                      const SizedBox(height: 15),

                      Row(
                        children: [
                          ShimmerBox(height: 24, width: 70, radius: 30),
                          const SizedBox(width: 10),
                          ShimmerBox(height: 18, width: 100),
                        ],
                      ),

                      const SizedBox(height: 20),

                      // Quantity row
                      Row(
                        children: [
                          ShimmerBox(height: 18, width: 100),
                          const Spacer(),
                          ShimmerBox(height: 40, width: 40, radius: 50),
                          const SizedBox(width: 12),
                          ShimmerBox(height: 18, width: 30),
                          const SizedBox(width: 12),
                          ShimmerBox(height: 40, width: 40, radius: 50),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Description Box
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ShimmerBox(height: 16, width: 120),
                      const SizedBox(height: 10),
                      ShimmerBox(height: 14, width: double.infinity),
                      const SizedBox(height: 10),
                      ShimmerBox(height: 14, width: double.infinity),
                      const SizedBox(height: 10),
                      ShimmerBox(height: 14, width: 200),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Related Products
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: ShimmerBox(height: 18, width: 120),
              ),

              const SizedBox(height: 16),

              _buildRelatedGridShimmer(),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  // Related Product Grid Shimmer
  Widget _buildRelatedGridShimmer() {
    return SizedBox(
      height: 220,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemBuilder: (_, __) => _relatedCardShimmer(),
        separatorBuilder: (_, __) => const SizedBox(width: 12),
        itemCount: 4,
      ),
    );
  }

  Widget _relatedCardShimmer() {
    return Container(
      width: 160,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.shade200,
            blurRadius: 8,
            spreadRadius: 2,
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image Shimmer
          ShimmerBox(
            height: 110,
            width: double.infinity,
            radius: 18,
          ),

          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                ShimmerBox(height: 14, width: 100),
                SizedBox(height: 6),
                ShimmerBox(height: 14, width: 60),
                SizedBox(height: 6),
                ShimmerBox(height: 14, width: 40),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Bottom Button Shimmer
  Widget _bottomShimmer() {
    return Container(
      padding: const EdgeInsets.all(16),
      height: 80,
      child: const ShimmerBox(
        height: 50,
        width: double.infinity,
        radius: 14,
      ),
    );
  }
}
/// Shimmer Box Widget

class ShimmerBox extends StatelessWidget {
  final double height;
  final double width;
  final double radius;

  const ShimmerBox({
    super.key,
    required this.height,
    required this.width,
    this.radius = 12,
  });

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade300,
      highlightColor: Colors.grey.shade100,
      child: Container(
        height: height,
        width: width,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(radius),
        ),
      ),
    );
  }
}



/// Home Screemn Shimmer view

class HomeScreenShimmer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(height: 15),

            // HEADER
            Row(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    shimmerContainer(height: 18, width: 120),
                    SizedBox(height: 6),
                    shimmerContainer(height: 14, width: 100),
                  ],
                ).paddingOnly(left: 15),

                Spacer(),

                shimmerContainer(height: 30, width: 30, radius: 30)
                    .paddingOnly(right: 15),
              ],
            ),

            SizedBox(height: 20),

            Container(
              padding: EdgeInsets.symmetric(horizontal: 15),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(30),
                    topRight: Radius.circular(30)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 20),

                  // SEARCH
                  shimmerContainer(height: 50, width: double.infinity, radius: 15),

                  SizedBox(height: 25),

                  shimmerContainer(height: 20, width: 120),
                  SizedBox(height: 20),

                  // CATEGORIES
                  Row(
                    children: List.generate(
                      4,
                          (index) => shimmerContainer(
                        height: 70,
                        width: 70,
                        radius: 15,
                      ).marginOnly(right: 10),
                    ),
                  ),

                  SizedBox(height: 30),

                  // BANNER
                  shimmerContainer(height: 180, width: double.infinity, radius: 20),

                  SizedBox(height: 30),

                  // POPULAR TITLE
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      shimmerContainer(height: 20, width: 150),
                      shimmerContainer(height: 18, width: 60),
                    ],
                  ),

                  SizedBox(height: 20),

                  // PRODUCT LIST
                  Column(
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
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                shimmerContainer(height: 18, width: 140),
                                SizedBox(height: 10),
                                shimmerContainer(height: 16, width: 80),
                                SizedBox(height: 10),
                                shimmerContainer(height: 18, width: 100),
                              ],
                            ),
                          ),
                          shimmerContainer(height: 30, width: 60, radius: 20),
                        ],
                      ).paddingOnly(bottom: 20),
                    ),
                  ),

                  SizedBox(height: 20),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}



Widget shimmerContainer({
  double height = 20,
  double width = double.infinity,
  double radius = 10,
}) {
  return Shimmer.fromColors(
    baseColor: Colors.grey.shade300,
    highlightColor: Colors.grey.shade100,
    child: Container(
      height: height,
      width: width,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(radius),
      ),
    ),
  );
}


/// Gridview Product view shimmer view
Widget shimmerGrid() {
  return GridView.builder(
    padding: EdgeInsets.all(16),
    physics: NeverScrollableScrollPhysics(),
    shrinkWrap: true,
    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
      crossAxisCount: 2,
      childAspectRatio: 0.68,
      crossAxisSpacing: 14,
      mainAxisSpacing: 14,
    ),
    itemCount: 6,
    itemBuilder: (context, index) {
      return Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// IMAGE BOX
            Padding(
              padding: const EdgeInsets.all(0),
              child: shimmerContainer(height: 140, width: double.infinity, radius: 14),
            ),

            SizedBox(height: 10),

            /// PRODUCT NAME
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: shimmerContainer(height: 14, width: 120),
            ),

            SizedBox(height: 8),

            /// SIZE
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: shimmerContainer(height: 12, width: 80),
            ),

            SizedBox(height: 12),

            /// PRICE
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: shimmerContainer(height: 16, width: 60),
            ),
          ],
        ),
      );
    },
  );
}




