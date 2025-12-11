import 'package:buzzgrab/app/data/remote_service/network/tbase_controller.dart';
import 'package:buzzgrab/app/modules/authentication/model/signup_response_model.dart';
import 'package:buzzgrab/app/modules/splash_module/controllers/splash_controller.dart';
import 'package:intl_phone_field/countries.dart';

import '../../../../export.dart';
import '../../../../main.dart';
import '../../../core/values/route_arguments.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../model/forgotPassword_model.dart';

class ForgotController extends TbaseController {
  var showType = typeEmail.obs;
  TextEditingController emailController = TextEditingController();
  FocusNode emailFocusNode = FocusNode();

  hitForgotPasswordApi() async {
    try {
      customLoader.show(Get.context);

      var formData = {
        'email': emailController.text.trim(),
      };

      final response = await DioClient().put(
        'auth/forgotPassword',
        data: formData,
        skipAuth: true,
      );

      if (response != null) {
        ForgotPasswordModel forgotPasswordModel =
            ForgotPasswordModel.fromJson(response);
        customLoader.hide();
        // preferenceManger.saveAuthToken(forgotPasswordModel)
        Get.toNamed(AppRoutes.otpScreen, arguments: {
          'isForgot': true,
          'email': emailController.text.trim(),
        });
        toast('${forgotPasswordModel.message}');
      }
    } on DioException catch (error, stackTrace) {
      print('Error--$error');
      print('Stack--$stackTrace');
      customLoader.hide();
      NetworkExceptions.getDioException(
          error, stackTrace, 'auth/forgotPassword');
      toast(NetworkExceptions.messageData);
    } catch (e, st) {
      print('Error---$e');
      print('Error---$st');
      customLoader.hide();
    }
  }
}
