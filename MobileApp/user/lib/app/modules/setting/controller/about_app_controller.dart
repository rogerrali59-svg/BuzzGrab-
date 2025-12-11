import '../../../../export.dart';
import '../../../data/remote_service/network/tbase_controller.dart';

class AboutAppController extends TbaseController {
  final PreferenceManger _preferenceManger = Get.put(PreferenceManger());
  MessageResponseModel messageResponseModel = MessageResponseModel();
  ResponseModel responseModel = ResponseModel();

  bool isLoading = false;

  late TextEditingController pinController;
  FocusNode focusNode = FocusNode();

  TextEditingController languageTextController = TextEditingController();
  FocusNode languageFocusNode = FocusNode();

  String? selectedValue;
  bool isLanguage = true;
  var langValue = 0;
  bool notifyOn = false;

  RxInt selectedIndex = 0.obs;

  bool isYesClicked = false;
  bool isNoClicked = false;

  String versionNumber = "";
  String packageName = "";

  @override
  void onInit() {
    getVersionDetails();
    initEditTextController();
    initFocusNodes();
    super.onInit();
  }

  getVersionDetails() async {
    PackageInfo packageInfo = await PackageInfo.fromPlatform();
    versionNumber = packageInfo.version;
    packageName = packageInfo.packageName;
    update();
  }

  initEditTextController() {
    pinController = TextEditingController();
  }

  initFocusNodes() {
    focusNode = FocusNode();
  }
}
