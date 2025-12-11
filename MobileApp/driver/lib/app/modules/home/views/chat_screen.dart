import 'package:intl/intl.dart';

import '../../../../export.dart';
import '../../../core/translations/local_keys.dart';
import '../../splash_module/controllers/splash_controller.dart';
import '../controller/chat_screen_controller.dart';

class ChatScreen extends GetView<ChatScreenController> {
  final controller = Get.put(ChatScreenController());

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: true,

        appBar: CustomAppBar(
          appBarTitleText: '${controller.receiverName ?? ''}',

          actionWidget: [
            GestureDetector(
              onTap: () {
                // _callSupport("28471324");
              },
              child: Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                  shape: BoxShape.circle,
                ),
                child: Image.asset(
                  iconCallBlue,
                  height: 24,
                  width: 24,
                ),
              ),
            ).paddingOnly(right: 15),
          ],
        ),

        body: _body(),
      ),
    );
  }

  _body() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
            child: chatList().paddingOnly(left: margin_10, right: margin_10)),
        _sendMessage()
      ],
    );
  }

  Widget chatList() {
    return Obx(() => controller.chatList.isEmpty
        ? noDataToShow(inputText: keyNoConversationYet.tr)
        : ListView.builder(
            padding: EdgeInsets.only(
                left: margin_10, right: margin_10, bottom: margin_10),
            controller: controller.scrollController,
            shrinkWrap: true,
            reverse: true,
            itemCount: controller.chatList.length,
            itemBuilder: (BuildContext context, int index) {
              return Obx(() => Column(
                    children: [
                      index == controller.chatList.length - 1 ||
                              !isSameDate(
                                  DateTime.parse(controller
                                      .chatList[index].createdOn
                                      .toString()),
                                  DateTime.parse(controller
                                      .chatList[index + 1].createdOn
                                      .toString()))
                          ? headerWidget(DateTime.parse(controller
                              .chatList[index].createdOn!
                              .toIso8601String()))
                          : SizedBox(),
                      controller.chatList[index].receiver.toString() ==
                              userResponseModel.data?.id.toString()
                          ? rightCell(index: index)
                          : leftCell(index: index),
                    ],
                  ));
            },
          ));
  }

  _sendMessage() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: margin_10, vertical: margin_14),
      child: TextField(
        maxLines: 2,
        minLines: 1,
        onChanged: (value) {
          if (value == " ") {
            controller.sendController.text = "";
          }
        },
        controller: controller.sendController,

        // **Add this decoration to get grey outline border with radius**
        decoration: InputDecoration(
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8), // adjust radius as needed
            borderSide: BorderSide(
              color: Colors.grey.shade200,
              width: 1,
            ),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide(
              color: Colors.grey.shade200,
              width: 1,
            ),
          ),
          suffixIcon: GestureDetector(
            onTap: () {
              if (controller.sendController.text.isNotEmpty) {
                controller.hitSendMessageApiCall(
                    toIdMessage: controller.driverId ?? "");
                controller.chatList.refresh();
              }
            },
            child: AssetImageWidget(
              imageUrl: iconSend,
              imageHeight: height_20,
              imageWidth: height_20,
            ).marginAll(margin_10),
          ),
          contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          hintText: keySendMessage.tr,
          hintStyle: TextStyle(color: Colors.grey, fontSize: font_13),
          suffixIconConstraints: BoxConstraints(minHeight: 24, minWidth: 24),
        ),
      ),
    );
  }

// Profile Info Widget (Image + Name)
  Widget profileInfo() {
    return Row(
      children: [
        NetworkImageWidget(
          imageurl: '',
          imageHeight: height_35,
          imageWidth: height_35,
          placeHolder: icon_person,
          radiusAll: height_35,
        ),
        SizedBox(width: width_10),

        Expanded(
          child: TextView(
            text: "Sam",
            maxLine: 1,
            textStyle: textStyleTitle().copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w700,
              fontSize: font_16,
              overflow: TextOverflow.ellipsis,
            ),
            textAlign: TextAlign.start,
          ),
        ),

      ],
    );
  }

  rightCell({index}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Container(
          padding: EdgeInsets.all(margin_10),
          decoration: BoxDecoration(
              color: colorAppColor,
              borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(radius_10),
                  topLeft: Radius.circular(radius_10),
                  topRight: Radius.circular(radius_10))),
          constraints:
              BoxConstraints(maxWidth: Get.width * .68, minWidth: width_0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                controller.chatList[index].message ?? "",
                style: TextStyle(
                  fontSize: font_14,
                  fontWeight: FontWeight.w400,
                  fontFamily: "Inter",
                  color: Colors.black,
                ),
              ),
            ],
          ),
        ),
        SizedBox(height: height_2),
        Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            GestureDetector(
              onTap: () {
                // print(
                //     'afsadf ${controller.loadChatResponseModel.value.data![index].seen}');
                // print('afsadf ${controller.chatList[index].seen}');
              },
              child: Align(
                  alignment: Alignment.centerRight,
                  child: TextView(
                    text: utcToLocalLatest(
                        DateTime.parse(
                            controller.chatList[index].createdOn.toString()),
                        'HH:mm a'),
                    textStyle: textStyleBody1().copyWith(
                      color: Colors.grey,
                      fontSize: font_12,
                      fontWeight: FontWeight.w400,
                      fontFamily: "Inter",
                    ),
                  )),
            ),
            // Obx(() => AssetImageWidget(
            //       imageUrl: seen,
            //       color: controller
            //                   .loadChatResponseModel.value.data?[index].seen ==
            //               true
            //           ? colorAppColor
            //           : Colors.grey,
            //       imageHeight: height_15,
            //     ))

            // AssetImageWidget(imageUrl: iconRead,imageHeight: height_15,color: controller.chatList[index].seen ==true?colorAppColor:Colors.grey,)
          ],
        ),
      ],
    ).marginOnly(bottom: margin_5);
  }

  leftCell({required int index}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: EdgeInsets.all(margin_10),
          decoration: BoxDecoration(
              color: Colors.grey.shade400,
              borderRadius: BorderRadius.only(
                  bottomRight: Radius.circular(radius_10),
                  topLeft: Radius.circular(radius_10),
                  topRight: Radius.circular(radius_10))),
          constraints:
              BoxConstraints(maxWidth: Get.width * .68, minWidth: width_0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                controller.chatList[index].message ?? "",
                style: TextStyle(
                    fontFamily: "Inter",
                    fontWeight: FontWeight.normal,
                    fontSize: font_13),
              ),
            ],
          ),
        ),
        // The time text will be aligned to the left
        SizedBox(height: height_2),
        // Add some space between the message and time
        Align(
            alignment: Alignment.centerLeft, // Align time to the left
            child: TextView(
              text: DateFormat('HH:mm a').format(DateTime.parse(
                  controller.chatList[index].createdOn?.toIso8601String() ??
                      "")),
              textStyle: textStyleBody1().copyWith(
                color: Colors.grey,
                fontSize: font_12,
                fontWeight: FontWeight.w400,
                fontFamily: "Inter",
              ),
            )),
      ],
    ).marginOnly(bottom: margin_5);
  }
}

String extractTime(String? createdOn) {
  if (createdOn == null || createdOn.isEmpty) return "";
  return createdOn.split(" ").take(2).join(" ").toLowerCase();
}
