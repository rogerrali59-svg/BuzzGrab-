/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:device_info_plus/device_info_plus.dart';
import 'package:alcoholdeliverydriver/app/core/translations/translation_service.dart';
import 'package:alcoholdeliverydriver/app/routes/app_pages.dart';
import 'package:geolocator/geolocator.dart';
import '../../export.dart';
import 'app/core/values/theme_controller.dart';
import 'app/core/widgets/custom_loader.dart';
import 'app/data/local_service/preference/preference_manager.dart';
import 'app/modules/authentication/model/signup_response_model.dart';
import 'app/modules/nointernet/dependency.dart';
import 'app/modules/splash_module/binding/binding.dart';

var globalValue = 0;
var log = Logger();
// Position? currentPosition;

Rx<Position?> currentPosition = Rx<Position?>(null);
RxString currentAddress = ''.obs;
GetStorage storage = GetStorage();
CustomLoader customLoader = CustomLoader();
TextTheme textTheme = Theme.of(Get.context!).textTheme;
PreferenceManger preferenceManger = PreferenceManger();
var tempDir;
var latitude;
var longitude;
final isGoogleLogin = false.obs;
var deviceToken;
var deviceName;
var deviceVersion;
var deviceType;
var biometricCheck = 0;
RxInt selectRole = 0.obs;

class GlobalVariable {
  static final GlobalKey<ScaffoldMessengerState> navState =
      GlobalKey<ScaffoldMessengerState>();
  static final GlobalKey<NavigatorState> navigatorState =
      GlobalKey<NavigatorState>();
}

final ThemeController themeController =
    Get.put(ThemeController(), permanent: true);

bool isNotified = false;
Rx<UserData> signUpData = UserData().obs;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await GetStorage.init();
  try {
    await getDevicData();
  } catch (e, st) {
    print('Error---$e');
    print('Stacktrace---$st');
  }
  DependencyInjection.init();
  // errorCrashReport();
  // lightChromeUI();
  Get.put(ThemeController(),
      permanent: true); // Inject ThemeController before runApp

  tempDir = await getTemporaryDirectory();

  initApp();
}

getDevicData() async {
  DeviceInfoPlugin info = DeviceInfoPlugin();
  if (Platform.isAndroid) {
    AndroidDeviceInfo androidDeviceInfo = await info.androidInfo;
    deviceName = androidDeviceInfo.model;
    deviceVersion = androidDeviceInfo.version.release;
    deviceType = "1";
  } else if (Platform.isIOS) {
    IosDeviceInfo iosDeviceInfo = await info.iosInfo;
    deviceName = iosDeviceInfo.model;
    deviceVersion = iosDeviceInfo.systemVersion;
    deviceType = "2";
  }
}

initApp() async {
  await ScreenUtil.ensureScreenSize();

  Get.config(
    enableLog: true,
    logWriterCallback: (text, {isError = false}) {
      final colorCode = isError ? '\x1B[31m' : '\x1B[34m';
      print('$colorCode$text\x1B[0m');
    },
  );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      builder: (context, widget) => Obx(() {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
          child: GetMaterialApp(
            themeMode: themeController.themeMode.value,
            theme: ThemeConfig.lightTheme,
            darkTheme: ThemeConfig.lightTheme,
            initialBinding: SplashBinding(),
            initialRoute: AppPages.INITIAL,
            getPages: AppPages.routes,
            scaffoldMessengerKey: GlobalVariable.navState,
            debugShowCheckedModeBanner: false,
            enableLog: true,
            locale: TranslationService.locale,
            fallbackLocale: TranslationService.fallbackLocale,
            translations: TranslationService(),
            builder: EasyLoading.init(),
            defaultTransition: Transition.cupertino,
          ),
        );
      }),
    );
  }
}

class AppLifecycleHandler extends StatefulWidget {
  final Widget child;

  const AppLifecycleHandler({Key? key, required this.child}) : super(key: key);

  @override
  State<AppLifecycleHandler> createState() => _AppLifecycleHandlerState();
}

class _AppLifecycleHandlerState extends State<AppLifecycleHandler>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _setOnline();
  }

  void _setOnline() {
    print("User is ONLINE");
    // TODO: Yahan apne backend ko API call karo "user online"
  }

  void _setOffline() {
    print("User is OFFLINE");
    // TODO: Yahan apne backend ko API call karo "user offline"
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _setOnline();
    } else if (state == AppLifecycleState.paused ||
        state == AppLifecycleState.inactive ||
        state == AppLifecycleState.detached) {
      _setOffline();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _setOffline();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return widget.child;
  }
}
