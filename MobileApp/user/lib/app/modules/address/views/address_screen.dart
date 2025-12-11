import 'package:buzzgrab/app/core/values/app_colors.dart';
import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../../../core/widgets/shimmer_view_widget.dart';
import '../controller/address_controller.dart';

class AddressScreen extends StatelessWidget {
  final  controller = Get.put(AddressController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: GestureDetector(
          onTap: () => Get.back(),
          child: Icon(Icons.arrow_back_ios, color: Colors.black),
        ),
        title: Text(
          "Manage Address",
          style: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),

      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [

            // Add New Address
            GestureDetector(
              onTap: controller.addNewAddress,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      color: colorAppColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: EdgeInsets.all(6),
                    child: Icon(Icons.add, color: Colors.white, size: 20),
                  ),
                  SizedBox(width: 12),
                  Text(
                    "Add New Address",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.black,
                    ),
                  )
                ],
              ),
            ),

            SizedBox(height: 20),
            Divider(color: Colors.grey.shade300,).marginSymmetric(vertical: margin_8),

            Expanded(
              child: Obx(
                    () => controller.isLoading.value==true?AddressShimmer(): ListView.separated(
                  itemCount: controller.addressList.length,
                  separatorBuilder: (context, index) => Divider(color: Colors.grey.shade300).marginSymmetric(vertical: margin_8),
                  itemBuilder: (context, index) {
                    final item = controller.addressList[index];
                    return Row(
                      // crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Radio Button
                        GestureDetector(
                          onTap: () => controller.selectAddress(index),
                          child: Obx(
                                () => Container(
                              width: 24,
                              height: 24,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: colorAppColor,
                                  width: 2,
                                ),
                              ),
                              child: controller.selectedIndex.value == index
                                  ? Center(
                                child: Container(
                                  width: 12,
                                  height: 12,
                                  decoration: BoxDecoration(
                                    color: Colors.blue,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              )
                                  : SizedBox(),
                            ),
                          ),
                        ),

                        SizedBox(width: 12),

                        // Address Details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.name,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                item.building,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                item.mobile,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Edit Button
                        GestureDetector(
                          onTap: () => controller.editAddress(index),
                          child: Container(
                            padding: EdgeInsets.symmetric(
                                horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              border:
                              Border.all(color: Colors.grey.shade300),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              "Edit",
                              style: TextStyle(
                                color:colorAppColor,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
