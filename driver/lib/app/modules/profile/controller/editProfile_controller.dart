// import 'package:get/get_state_manager/src/simple/get_controllers.dart';
// import 'package:image_picker/image_picker.dart';
//
// import '../../../../export.dart';
// import '../../../../main.dart';
// import '../../../core/values/route_arguments.dart';
// import '../../../data/remote_service/network/dio_client.dart';
// import '../../../data/remote_service/network/network_exceptions.dart';
// import '../../authentication/model/signup_response_model.dart';
//
// class EditProfileController extends GetxController {
//   TextEditingController firstNameTextEditingController =
//       TextEditingController();
//   TextEditingController lastNameTextEditingController = TextEditingController();
//
//   FocusNode firstNameFocusNode = FocusNode();
//   FocusNode lastNameFocusNode = FocusNode();
//
//   RxString profileImage = "".obs;
//
//   @override
//   onInit() {}
//
//   hitProfileSetUpApiCall() async {
//     customLoader.show(Get.overlayContext!);
//     double lat = double.tryParse(latitude.toString()) ?? 0.0;
//     double lon = double.tryParse(longitude.toString()) ?? 0.0;
//
//     String latStr = lat.toStringAsFixed(8);
//     String lonStr = lon.toStringAsFixed(8);
//     try {
//       MultipartFile? profileMultipartImage;
//       if (profileImage.value != "" && !profileImage.contains("http")) {
//         profileMultipartImage = await MultipartFile.fromFile(profileImage.value,
//             filename: profileImage.value);
//       }
//
//       Map<String, dynamic> requestModal = {
//         "User[full_name] ": lonStr,
//         "User[email]": latStr,
//       };
//
//       if (profileImage.isNotEmpty &&
//           !profileImage.contains("http") &&
//           profileMultipartImage != null) {
//         requestModal["User[profile_file]"] = profileMultipartImage;
//       }
//
//       final response = DioClient().post("/user/edit",
//           data: FormData.fromMap(requestModal), skipAuth: false);
//
//       final result = await response;
//
//       print("API Response: $result");
//
//       UserResponseModel userResponseModel = UserResponseModel.fromJson(result);
//       signUpData.value = userResponseModel.data ?? UserData();
//
//       await saveDataToLocalStorage(userResponseModel);
//
//       customLoader.hide();
//       Get.offAllNamed(AppRoutes.mainScreen, arguments: {'index': 4});
//
//       toast("${userResponseModel.message.toString()}");
//     } catch (e, st) {
//       print('Error---$e');
//       print('Error---$st');
//     }
//   }
//
//   updateImageFile(Future<PickedFile?> imagePath) async {
//     PickedFile? file = await imagePath;
//     if (file != null) {
//       profileImage.value = file.path;
//       update();
//     }
//   }
//
//   saveDataToLocalStorage(UserResponseModel value) async {
//     await PreferenceManger().saveRegisterData(value);
//     await PreferenceManger().saveAuthToken(value.data?.token ?? "");
//     signUpData.value = value.data!;
//   }
// }
