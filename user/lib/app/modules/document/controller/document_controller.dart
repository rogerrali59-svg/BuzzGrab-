import 'package:get/get.dart';

class DocumentsController extends GetxController {
  // Document statuses → rejected, approved, pending
  RxString drivingLicenseStatus = "Rejected".obs;

  // For uploading new docs
  void uploadPassport() {
    // TODO: Add upload logic
    print("Passport upload tapped");
  }

  void uploadStateID() {
    // TODO: Add upload logic
    print("State ID upload tapped");
  }

  void viewDrivingLicense() {
    // TODO: Navigate to driving license detail screen
    print("Driving License tapped");
  }
}
