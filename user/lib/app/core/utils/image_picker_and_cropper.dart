import 'package:device_info_plus/device_info_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:buzzgrab/export.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';

import '../translations/local_keys.dart';
import '../values/app_global_values.dart';

Future<PickedFile?> imageFromCamera() async {
  var pickedFile = await ImagePicker()
      .pickImage(source: ImageSource.camera, imageQuality: 100);
  if (pickedFile == null) {
    showInSnackBar(message: keyNoImageSelected.tr);
  } else {
    return cropImage(pickedFile.path);
  }
  return null;
}

/*=================================================================== Image Pick Using Gallery ===================================================*/

Future<PickedFile?> imageFromGallery() async {
  // Check Android version
  if (Platform.isAndroid) {
    int sdkInt = (await DeviceInfoPlugin().androidInfo).version.sdkInt;

    if (sdkInt >= 34) {
      // Android 14 (API 34+) → Request storage permission
      if (!await Permission.photos.request().isGranted) {
        toast('Storage permission is required');
        return null;
      }
    } else {
      // Android < 34 → Request photos permission
      if (!await Permission.storage.request().isGranted) {
        print(
            'await Permission.storage=====${await Permission.storage.status}');
        toast('Gallery permission is required');
        if (await Permission.storage.status ==
            PermissionStatus.permanentlyDenied) {
          openAppSettings();
        }
        return null;
      }
    }
  }

  // Pick image
  final pickedFile = await ImagePicker().pickImage(
    source: ImageSource.gallery,
    imageQuality: 100,
  );

  if (pickedFile == null) {
    showInSnackBar(message: keyNoImageSelected.tr);
    return null;
  }

  return cropImage(pickedFile.path);
}

Future<PickedFile?> cropImage(filePath) async {
  final croppedImage = await ImageCropper().cropImage(
    sourcePath: filePath,
    aspectRatio: const CropAspectRatio(ratioX: 5, ratioY: 2),
    uiSettings: [
      AndroidUiSettings(
        toolbarTitle: 'Crop Image',
        toolbarColor: Colors.black,
        toolbarWidgetColor: Colors.white,
        statusBarColor: Colors.black,
        backgroundColor: Colors.black,
        activeControlsWidgetColor: Colors.white,
        dimmedLayerColor: Colors.black54,
        cropFrameColor: Colors.white,
        cropGridColor: Colors.white30,
        hideBottomControls: false,
        initAspectRatio: CropAspectRatioPreset.ratio7x5,
        lockAspectRatio: false,
      ),
      IOSUiSettings(
        title: 'Crop Image',
        doneButtonTitle: 'Done',
        cancelButtonTitle: 'Cancel',
        // IOS-specific safe area colors and status bar
        aspectRatioLockEnabled: false,
        minimumAspectRatio: 1.0,
      ),
    ],
  );

  if (croppedImage == null) {
    showInSnackBar(message: keyNoImageSelected.tr);
    return null;
  } else {
    return PickedFile(croppedImage.path);
  }
}
