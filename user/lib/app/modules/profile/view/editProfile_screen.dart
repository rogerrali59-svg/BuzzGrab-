// import 'package:buzzgrab/export.dart';
// import 'package:device_info_plus/device_info_plus.dart';
// import 'package:permission_handler/permission_handler.dart' as show;
//
// import '../../../core/translations/local_keys.dart';
// import '../../../core/utils/image_picker_and_cropper.dart';
// import '../../../core/widgets/image_picker_dialog.dart';
// import '../../authentication/controllers/edit_profile_controller.dart';
// import '../controller/editProfile_controller.dart';
//
// class EditProfileScreen extends GetView<EditProfileController> {
//   final controller = Get.find<EditProfileController>();
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       body: _bodyWidget(),
//     );
//   }
//
//   _bodyWidget() {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         SizedBox(
//           height: height_40,
//         ),
//         GestureDetector(
//           onTap: () {
//             Get.back();
//           },
//           child: AssetImageWidget(
//             imageUrl: 'assets/icons/icon_back.png',
//             imageHeight: height_38,
//             imageWidth: width_40,
//             imageFitType: BoxFit.fill,
//           ),
//         ),
//         SizedBox(
//           height: height_20,
//         ),
//         Text(
//           "Edit Profile",
//           style: TextStyle(
//             color: Colors.black,
//             fontFamily: FontFamily.inter,
//             fontWeight: FontWeight.w600,
//             fontSize: font_20,
//           ),
//         ),
//         SizedBox(
//           height: height_10,
//         ),
//         Text(
//           "Edit Profile",
//           style: TextStyle(
//             color: Colors.black.withOpacity(0.5),
//             fontFamily: FontFamily.inter,
//             fontWeight: FontWeight.w300,
//             fontSize: font_15,
//           ),
//         ),
//         SizedBox(height: height_25),
//         Align(
//           alignment: Alignment.center,
//           child: _profileWidget(),
//         ),
//         SizedBox(height: height_25),
//         TextFieldWidget(
//           tvHeading: "First Name",
//           color: const Color(0xFFF8F8F8),
//           maxLength: 50,
//           textController: controller.firstNameController,
//           inputAction: TextInputAction.next,
//           labelText: 'Enter first name',
//           inputType: TextInputType.name,
//           focusNode: controller.firstNameFocusNode,
//         ),
//         TextFieldWidget(
//           tvHeading: 'Last Name',
//           color: const Color(0xFFF8F8F8),
//           maxLength: 50,
//           textController: controller.lastNameController,
//           inputAction: TextInputAction.next,
//           labelText: 'Enter last name',
//           inputType: TextInputType.name,
//           focusNode: controller.lastNameFocusNode,
//         ),
//         SizedBox(
//           height: height_25,
//         ),
//         ElevatedButton(
//           onPressed: () {},
//           style: ElevatedButton.styleFrom(
//             backgroundColor: Color(0xFF4EB711),
//             minimumSize: const Size(double.infinity, 50),
//             shape: RoundedRectangleBorder(
//               borderRadius: BorderRadius.circular(50),
//             ),
//           ),
//           child: Text(
//             "Save",
//             style: TextStyle(
//               color: Colors.white,
//               fontFamily: FontFamily.inter,
//               fontWeight: FontWeight.w600,
//             ),
//           ),
//         ),
//         const SizedBox(height: 25),
//       ],
//     ).marginSymmetric(horizontal: margin_15);
//   }
//
//   Widget _buildLabel(String text) => Text(
//         text,
//         style: TextStyle(
//           color: Colors.black,
//           fontFamily: FontFamily.inter,
//           fontWeight: FontWeight.w600,
//           fontSize: font_16,
//         ),
//       );
//
//   _profileWidget() => InkWell(
//         splashColor: Colors.transparent,
//         onTap: () {
//           Get.bottomSheet(ImagePickerDialog(
//             galleryFunction: () async {
//               Get.close(1);
//               if (Platform.isIOS) {
//                 controller
//                     .updateImageFile(permissionPicker(show.Permission.storage));
//               } else {
//                 final androidInfo = await DeviceInfoPlugin().androidInfo;
//                 androidInfo.version.sdkInt < 33
//                     ? controller.updateImageFile(
//                         permissionPicker(show.Permission.storage))
//                     : controller.updateImageFile(
//                         permissionPicker(show.Permission.photos));
//               }
//             },
//             cameraFunction: () async {
//               Get.close(1);
//               controller.updateImageFile(imageFromCamera());
//             },
//             title: 'Profile',
//           ));
//         },
//         child: Container(
//           height: height_95,
//           width: height_95,
//           child: Stack(
//             alignment: Alignment.bottomRight,
//             children: [
//               Align(
//                 alignment: Alignment.center,
//                 child: Container(
//                   height: height_95,
//                   width: height_95,
//                   padding: EdgeInsets.all(margin_2),
//                   decoration: BoxDecoration(
//                     color: Colors.white,
//                     shape: BoxShape.circle,
//                   ),
//                   alignment: Alignment.center,
//                   child: Obx(() => controller.profileImage.isNotEmpty
//                       ? _selectedImage()
//                       : InkWell(
//                           splashColor: Colors.transparent,
//                           onTap: () {
//                             Get.bottomSheet(ImagePickerDialog(
//                               galleryFunction: () async {
//                                 Get.close(1);
//                                 if (Platform.isIOS) {
//                                   controller.updateImageFile(permissionPicker(
//                                       show.Permission.storage));
//                                 } else {
//                                   final androidInfo =
//                                       await DeviceInfoPlugin().androidInfo;
//                                   androidInfo.version.sdkInt < 33
//                                       ? controller.updateImageFile(
//                                           permissionPicker(
//                                               show.Permission.storage))
//                                       : controller.updateImageFile(
//                                           permissionPicker(
//                                               show.Permission.photos));
//                                 }
//                               },
//                               cameraFunction: () async {
//                                 Get.close(1);
//                                 controller.updateImageFile(imageFromCamera());
//                               },
//                               title: 'Profile',
//                             ));
//                           },
//                           child: AssetImageWidget(
//                             imageHeight: height_100,
//                             imageWidth: height_100,
//                             radiusAll: radius_100,
//                             imageUrl: 'assets/icons/user.png',
//                             imageFitType: BoxFit.cover,
//                           ),
//                         )),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       );
//
//   _selectedImage() => Container(
//         decoration: const BoxDecoration(shape: BoxShape.circle),
//         child: CircleAvatar(
//           backgroundColor: Colors.transparent,
//           radius: radius_60,
//           child: ClipRRect(
//             borderRadius: BorderRadius.circular(radius_100),
//             child: Image.file(
//               fit: BoxFit.cover,
//               File(controller.profileImage.value),
//             ),
//           ),
//         ),
//       );
// }
