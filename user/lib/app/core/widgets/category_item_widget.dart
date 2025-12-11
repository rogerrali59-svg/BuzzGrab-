import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:buzzgrab/app/modules/network-image/network_image.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../routes/app_routes.dart';

class CategoryItem extends StatelessWidget {
  final String icon;
  final String title;
  final  onTap;

  const CategoryItem({required this.icon, required this.title,this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      splashColor: Colors.transparent,
      onTap: onTap?? (){
        Get.toNamed(AppRoutes.productListScreen);
      },
      child: Column(
        children: [
          Container(
            height: 70,
            width: 70,
            // padding: EdgeInsets.all(15),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(15),
            ),
            child: NetworkImageWidget(imageurl: icon,imageWidth: width_60,imageHeight: height_60,
            radiusAll: radius_10,imageFitType: BoxFit.cover,),
          ),
          SizedBox(height: 8),
          Text(title,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
        ],
      ).marginOnly(right: margin_10),
    );
  }
}
