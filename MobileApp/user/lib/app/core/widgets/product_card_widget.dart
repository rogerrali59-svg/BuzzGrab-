import 'package:buzzgrab/app/modules/product/view/product_list_screen.dart';
import 'package:buzzgrab/export.dart';
import 'package:flutter/material.dart';
import 'package:get/get_core/src/get_main.dart';

class ProductCard extends StatelessWidget {
  final String image, title, tag;
  final dynamic rating, price,quantity;
  final onTap;

  const ProductCard({
    required this.image,
    required this.title,
    required this.rating,
    required this.price,
    required this.tag,
    required this.quantity,
     this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap?? (){
        Get.to(ProductListScreen());
      },
      child: Container(
        margin: EdgeInsets.only(bottom: 20),
        padding: EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.grey.shade200)
          // boxShadow: [
          //   BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 2)),
          // ],
        ),
        child: Row(
          children: [
            NetworkImageWidget(imageurl: image,imageWidth: width_90,imageHeight: height_80,imageFitType: BoxFit.cover,
            radiusAll: 12,),

            SizedBox(width: 15),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style:
                      TextStyle(fontSize: font_15, fontWeight: FontWeight.w600,overflow: TextOverflow.ellipsis),maxLines: 1,),
                  Row(
                    children: [
                      Icon(Icons.star, color: Colors.amber, size: font_14),
                      Text(rating.toString(),
                          style: TextStyle(fontSize: font_14)),
                    ],
                  ),
                  Text("\$${price}",
                      style: TextStyle(
                          fontSize: font_16,
                          color: Colors.blue,
                          fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 15, vertical: 6),
              decoration: BoxDecoration(
                  color: quantity>=1 ? Colors.green : Colors.blue,
                  borderRadius: BorderRadius.circular(20)),
              child: Text(tag,
                  style: TextStyle(color: Colors.white, fontSize: font_12)),
            )
          ],
        ),
      ),
    );
  }
}
