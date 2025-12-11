import 'package:buzzgrab/app/modules/authentication/views/success_screen.dart';
import 'package:buzzgrab/export.dart';

import '../../../../main.dart';
import '../../../data/remote_service/network/network_exceptions.dart';

class IDVerificationController extends TbaseController {
  var selectedIdType = ''.obs;
  final idTypes = ["Driver's License", "Passport", "National ID"];
  var frontPhoto = Rx<File?>(null);
  var backPhoto = Rx<File?>(null);
  var selfie = Rx<File?>(null);

  bool get isAllCompleted =>
      selectedIdType.isNotEmpty &&
      frontPhoto.value != null &&
      backPhoto.value != null &&
      selfie.value != null;

  void setIdType(String type) {
    selectedIdType.value = type;
    frontPhoto.value=null;
    backPhoto.value=null;
    selfie.value=null;
    update();
  }

  void setFrontPhoto(File file) {
    frontPhoto.value = file;
    update();
  }

  void setBackPhoto(File file) {
    backPhoto.value = file;
    update();
  }

  void setSelfie(File file) {
    try {
      selfie.value = file;
      update();
    } catch (e, st) {
      print('Errpr---$e');
      print('Errpr---$st');
    }
  }

  /// Call Add Verification Document Api
  callAddVerificationDocumentApi() async {
    customLoader.show(Get.context);
    var request = {
      'frontImg': await convertToMultipart(frontPhoto.value?.path ?? ''),
      'backImg': await convertToMultipart(backPhoto.value?.path ?? ""),
      'liveSelfyImg': await convertToMultipart(selfie.value?.path ?? ""),
      'type': selectedIdType.value??""
    };
    await dioClient
        .put('auth/editProfile',
            skipAuth: false, data: FormData.fromMap(request))
        .then(
      (value) {
        if (value != null) {
          customLoader.hide();
          Get.to(SuccessScreen());

        }
      },
    ).onError(
      (error, stackTrace) {
        customLoader.hide();
        NetworkExceptions.getDioException(
            error, stackTrace, 'auth/editProfile');
      },
    );
  }

}
