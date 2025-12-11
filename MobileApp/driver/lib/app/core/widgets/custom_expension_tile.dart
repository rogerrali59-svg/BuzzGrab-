/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:alcoholdeliverydriver/export.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';

customTile({String? question, String? answer}) => ExpansionTile(
      title: TextView(text: question ?? '', textStyle: textStyleTitle(), maxLine: 3),
      children: [
        HtmlWidget(
          answer!,
          // onLinkTap: (url, context, attributes, element) {},
        )
      ],
    );
