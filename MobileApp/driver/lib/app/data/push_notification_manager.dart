import 'package:firebase_messaging/firebase_messaging.dart';

import '../../export.dart';
import '../../main.dart';
import '../core/values/app_constant.dart';
import '../routes/app_routes.dart';

var messageNew = "";

// Add the @pragma annotation here
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  // If you're going to use other Firebase services in the background, such as Firestore,
  // make sure you call `initializeApp` before using other Firebase services.
  await Firebase.initializeApp();
  print('Handling a background message ${message.data}');
}

class PushNotificationsManager {
  PushNotificationsManager._();

  factory PushNotificationsManager() => _instance;
  static final PushNotificationsManager _instance =
      PushNotificationsManager._();
  FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  bool _initialized = false;

  Future<void> init() async {
    if (!_initialized) {
      await Firebase.initializeApp();
      // FirebaseAnalytics analytics = FirebaseAnalytics.instance;
      // For iOS request permission first.
      await _firebaseMessaging.requestPermission(alert: true, sound: true);
      await _firebaseMessaging.setForegroundNotificationPresentationOptions(
          alert: true, badge: true, sound: true);
      // For testing purposes, print the Firebase Messaging token
      await _firebaseMessaging.getToken().then((value) {
        deviceToken = value!;
        debugPrint("Firebase Messaging token $value");
      });
      getInitialMessage();
      onMessage();
      onAppOpened();

      // Register background message handler
      FirebaseMessaging.onBackgroundMessage(
          _firebaseMessagingBackgroundHandler);

      _initialized = true;
    }
  }

  getInitialMessage() async {
    await Future.delayed(Duration(milliseconds: 500));
    _firebaseMessaging.getInitialMessage().then((message) async {
      if (message != null) {
        debugPrint("message1  listen ${message.data}");
        notificationRedirection(message.data);
      } else {
        // preferenceManger.isNotifyCheck(isNotifiedCheck: false);
      }
    });
  }

  int number = 0;

  onMessage() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) async {
      debugPrint("message2  action ${message.data}");
      debugPrint(number.toString());
      var notification = message.data;
      var androids = AndroidInitializationSettings("@drawable/notification");
      var ios = DarwinInitializationSettings();
      var platform = InitializationSettings(android: androids, iOS: ios);

      flutterLocalNotificationsPlugin.initialize(platform,
          onDidReceiveNotificationResponse: (NotificationResponse data) {
        notificationRedirection(message.data);
      });

      if (Platform.isAndroid) {
        var androidPlatformChannelSpecifics = AndroidNotificationDetails(
          'com.alcoholdeliverydriver.provider',
          'alcoholdeliverydriver',
          channelDescription: 'Channel for alcoholdeliverydriver notifications',
          icon: '@drawable/notification',
          importance: Importance.max,
          priority: Priority.high,
          groupKey: "alcoholdeliverydriver",
          setAsGroupSummary: true,
          groupAlertBehavior: GroupAlertBehavior.all,
          playSound: true,
          enableVibration: true,
          color: Colors.blue.shade800,
        );

        var iOSPlatformChannelSpecifics = DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        );

        var platformChannelSpecifics = NotificationDetails(
          android: androidPlatformChannelSpecifics,
          iOS: iOSPlatformChannelSpecifics,
        );
        await flutterLocalNotificationsPlugin.show(
          1,
          message.notification?.title,
          message.notification?.body,
          platformChannelSpecifics,
          payload: jsonEncode(notification),
        );
      }
    });
  }

  onAppOpened() {
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      debugPrint("message ${message.data['action']}");
      notificationRedirection(message.data);
    });
  }

  notificationRedirection(Map data) async {
    isNotified = true;
    var action = data['notification_type'];
    var driverId = data['sender_id'] ?? "";
    var fullName = data['full_name'] ?? "";
    var profileImage = data['profile_pic'] ?? "";
    var objId = data['obj_id'] ?? "";
    switch (action) {
      case '$NEW_MESSAGE':
        if (Get.currentRoute == AppRoutes.chatScreen) {
        } else {
          Get.offAllNamed(AppRoutes.chatScreen, arguments: {
            'driver_id': driverId ?? "",
            'full_name': fullName ?? "",
            'profile_file': profileImage ?? "",
            'isPushNotification': true
          });
        }
        break;
      case '$BOOKING_CONFIRMED':
        Get.offAllNamed(AppRoutes.liveOrderScreen,
                arguments: {'id': objId ?? "", 'isPushNotification': true})
            ?.then((_) {});
        break;
      case '$PARCEL_PICKED_UP':
        Get.offAllNamed(AppRoutes.liveOrderScreen,
                arguments: {'id': objId ?? "", 'isPushNotification': true})
            ?.then((_) {});
        break;
      case '$PARCEL_DROPPED':
        Get.offAllNamed(AppRoutes.liveOrderScreen,
                arguments: {'id': objId ?? "", 'isPushNotification': true})
            ?.then((_) {});
      case '$DELIVERY_STARTED':
        Get.offAllNamed(AppRoutes.liveOrderScreen,
                arguments: {'id': objId ?? "", 'isPushNotification': true})
            ?.then((_) {});
      case '$DELIVERY_ENDED':
        Get.offAllNamed(AppRoutes.liveOrderScreen,
                arguments: {'id': objId ?? "", 'isPushNotification': true})
            ?.then((_) {});
        break;
      default:
      // Get.offAllNamed(AppRoutes.notificationScreen);
    }
  }
}

class GlobalVariable {
  static final GlobalKey navState = GlobalKey();
}

//f75843c5-d9f3-4705-b33c-b06e6bb54a76
//e180c91f-0445-49a1-8021-212a7bfbee40

//{notification_type: 7, obj_id: be48bf8f-9992-4c64-80ae-9593a83621c3,.
// action {notification_type: 8, obj_id: 5cd9d0aa-10a5-496b-90ba-5715aaa379f4,
