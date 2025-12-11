import 'package:buzzgrab/app/core/values/dimens.dart';
import 'package:buzzgrab/app/core/widgets/custom_textfield.dart';
import 'package:buzzgrab/app/core/widgets/validator.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

import '../controller/add_address_controller.dart';

class AddAddressScreen extends StatelessWidget {
  final controller = Get.put(AddAddressController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: GestureDetector(
          onTap: () => Get.back(),
          child: Icon(Icons.arrow_back_ios, color: Colors.black),
        ),
        title: Text(
          "Add Delivery Address",
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.black,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// MAP IMAGE (placeholder)
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(12),
                image: DecorationImage(
                  image: AssetImage("assets/map_placeholder.png"), // replace
                  fit: BoxFit.cover,
                ),
              ),
            ),

            SizedBox(height: 16),

            /// Selected Location Row
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Selected Location",
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w600),
                        ),
                        SizedBox(height: 6),
                      Text(
                          '${controller.houseNoController.text ?? ""} ${controller.blockController.text} '
                              '${controller.landmarkController.text}',
                          style: TextStyle(
                              fontSize: 14, color: Colors.grey.shade600),
                        )
                      ],
                    ),

                ),
                GestureDetector(
                  onTap: controller.changeLocation,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      "Change",
                      style: TextStyle(
                          fontSize: 14,
                          color: Colors.blue,
                          fontWeight: FontWeight.w500),
                    ),
                  ),
                )
              ],
            ),

            SizedBox(height: 20),
            Divider(),
            SizedBox(height: 10),

            /// --- Add Address Section ---
            Text(
              "Add Address",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
            ),

            SizedBox(height: 16),
            buildField("House no. & Floor", controller.houseNoController),
            buildField("Building or Block", controller.blockController),
            buildField("Landmark or Area Name", controller.landmarkController),

            SizedBox(height: 24),

            /// --- Receiver Details ---
            Text(
              "Receiver Details",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
            ),

            SizedBox(height: 16),
            buildField("Name", controller.receiverNameController),
            buildField("Phone No.", controller.phoneController),

            SizedBox(height: 30),

            /// Confirm Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  if(controller.isEdit.value==true){
                    controller.callEditAddressApi();
                  }else{
                    controller.callAddAddressApi();
                  }

                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: Text(
                  "Confirm Location",
                  style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                      fontWeight: FontWeight.w600),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// -------------------------
  /// CUSTOM TEXT FIELD WIDGET
  /// -------------------------
  Widget buildField(String title, TextEditingController controller) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
        SizedBox(height: 8),
        TextFieldWidget(
          borderColor: Colors.transparent,
          isHeading: false,
          topMargin: margin_0,
          textController: controller,
          hint: title,
          validate:(value)=>Validator.fieldChecker(value: value, message:title),
        ),
        SizedBox(height: 16),
      ],
    );
  }
}
