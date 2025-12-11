import 'package:intl/intl.dart';

import '../../../../export.dart';
import '../controller/notification_controller.dart';
import '../model/notification_response_model.dart';

class NotificationScreen extends StatelessWidget {
  final NotificationController controller = Get.put(NotificationController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        centerTitle: true,
        appBarTitleText: 'Notification',
        actionWidget: [

          Container(

            padding:
                EdgeInsets.symmetric(horizontal: margin_10, vertical: margin_5),
            margin: EdgeInsets.only(right: margin_10),

            decoration: BoxDecoration(
              color: colorAppColor,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              '2 NEW',
              style: textStyleBodyMedium().copyWith(fontSize: font_13,color: Colors.white),
            ),
          ),
        ],
      ),
      body: Obx(() {
        final notifications = controller.notifications;

        if (notifications.isEmpty) {
          return const Center(
            child:
                Text('No Notifications', style: TextStyle(color: Colors.black)),
          );
        }

        // Sort newest → oldest

        String? lastHeader;

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: notifications.length,
          itemBuilder: (context, index) {
            final item = notifications[index];
            final currentHeader = item.title;
            final showHeader = currentHeader != lastHeader;
            lastHeader = currentHeader;

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (showHeader) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        item.title,
                        style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white),
                      ),
                      TextButton(
                        onPressed: () {},
                        child: const Text(
                          "Mark all as read",
                          style: TextStyle(
                              color: Colors.blueAccent,
                              fontWeight: FontWeight.w500,
                              fontSize: 14),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: height_8),
                ],
                _buildNotificationItem(item),
                if (index != notifications.length - 1)
                  const Divider(color: Colors.grey, height: 30, thickness: 1),
              ],
            );
          },
        );
      }),
    );
  }

  Widget _buildNotificationItem(NotificationData item) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Icon bubble
        Container(
          decoration: const BoxDecoration(
            color: bgColor,
            shape: BoxShape.circle,
          ),
          padding: EdgeInsets.all(margin_10),
          child: Icon(Icons.shopping_bag_outlined,
              color: Colors.blueAccent, size: font_24),
        ),
        SizedBox(width: height_12),
        // Message details
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.title,
                style: textStyleBodyMedium().copyWith(
                  fontWeight: FontWeight.w600,
                  fontSize: font_15,
                ),
              ),
              SizedBox(height: height_5),
              Text(
                item.title,
                style: textStyleBodyMedium()
                    .copyWith(color: Colors.grey, fontSize: font_12),
              ),
            ],
          ),
        ),
        SizedBox(width: width_10),
        // Time text
        Text(
          timeAgo(item.createdOn),
          style: textStyleBodyMedium()
              .copyWith(color: Colors.grey, fontSize: font_12),
        ),
      ],
    );
  }
}
