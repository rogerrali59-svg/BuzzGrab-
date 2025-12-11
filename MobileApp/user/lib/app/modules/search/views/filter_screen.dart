
import 'package:buzzgrab/export.dart';
import '../../../core/widgets/product_card_widget.dart';
import '../../home/model/category_list_response_model.dart';
import '../controller/filter_controller.dart';
import '../model/brand_list_response_model.dart';

class FilterScreen extends StatelessWidget {
  final controller = Get.put(FilterController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        appBarTitleText: "Filter",
      ),
      body: Obx(() => controller.isFilterApplied.value
          ? _buildAppliedUI()
          : _buildFilterForm()),
    );
  }

  // --------------------- FILTER UI ---------------------
  Widget _buildFilterForm() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        _sectionTitle("Category"),
        SizedBox(height: 10),
        Obx(() => Wrap(
          spacing: 10,
          children: controller.categoryList.map((c) {
            return _chip(
              label: c.title ?? "",
              selected: controller.selectedCategoryId.value == c.sId,
              onTap: () => controller.selectedCategoryId.value = c.sId,
            );
          }).toList(),
        )),

        SizedBox(height: 20),
        _sectionTitle("Brand"),
        SizedBox(height: 10),
        Obx(() => Wrap(
          spacing: 10,
          children: controller.brandList.map((b) {
            return _chip(
              label: b.title ?? "",
              selected: controller.selectedBrandIds.contains(b.sId),
              onTap: () {
                if (controller.selectedBrandIds.contains(b.sId)) {
                  controller.selectedBrandIds.remove(b.sId);
                } else {
                  controller.selectedBrandIds.add(b.sId);
                }
              },
            );
          }).toList(),
        )),

        SizedBox(height: 20),
        _sectionTitle("Location"),
        _locationField(),
        SizedBox(height: 20),
        _sectionTitle("Popularity"),
        popularityRangeSlider(),
        SizedBox(height: 20),
        _sectionTitle("Pricing"),
        _pricingSlider(),
        SizedBox(height: 20),
        _sectionTitle("Stock"),
        SizedBox(height: 10),
        Row(
          children: controller.stockOptions
              .map((s) => _chip(
                    label: s,
                    selected: controller.selectedStock.value == s,
                    onTap: () => controller.selectedStock.value = s,
                  ))
              .toList(),
        ),
        SizedBox(height: 30),
        _primaryButton("Apply Filter", () => controller.callProductListApi())
      ]),
    );
  }

  // --------------------- FILTER APPLIED UI ---------------------
  Widget _buildAppliedUI() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(20),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        _sectionTitle("Search Results"),
SizedBox(height: height_10,),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            /// Category name
            if (controller.selectedCategoryId.value.isNotEmpty &&
                controller.selectedCategoryName.isNotEmpty)
              _tag(controller.selectedCategoryName,(){
                controller.selectedCategoryId.value = ""; // Remove
                controller.callProductListApi();             // Call your
              }),

            /// Brand names
            ...controller.selectedBrandNames.map(
                  (name) => _tag(
                name,
                 () {
                  final matchedBrand = controller.brandList.firstWhere(
                        (b) => b.title == name,
                    orElse: () => BrandDataModel(),
                  );

                  controller.selectedBrandIds.remove(matchedBrand.sId);

                  controller.callProductListApi(); // Call API again
                },
              ),
            ),


            /// Price range
            _tag("\₹${controller.priceRange.value.start.toStringAsFixed(0)}",(){
              controller.priceRange.value = RangeValues(20, 700); // Reset price
              controller.callProductListApi();
            }),

            /// Stock status
            if (controller.selectedStock.isNotEmpty)
              _tag(controller.selectedStock.value,(){
                controller.selectedStock.value='';
                controller.callProductListApi();
              }),
          ],
        ),
/*      Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            if (controller.selectedCategoryId.value != "12")
              _tag(controller.selectedCategoryId.value),
            ...controller.selectedBrandIds.map(_tag),
            _tag("\$${controller.priceRange.value.start.toStringAsFixed(0)}"),
            _tag("\$${controller.popularityRange.value.start.toStringAsFixed(0)}"),
            if (controller.selectedStock.isNotEmpty)
              _tag(controller.selectedStock.value)
          ],
        ),*/
        SizedBox(height: 20),
        Obx(() => ListView.builder(
          shrinkWrap: true,
          physics: NeverScrollableScrollPhysics(),

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
        )),
        SizedBox(height: 20),
        _primaryButton("Clear Filter", () => controller.clearFilter(),
            color: Colors.redAccent)
      ]),
    );
  }





  // ------------------------------------------------------------
  // ----------------------- REUSABLE WIDGETS -------------------
  // ------------------------------------------------------------

  Widget _sectionTitle(String text) =>
      Text(text, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold));

  Widget _chip(
          {required String label,
          required bool selected,
          required Function() onTap}) =>
      GestureDetector(
        onTap: onTap,
        child: Container(
          margin: EdgeInsets.only(right: 10, bottom: 10),
          padding: EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            color: selected ? colorAppColor : Colors.grey.shade200,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(label,
              style: TextStyle(
                  color: selected ? Colors.white : Colors.black87,
                  fontSize: 14)),
        ),
      );

  Widget _locationField() => TextFieldWidget(
    isHeading: false,
        topMargin: margin_5,
        textController: controller.locationController,
        hint: "Search for a locality, area or city",
      );

  Widget popularityRangeSlider() {
    return Obx(() => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(Icons.star_border, color: Colors.grey, size: 20),
                SizedBox(width: 4),
                Text(
                  controller.popularityRange.value.start.toStringAsFixed(1),
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold,color: colorAppColor),
                ),
              ],
            ),
            Row(
              children: [
                Text(
                  controller.popularityRange.value.end.toStringAsFixed(1),
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold,color: colorAppColor),
                ),
                SizedBox(width: 4),
                Icon(Icons.star, color: colorAppColor, size: 20),
              ],
            ),
          ],
        ),

        // Slider
        RangeSlider(

          values: controller.popularityRange.value,
          min: 0,
          max: 5,
          divisions: 5,
          labels: RangeLabels(
            controller.popularityRange.value.start.toStringAsFixed(1),
            controller.popularityRange.value.end.toStringAsFixed(1),
          ),
          onChanged: (RangeValues newValue) {
            controller.popularityRange.value = newValue;
          },
        ),
      ],
    ));
  }


  Widget _pricingSlider() {
    return   Obx(() => Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [

                Text(
                  '& ${controller.priceRange.value.start.toStringAsFixed(1)}',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold,color: colorAppColor),
                ),
              ],
            ),
            Row(
              children: [
                Text(
                  '\$ ${controller.priceRange.value.end.toStringAsFixed(1)}',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold,color: colorAppColor),
                ),

              ],
            ),
          ],
        ),

        // Slider
        RangeSlider(

          values: controller.priceRange.value,
          min: 20,
          max: 700,
          divisions: 400,
          labels: RangeLabels(
            controller.priceRange.value.start.toStringAsFixed(1),
            controller.priceRange.value.end.toStringAsFixed(1),
          ),
          onChanged: (RangeValues newValue) {
            controller.priceRange.value = newValue;
          },
        ),
      ],
    ));
  }

  Widget _primaryButton(String text, VoidCallback onTap,
          {Color color = Colors.blue}) =>
      Container(
        width: double.infinity,
        child: MaterialButtonWidget(
          onPressed: onTap,

          buttonText: text,
        ),
      );

  Widget _tag(String text,onTap) => Container(
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(10)),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(text),
            SizedBox(width: 5),
            InkWell(
                onTap: onTap??(){},
                child: Icon(Icons.close, size: 16))
          ],
        ),
      );

  Widget _productCard(dynamic product) {
    return Container(
      margin: EdgeInsets.only(bottom: 15),
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.grey.shade200)),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(product["img"],
                height: 80, width: 80, fit: BoxFit.cover),
          ),
          SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(product["name"],
                    style:
                        TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                Row(
                  children: [
                    Icon(Icons.star, color: Colors.amber, size: 18),
                    Text(product["rating"]),
                  ],
                ),
                Text(product["price"],
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue))
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
                color: Colors.green, borderRadius: BorderRadius.circular(20)),
            child:
                Text(product["stock"], style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }
}
