/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/app/core/widgets/shimmer_view_widget.dart';
import 'package:flutter_html/flutter_html.dart';
import 'package:buzzgrab/export.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';

import '../../../core/translations/local_keys.dart';
import '../../../core/values/route_arguments.dart';
import '../controllers/static_page_controller.dart';

class StaticPageScreen extends GetView<StaticPageController> {
  final controller = Get.find<StaticPageController>();

  @override
  Widget build(BuildContext context) {
    final args = Get.arguments;
    final pageTitle =
        args != null && args['title'] != null ? args['title'] : 'Static Page';

    return Obx(
      () => Scaffold(
        backgroundColor: Colors.white,
        appBar: CustomAppBar(
          appBarTitleText: pageTitle,
        ),
        body: controller.isLoading.value==true?StaticPageShimmer(): controller.staticPagesResponseModel.value.data?.title == null
            ? noDataToShow(inputText: 'Data will be added soon')
            : SingleChildScrollView(

              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [

                    HtmlWidget(
                      "${controller.staticPagesResponseModel.value.data?.content ?? ""}",
                      textStyle: TextStyle(
                        fontSize: 12,
                        color: Colors.black,
                        fontWeight: FontWeight.w400,
                      ),
                    )
                  ],
                ).marginSymmetric(horizontal: margin_15),
            ),
      ),
    );
  }
}
