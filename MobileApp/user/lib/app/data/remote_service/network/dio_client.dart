/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 *  @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/main.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:device_marketing_names/device_marketing_names.dart';
import 'package:flutter/foundation.dart';
import 'package:buzzgrab/app/modules/logger/log_interceptor.dart' as LogInterceptor;
import '../../../../export.dart';

const _defaultConnectTimeout = Duration();
const _defaultReceiveTimeout = Duration();

/// Babita
//  String baseUrl = "http://192.168.2.172:2316/api/";

 /// Taniya Pundir
 String baseUrl = "http://192.168.12.148:2316/api/";

/// Live
//  String baseUrl = "https://buzzgrabit.com/api/";

setContentType() {
  return "application/json";
}

class DioClient {
  static late Dio _dio;
  final List<Interceptor>? interceptors;

  DioClient({this.interceptors}) {
    _dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: _defaultConnectTimeout,
        receiveTimeout: _defaultReceiveTimeout,
        contentType: setContentType(),
        headers: {
          'Content-Type': setContentType(),
        },
      ),
    );

    if (interceptors?.isNotEmpty ?? false) {
      _dio.interceptors.addAll(interceptors!);
    }

    if (kDebugMode) {
      _dio.interceptors.add(LogInterceptor.LogInterceptor(
        responseBody: true,
        error: true,
        requestHeader: true,
        responseHeader: false,
        request: false,
        requestBody: true,
      ));
    }
  }

  Future<dynamic> get(String uri,
      {Map<String, dynamic>? queryParameters,
      Options? options,
      CancelToken? cancelToken,
      ProgressCallback? onReceiveProgress,
      bool? skipAuth}) async {
    try {
      if (skipAuth == false) {
        var token = await preferenceManger.getAuthToken();
        debugPrint("token $token");
        if (token != null) {
          options = Options(headers: {
            "Authorization": "Bearer $token",
            "User-Agent": await getUserAgent(),
          });
        }
      }
      var response = await _dio.get(
        uri,
        queryParameters: queryParameters,
        options: options ??
            Options(headers: {
              'User-Agent': await getUserAgent(),
            }),
        cancelToken: cancelToken,
        onReceiveProgress: onReceiveProgress,
      );
      return response.data;
    } on SocketException catch (e) {
      throw SocketException(e.toString());
    } on FormatException catch (_) {
      throw FormatException("Unable to process the data");
    } catch (e) {
      throw e;
    }
  }

  Future<dynamic> post(String uri,
      {data,
      Map<String, dynamic>? queryParameters,
      Options? options,
      CancelToken? cancelToken,
      ProgressCallback? onSendProgress,
      ProgressCallback? onReceiveProgress,
      bool? skipAuth}) async {
    try {
      if (skipAuth == false) {
        var token = await Get.put(PreferenceManger()).getAuthToken();
        if (token != null) {
          options = Options(headers: {
            "Authorization": "Bearer $token",
            'User-Agent': await getUserAgent(),
          });
        }
      }
      var response = await _dio.post(
        uri,
        data: data,
        queryParameters: queryParameters,
        options: options ??
            Options(headers: {
              'User-Agent': await getUserAgent(),
            }),
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
        onReceiveProgress: onReceiveProgress,
      );
      return response.data;
    } on FormatException catch (_) {
      throw FormatException("Unable to process the data");
    } catch (e) {
      throw e;
    }
  }

  Future<dynamic> patch(String uri,
      {data,
      Map<String, dynamic>? queryParameters,
      Options? options,
      CancelToken? cancelToken,
      ProgressCallback? onSendProgress,
      ProgressCallback? onReceiveProgress,
      bool? skipAuth}) async {
    try {
      if (skipAuth == false) {
        var token = await Get.put(PreferenceManger()).getAuthToken();
        if (token != null) {
          options = Options(headers: {
            "Authorization": "Bearer $token",
            'User-Agent': await getUserAgent(),
          });
        }
      }
      var response = await _dio.patch(
        uri,
        data: data,
        queryParameters: queryParameters,
        options: options ??
            Options(headers: {
              'User-Agent': await getUserAgent(),
            }),
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
        onReceiveProgress: onReceiveProgress,
      );
      return response.data;
    } on FormatException catch (_) {
      throw FormatException("Unable to process the data");
    } catch (e) {
      throw e;
    }
  }

  Future<dynamic> put(String uri,
      {data,
        Map<String, dynamic>? queryParameters,
        Options? options,
        CancelToken? cancelToken,
        ProgressCallback? onSendProgress,
        ProgressCallback? onReceiveProgress,
        bool? skipAuth}) async {
    try {
      if (skipAuth == false) {
        var token = await Get.put(PreferenceManger()).getAuthToken();
        if (token != null) {
          options = Options(headers: {
            "Authorization": "Bearer $token",
            "User-Agent": await getUserAgent(),
          });
        }
      }
      var response = await _dio.put(
        uri,
        data: data,
        queryParameters: queryParameters,
        options: options ??
            Options(headers: {
              'User-Agent': await getUserAgent(),
            }),
        cancelToken: cancelToken,
        onSendProgress: onSendProgress,
        onReceiveProgress: onReceiveProgress,
      );
      return response.data;
    } on FormatException catch (_) {
      throw FormatException("Unable to process the data");
    } catch (e) {
      throw e;
    }
  }

  Future<dynamic> delete(String uri,
      {data,
      Map<String, dynamic>? queryParameters,
      Options? options,
      CancelToken? cancelToken,
      bool? skipAuth}) async {
    try {
      if (skipAuth == false) {
        var token = await PreferenceManger().getAuthToken();
        if (token != null) {
          if (options == null) {
            options = Options(headers: {
              "Authorization": "Bearer $token",
              "User-Agent": await getUserAgent(),
            });
          }
        }
      }

      var response = await _dio.delete(
        uri,
        data: data,
        queryParameters: queryParameters,
        options: options ??
            Options(headers: {
              'User-Agent': await getUserAgent(),
            }),
        cancelToken: cancelToken,
      );
      return response.data;
    } on FormatException catch (_) {
      throw FormatException("Unable to process the data");
    } catch (e) {
      throw e;
    }
  }
}

Future getUserAgent() async {
  DeviceDetails details = DeviceDetails();
  DeviceInfoPlugin info = DeviceInfoPlugin();
  if (Platform.isAndroid) {
    AndroidDeviceInfo androidDeviceInfo = await info.androidInfo;
    details.deviceName = '${androidDeviceInfo.model}/Android';
    details.deviceVersion =
        '${androidDeviceInfo.brand} ${androidDeviceInfo.version.release}';
  } else if (Platform.isIOS) {
    IosDeviceInfo iosDeviceInfo = await info.iosInfo;
    details.deviceName =
        '${await DeviceMarketingNames().getNames()}/${iosDeviceInfo.systemName}';
    details.deviceVersion = iosDeviceInfo.systemVersion;
  }
  PackageInfo packageInfo = await PackageInfo.fromPlatform();
  return "${stringAppName.tr}/${packageInfo.version}/${kDebugMode == true ? "Dev" : "Release"}/(${details.deviceName}) : ${details.deviceVersion})";
}

class DeviceDetails {
  String? deviceName;
  String? deviceID;
  String? deviceVersion;
  String? deviceType;

  DeviceDetails(
      {this.deviceName, this.deviceID, this.deviceVersion, this.deviceType});
}
