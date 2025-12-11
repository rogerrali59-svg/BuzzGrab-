import 'package:buzzgrab/app/core/values/app_colors.dart';
import 'package:buzzgrab/app/core/widgets/custom_appbar.dart';
import 'package:buzzgrab/app/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../../core/widgets/custom_flashbar.dart';
import '../controllers/location_picker_controller.dart';

class LocationPickerScreen extends StatelessWidget {
  LocationPickerScreen({super.key});

  final  controller = Get.put(LocationPickerController());

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () {
        if(controller.isAddAddress.value==true){
          Get.back();
        }else{
          Get.offAllNamed(AppRoutes.logIn);
        }

        return Future.value(true);
      },
      child: Scaffold(
appBar: CustomAppBar(
  onTap: (){
    if(controller.isAddAddress.value==true){
      Get.back();
    }else{
      Get.offAllNamed(AppRoutes.logIn);
    }
  },
),
        body: Stack(
          children: [
            /// MAP
            Obx(() => GoogleMap(
              initialCameraPosition: CameraPosition(
                target: controller.selectedLatLng.value,
                zoom: 15,
              ),
              onMapCreated: controller.onMapCreated,
              onCameraMove: controller.onCameraMove,
              onCameraIdle: controller.onCameraIdle,
              myLocationEnabled: true,
              myLocationButtonEnabled: false,
            )),

            /// 🎯 CENTER PIN
            Center(
              child: Padding(
                padding: const EdgeInsets.only(bottom: 35),
                child: Icon(
                  Icons.location_pin,
                  size: 60,
                  color: Colors.red,
                ),
              ),
            ),

            /// 🔍 SEARCH FIELD (Top)
            Positioned(
              top: 50,
              left: 20,
              right: 20,
              child: _searchBox(),
            ),

            /// ⬆ Bottom Container
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Obx(() => _bottomSheet(
                address: controller.selectedAddress.value,
                loading: controller.loadingAddress.value,
              )),
            )
          ],
        ),
      ),
    );
  }

  // Search bar UI only (no autocomplete logic yet)
  Widget _searchBox() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      height: 48,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            offset: Offset(0, 3),
            blurRadius: 8,
          )
        ],
      ),
      child: Row(
        children: const [
          Icon(Icons.search, color: Colors.black54),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              "Search...",
              style: TextStyle(color: Colors.black54, fontSize: 16),
            ),
          )
        ],
      ),
    );
  }

  Widget _bottomSheet({required String address, required bool loading}) {
    return   Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 22),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            offset: Offset(0, -4),
            blurRadius: 8,
          )
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Selected Location",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17),
          ),
          const SizedBox(height: 8),

          // address
          loading
              ? const Text("Fetching address...",
              style: TextStyle(color: Colors.black54))
              : Text(
            address,
            style: const TextStyle(fontSize: 15, color: Colors.black87),
          ),

          const SizedBox(height: 20),

          /// Set as delivery address button
           Obx(() => controller.isAddAddress.value==true?SizedBox(
             width: double.infinity,
             height: 50,
             child: ElevatedButton(
               onPressed: () {

                 Get.toNamed(AppRoutes.addAddressScreen,arguments: {'address':controller.locationResponseModel,
                 'latlng':controller.selectedLatLng.value});

               },
               style: ElevatedButton.styleFrom(
                 backgroundColor: colorAppColor,
                 shape: RoundedRectangleBorder(
                   borderRadius: BorderRadius.circular(10),
                 ),
               ),
               child: const Text(
                 "Confirm Address",
                 style: TextStyle(fontSize: 16, color: Colors.white),
               ),
             ),
           ): SizedBox(
             width: double.infinity,
             height: 50,
             child: ElevatedButton(
               onPressed: () {
                 // CALLBACK WITH SELECTED COORDS + ADDRESS
                 toast("Location set successfully");
                 controller.callSetAddressApi();

               },
               style: ElevatedButton.styleFrom(
                 backgroundColor: colorAppColor,
                 shape: RoundedRectangleBorder(
                   borderRadius: BorderRadius.circular(10),
                 ),
               ),
               child: const Text(
                 "Set as delivery address",
                 style: TextStyle(fontSize: 16, color: Colors.white),
               ),
             ),
           ),),

          const SizedBox(height: 10),

          /// Change location
         Obx(() => controller.isAddAddress.value==true?SizedBox(): SizedBox(
           width: double.infinity,
           height: 50,
           child: OutlinedButton(
             onPressed: () {
               // open a location search page
             },
             style: OutlinedButton.styleFrom(
               side:  BorderSide(
                 color: Colors.grey.shade300,   // outline color
                 width: 1.0,              // outline thickness
               ),
               shape: RoundedRectangleBorder(
                 borderRadius: BorderRadius.circular(10),

               ),
             ),
             child: const Text(
               "Change Location",
               style: TextStyle(fontSize: 15,color: Colors.black87),
             ),
           ),
         ),)

          // const SizedBox(height: 15),
        ],
      ),
    );
  }
}
