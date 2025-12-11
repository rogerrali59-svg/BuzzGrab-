/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

// Package imports:

import 'package:flutter_logger/FlutterLogger.dart';

import '../../../../export.dart';
import '../../../../main.dart';
import '../../../../model/error_response_model.dart';
import 'dio_client.dart';

class NetworkExceptions {
  static String messageData = "";

  static getDioException(error, stacktrace, endPoint) {
    if (error is Exception) {
      try {
        reportCrash(error: messageData, stackTrace: error);
        if (error is DioException) {
          if (error.response!.statusCode != 400) {
            reportCrash(
                error: messageData.toString(),
                stackTrace: stacktrace.toString());
          }

          switch (error.type) {
            case DioExceptionType.cancel:
              return messageData = stringRequestCancelled;
            case DioExceptionType.connectionTimeout:
              return messageData = stringConnectionTimeout;
            case DioExceptionType.unknown:
              List<String> dateParts = error.message!.split(":");
              List<String> message = dateParts[2].split(",");

              if (message[0].trim() == stringConnectionRefused) {
                return messageData = stringServerMaintenance;
              } else if (message[0].trim() == stringNetworkUnreachable) {
                return messageData = stringNetworkUnreachable;
              } else if (dateParts[1].trim() == stringFailedToConnect) {
                return messageData = stringInternetConnection;
              } else {
                return messageData = dateParts[1];
              }
            case DioExceptionType.receiveTimeout:
              return messageData = stringTimeOut;
            case DioExceptionType.badResponse:
              switch (error.response!.statusCode) {
                case 400:
                  print('error.res ${error.response?.data}');
                  Map<String, dynamic> data = error.response?.data;

                  if (data['message'] != 'Something went wrong')
                    toast(data["message"]);
                  if (data.values.elementAt(0).runtimeType == String) {
                    return messageData = data.values.elementAt(0);
                  } else {
                    Map<String, dynamic> datas = data.values.elementAt(0);
                    if (data.values.elementAt(0) == null) {
                      var dataValue = ErrorMessageResponseModel.fromJson(
                              error.response?.data)
                          .message;
                      if (dataValue == null) {
                        return messageData = stringUnAuthRequest;
                      } else {
                        reportCrash(
                            error: messageData.toString(),
                            stackTrace: stacktrace.toString());
                        return messageData = dataValue;
                      }
                    } else {
                      reportCrash(
                          error: messageData.toString(),
                          stackTrace: stacktrace.toString());
                      return messageData = datas.values.first[0];
                    }
                  }
                case 401:
                  // TODO: remove LocalKey_token
                  Map<String, dynamic> data = error.response?.data;

                  storage.remove(LOCALKEY_token);
                  PreferenceManger().clearLoginData();
                  Get.offAllNamed(AppRoutes.logIn);
                  toast(data["message"]);
                  try {
                    return messageData =
                        error.response?.data['message'] ?? 'Session expired';
                  } catch (err) {
                    return messageData = 'Session expired';
                  }
                case 403:
                  // TODO: remove LocalKey_token

                  reportCrash(
                      error: messageData.toString(),
                      stackTrace: stacktrace.toString());
                  PreferenceManger().clearLoginData();
                  // Get.offAllNamed(AppRoutes.logIn);
                  try {
                    return messageData =
                        error.response?.data['message'] ?? 'Session expired';
                  } catch (err) {
                    return messageData = 'Session expired';
                  }
                case 404:
                  return messageData = stringNotFound;
                case 408:
                  reportCrash(
                      error: messageData.toString(),
                      stackTrace: stacktrace.toString());
                  return messageData = stringRequestTimeOut;
                case 500:
                  reportCrash(
                      error: messageData.toString(),
                      stackTrace: stacktrace.toString());
                  return messageData = stringInternalServerError;
                case 503:
                  reportCrash(
                      error: messageData.toString(),
                      stackTrace: stacktrace.toString());
                  return messageData = stringInternetServiceUnavailable;
                default:
                  return messageData = stringSomethingsIsWrong;
              }
            case DioExceptionType.sendTimeout:
              return messageData = stringTimeOut;
            case DioExceptionType.badCertificate:
              // TODO: Handle this case.
              break;
            case DioExceptionType.badResponse:
              // TODO: Handle this case.
              break;
            case DioExceptionType.connectionError:
              // TODO: Handle this case.
              break;
          }
        } else if (error is SocketException) {
          return messageData = socketExceptions;
        } else {
          return messageData = stringUnexpectedException;
        }
      } on FormatException catch (_) {
        return messageData = stringFormatException;
      } catch (_) {
        return messageData = stringUnexpectedException;
      }
    } else {
      if (error.toString().contains(stringNotSubType)) {
        return messageData = stringUnableToProcessData;
      } else {
        return messageData = stringUnexpectedException;
      }
    }
  }
}

reportCrash({error, stackTrace}) async {
  PackageInfo packageInfo = await PackageInfo.fromPlatform();
  DeviceDetails details = DeviceDetails();
  String version = packageInfo.version;
  var req = AuthRequestModel.logCrashErrorReq(
    error: error ?? "",
    packageVersion: packageInfo.version ?? "",
    phoneModel: details.deviceName ?? '',
    ip: version ?? '',
    stackTrace: stackTrace ?? "",
  );
  try {
    final response = DioClient()
        .post("/logger/create-crash-log/", data: FormData.fromMap(req));
    print("response:${response}");
  } catch (e, str) {
    toast("$e\n$str");
  }
}
