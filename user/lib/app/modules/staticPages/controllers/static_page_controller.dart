import 'package:buzzgrab/export.dart';

import '../../../../main.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../model/static_page_response_model.dart';

class StaticPageController extends GetxController {
  int pageType = 0;
  Rx<StaticPageResponseModel> staticPagesResponseModel =
      StaticPageResponseModel().obs;

  @override
  void onInit() {
    getArguments();
    super.onInit();
  }

  getArguments() {
    print(Get.arguments);
    if (Get.arguments != null) {
      if (Get.arguments["type_id"] != null) {
        pageType = Get.arguments["type_id"];
      }
    }
  }

  @override
  onReady() {
    hitGetPagesApiCall();
    super.onReady();
  }

  RxBool isLoading=true.obs;

  hitGetPagesApiCall() async {
    customLoader.show(Get.overlayContext);
    await DioClient()
        .get('pages/cms/${pageType}',skipAuth: false)
        .then((value) async {
      if (value != null) {
        staticPagesResponseModel.value =
            StaticPageResponseModel.fromJson(value);

        staticPagesResponseModel.refresh();
        print('staticPagesResponseModel ${staticPagesResponseModel.value.data?.title}');
        print('staticPagesResponseModel ${jsonEncode(staticPagesResponseModel.value.data)}');
        isLoading.value = false;
      }
      customLoader.hide();
    }).onError((error, stackTrace) {
      isLoading.value = false;
      debugPrint("error:${error}");
      debugPrint("error:${stackTrace}");
      customLoader.hide();
      NetworkExceptions.getDioException(
          error, stackTrace, "/pages/cms/${pageType}");
      toast(NetworkExceptions.messageData);
    });
  }
}
