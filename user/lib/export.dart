/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

export 'dart:async';
export 'dart:convert';

// dart package
export 'dart:io';
export 'dart:typed_data';
export 'package:buzzgrab/app/data/remote_service/network/tbase_controller.dart';
export 'package:cached_network_image/cached_network_image.dart';
export 'package:dio/dio.dart' hide VoidCallback;
export 'package:file_picker/file_picker.dart';
export 'package:firebase_auth/firebase_auth.dart';
export 'package:firebase_core/firebase_core.dart';
export 'package:flutter/gestures.dart';
export 'package:buzzgrab/app/data/remote_service/network/dio_client.dart';

// flutter package
export 'package:flutter/material.dart';
//splash_module

export 'package:flutter/services.dart';
export 'package:flutter_easyloading/flutter_easyloading.dart';
export 'package:flutter_local_notifications/flutter_local_notifications.dart';
export 'package:flutter_screenutil/flutter_screenutil.dart';
export 'package:buzzgrab/app/core/utils/helper_widget.dart';

// components
export 'package:buzzgrab/app/core/values/app_assets.dart';
export 'package:buzzgrab/app/core/values/app_colors.dart';

// constants
export 'package:buzzgrab/app/core/values/app_constant.dart';
export 'package:buzzgrab/app/core/values/app_strings.dart';
export 'package:buzzgrab/app/core/values/app_theme.dart';
export 'package:buzzgrab/app/core/values/dimens.dart';
export 'package:buzzgrab/app/core/values/font_family.dart';
export 'package:buzzgrab/app/core/values/text_styles.dart';
export 'package:buzzgrab/app/core/widgets/button_widget.dart';
export 'package:buzzgrab/app/core/widgets/custom_appbar.dart';
export 'package:buzzgrab/app/core/widgets/custom_expension_tile.dart';
export 'package:buzzgrab/app/core/widgets/custom_flashbar.dart';
export 'package:buzzgrab/app/core/widgets/custom_image.dart';

//main
export 'package:buzzgrab/app/core/widgets/custom_loader.dart';
export 'package:buzzgrab/app/core/widgets/custom_textfield.dart';
export 'package:buzzgrab/app/core/widgets/dialogs.dart';
export 'package:buzzgrab/app/core/widgets/other_screen_heading.dart';
export 'package:buzzgrab/app/core/widgets/read_more_widget.dart';
export 'package:buzzgrab/app/core/widgets/text_view.dart';
//Controllers

export 'package:buzzgrab/app/data/common_models/error_response_model.dart';
export 'package:buzzgrab/app/data/common_models/message_response_model.dart';
export 'package:buzzgrab/app/data/local_service/local_keys.dart';
export 'package:buzzgrab/app/data/local_service/preference/preference_manager.dart';
export 'package:buzzgrab/app/data/remote_service/entity/request_model/auth_reuest_model.dart';
//pages

//shared
export 'package:buzzgrab/app/modules/about/controllers/about_us_controller.dart';
export 'package:buzzgrab/app/modules/asset_image/asset_image.dart';
//Views

//Bindings
export 'package:buzzgrab/app/modules/authentication/binding/binding.dart';
export 'package:buzzgrab/app/modules/authentication/controllers/login_controller.dart';
export 'package:buzzgrab/app/modules/authentication/controllers/register_controller.dart';
export 'package:buzzgrab/app/modules/authentication/views/login_screen.dart';
export 'package:buzzgrab/app/modules/home/binding/binding.dart';
export 'package:buzzgrab/app/modules/network-image/network_image.dart';
export 'package:buzzgrab/app/modules/onboarding/binding/binding.dart';
export 'package:buzzgrab/app/modules/splash_module/binding/binding.dart';
export 'package:buzzgrab/app/routes/app_routes.dart';
//videoCall

// export 'package:flutter_share/flutter_share.dart';
export 'package:get/get.dart'
    hide Response, HeaderValue, MultipartFile, FormData;
export 'package:get_storage/get_storage.dart';
export 'package:google_sign_in/google_sign_in.dart';
export 'package:in_app_review/in_app_review.dart';

//onboarding
// export 'package:introduction_screen/introduction_screen.dart';
// export 'package:introduction_screen/introduction_screen.dart';
// dependencies
export 'package:logger/logger.dart';
export 'package:package_info_plus/package_info_plus.dart';
export 'package:path_provider/path_provider.dart';
export 'package:url_launcher/url_launcher.dart';
