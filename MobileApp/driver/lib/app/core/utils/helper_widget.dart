import 'package:alcoholdeliverydriver/app/modules/home/model/order_model/new_order_model.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';
import 'package:open_file/open_file.dart';
import 'package:alcoholdeliverydriver/app/core/utils/time_ago.dart';
import 'package:alcoholdeliverydriver/app/data/remote_service/network/dio_client.dart';
import 'package:intl/intl.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../../export.dart';
import '../../../main.dart';
import '../../../model/error_response_model.dart';
import '../../data/remote_service/network/network_exceptions.dart';
import '../../modules/profile/controller/select_language_controller.dart';
import '../translations/local_keys.dart';
import 'image_picker_and_cropper.dart';

int backPressCounter = 0;

const TYPE_IOS = 0;
const TYPE_ANDROID = 1;
const TYPE_OTHER = 2;

SizedBox emptySizeBox() => const SizedBox(
      height: 0.0,
      width: 0.0,
    );

Center resultNotFound({message}) => Center(
      child: Text(
        message ?? keyNoResultFound.tr,
        style: textStyleBody2(),
      ),
    );

darkChromeUI() {
  return SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));
}

getLanguageMethod() {
  switch (selectedLanguage.value) {
    case ENGLISH:
      return 0;
      break;

    case FRENCH:
      return 1;
      break;

    case PORTUGUESE:
      return 2;
      break;

    default:
      return 0; // fallback if needed
  }
}

lightChromeUI() {
  return SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.white,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.dark));
}

bool doubleBackToExitPressedOnce = false;

Future<bool> onBackPressed(BuildContext context) async {
  if (doubleBackToExitPressedOnce) {
    return true;
  } else {
    Fluttertoast.showToast(
        msg: stringExitWarning,
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.black,
        textColor: Colors.white,
        fontSize: 16.0);

    doubleBackToExitPressedOnce = true;
    await Future.delayed(const Duration(milliseconds: 3500));
    doubleBackToExitPressedOnce = false;
    return false;
  }
}

getNewLanguageLocal({lang}) {
  switch (lang) {
    case 0:
      return Locale('en', 'US');

    case 1:
      return Locale('ar', 'AR');

    case 2:
      return Locale('zh', 'CN');

    case 3:
      return Locale('es', 'ES');

    case 4:
      return Locale('fr', 'FR');
  }
}

loadingWidget() => Center(
        child: CircularProgressIndicator(
      color: colorAppColors,
      backgroundColor: Colors.white,
    ));

utcToLocalReviewsDate(var date) {
  DateTime dateTime =
      DateFormat("yyyy-MM-dd hh:mm:ss").parse(date, true).toLocal();
  var df = DateFormat('dd MMMM yyyy').format(dateTime);
  return df;
}

utcToLocalReviewsDateTime(var date) {
  DateTime dateTime =
      DateFormat("yyyy-MM-dd hh:mm:ss").parse(date, true).toLocal();
  var df = DateFormat('dd MMMM yyyy hh:mm:ss a').format(dateTime);
  return df;
}

utcToStanderDateTime(var date) {
  DateTime dateTime = DateFormat("yyyy-MM-dd hh:mm:ss").parse(date);
  var df = DateFormat('hh:mma').format(dateTime);
  return df;
}

utcToTime(var date) {
  DateTime dateTime =
      DateFormat("yyyy-MM-dd hh:mm:ss").parse(date, true).toLocal();
  var df = DateFormat('HH:mm').format(dateTime);
  return df;
}

utcToLocalLatestNewsDate(var date) {
  DateTime dateTime =
      DateFormat("yyyy-MM-dd hh:mm:ss").parse(date, true).toLocal();
  var df = DateFormat('dd MMM yyyy').format(dateTime);
  return df;
}

utCtoGMT(var dates) {
  var date = DateFormat("yyyy-MM-dd").format(DateTime.parse(dates).toUtc());
  return date;
}

timeNow(var date) {
  DateTime dateTime =
      DateFormat("yyyy-MM-dd hh:mm:ss").parse(date, true).toLocal();
  var df = TimeAgo.timeAgoSinceDate(dateTime.toString());
  return df;
}

extension StringExtensions on String {
  String capitalized() {
    return "${this[0].toUpperCase()}${this.substring(1)}";
  }
}

convertTimeToLocal({dateString, dateFormat}) {
  if (dateString != null && dateString != "") {
    try {
      // Parse the date assuming it is in the correct ISO 8601 format
      var strToDateTime = DateTime.parse(dateString);
      final convertLocal = strToDateTime.toLocal();
      DateFormat newFormat = DateFormat(dateFormat ?? "MM.dd.yyyy");
      return newFormat.format(convertLocal);
    } catch (e) {
      // Catch parsing errors
      print("Error parsing date string: $dateString");
      return null;
    }
  }
}

utcTimeConverterLatest(var date, var format) {
  DateTime dateTime =
      DateFormat("yyyy-MM-dd hh:mm:ss").parse(date.toString(), true).toLocal();
  var df = DateFormat(format).format(dateTime);
  return df;
}

dynamic convertTo12HourFormat(String? time24) {
  if (time24 == null || time24.isEmpty) {
    return '';
  }
  try {
    DateFormat dateFormat24 = DateFormat("HH:mm:ss");
    DateTime parsedTime = dateFormat24.parse(time24);

    DateFormat dateFormat12 = DateFormat("hh:mm a");
    return dateFormat12.format(parsedTime);
  } catch (e) {
    return 'Invalid time format';
  }
}

dynamic convertTo12Hour(String? time24) {
  if (time24 == null || time24.isEmpty) {
    return '';
  }
  try {
    DateFormat dateFormat24 = DateFormat("HH:mm:ss");
    DateTime parsedTime = dateFormat24.parse(time24);

    DateFormat dateFormat12 = DateFormat("h:mm");
    return dateFormat12.format(parsedTime);
  } catch (e) {
    return 'Invalid time format';
  }
}

String formatTime(Duration duration) {
  String twoDigits(int n) => n.toString().padLeft(2, '0');
  final hours = twoDigits(duration.inHours);
  final minutes = twoDigits(duration.inMinutes.remainder(60));
  final seconds = twoDigits(duration.inSeconds.remainder(60));

  return [
    if (duration.inHours > 0) hours,
    minutes,
    seconds,
  ].join(':');
}

String timeAgo(DateTime? date) {
  if (date == null) return "";

  final now = DateTime.now();
  final difference = now.difference(date);

  if (difference.inSeconds < 60) return "Just now";
  if (difference.inMinutes < 60) return "${difference.inMinutes}m ago";
  if (difference.inHours < 24) return "${difference.inHours}h ago";
  if (difference.inDays == 1) return "Yesterday";
  if (difference.inDays < 7) return "${difference.inDays}d ago";
  if (difference.inDays < 30)
    return "${(difference.inDays / 7).floor()} week${(difference.inDays / 7).floor() > 1 ? 's' : ''} ago";

  return DateFormat('dd MMM yyyy').format(date);
}

Widget getInkWell({child, onTap}) {
  return GestureDetector(
    onTap: onTap ?? () {},
    child: child,
  );
}

Widget noDataToShow({inputText, color = Colors.black}) {
  return Center(
    child: TextView(
      textAlign: TextAlign.center,
      text: inputText ?? 'No Data Found',
      textStyle:
          textStyleBody1().copyWith(fontFamily: "Inter", fontSize: font_15),
    ),
  );
}

utcToLocalLatest(var date, var format) {
  DateTime dateTime =
      DateFormat("yyyy-MM-dd HH:mm:ss").parse(date.toString(), true).toLocal();
  var df = DateFormat(format).format(dateTime);
  return df;
}

String utcToLocalTime({required String time, format}) {
  try {
    // Assuming the UTC time is provided in "HH:mm:ss" format
    // Add a dummy date to the UTC time string to make it a valid DateTime string
    String utcDateTimeString =
        '1970-01-01T$time' + 'Z'; // Example: 1970-01-01T10:30:00Z

    // Parse the UTC time into a DateTime object
    DateTime utcDateTime = DateTime.parse(utcDateTimeString);

    // Convert the UTC time to local time
    DateTime localDateTime = utcDateTime.toLocal();

    // Format the local time to 12-hour format with AM/PM
    DateFormat timeFormat =
        format ?? DateFormat('hh:mm a'); // You can change this format if needed
    return timeFormat.format(localDateTime);
  } catch (e) {
    print("Error parsing time: $e");
    return ""; // Return an error message in case of parsing failure
  }
}

Future<bool> onWillPop() {
  debugPrint(backPressCounter.toString());
  if (backPressCounter < 1) {
    toast("Press To Exit App");
    backPressCounter++;
    Future.delayed(Duration(milliseconds: 1500), () {
      backPressCounter--;
    });
    return Future.value(false);
  } else {
    if (GetPlatform.isAndroid) {
      SystemNavigator.pop();
    }
    return Future.value(true);
  }
}

ErrorMessageResponseModel errorMessageResponseModel =
    ErrorMessageResponseModel();
// reportCrash(error, stackTrace) async {
//   PackageInfo packageInfo = await PackageInfo.fromPlatform();
//   String version = packageInfo.version;
//   var req = AuthRequestModel.logCrashErrorReq(error: error, phoneModel: DeviceDetails().deviceName.toString(), ip: DeviceDetails().deviceVersion, stackTrace: stackTrace);
//   debugPrint('Log req: $req', wrapWidth: 1000);
//   await hitReportCrash(data: req);
// }

hitReportCrash({data}) async {
  try {
    final response = DioClient().post(baseUrl, data: data);
    errorMessageResponseModel =
        ErrorMessageResponseModel.fromJson(await response);
  } catch (e, str) {
    customLoader.hide();
    Future.error(NetworkExceptions.getDioException(e, str, ""));
  }
}

String formatOrderDate(String? dateStr) {
  if (dateStr == null || dateStr.isEmpty) return "On Unknown Date";

  try {
    final dateTime = DateTime.parse(dateStr);
    final formatter =
        DateFormat("EEE, dd MMM yyyy"); // Example: Wed, 27 Jul 2022
    return "${formatter.format(dateTime)}";
  } catch (e) {
    return "On Invalid Date";
  }
}

Future<MultipartFile?> convertToMultipart(String image) async {
  debugPrint(":::::::$image");
  MultipartFile? multipartImage;
  if (image != null && image != "" && !image.contains("http")) {
    multipartImage =
        await MultipartFile.fromFile(image, filename: image.toString());
  }
  debugPrint("MultipartImage ${multipartImage.toString()}");
  return multipartImage;
}



Future<List<MultipartFile>?> convertListToMultipart(
    List<String>? imageList) async {
  List<MultipartFile> multiPartList = [];
  if (imageList!.isNotEmpty) {
    for (int i = 0; i < imageList.length; i++) {
      if (!(imageList[i].contains("http"))) {
        multiPartList.add(
          await MultipartFile.fromFile(
            imageList[i],
            filename: imageList[i].split("/").toString(),
          ),
        );
      }
    }
  }
  debugPrint("MultiPartImageList ${multiPartList.length}");
  return multiPartList;
}

bottomSheetWidget({builder, icon, Function()? onTap, bool? buttonVisible}) {
  showModalBottomSheet<void>(
      isScrollControlled: true,
      barrierColor: Colors.black54,
      enableDrag: false,
      backgroundColor: Colors.transparent,
      elevation: 0,
      context: Get.context!,
      builder: (BuildContext context) {
        return Column(
          // crossAxisAlignment: CrossAxisAlignment.end,
          mainAxisSize: MainAxisSize.min,
          children: [
            buttonVisible != null
                ? emptySizeBox()
                : InkWell(
                    onTap: onTap,
                    child: CircleAvatar(
                      backgroundColor: Colors.white,
                      child: icon,
                    ).marginOnly(right: 10, bottom: 10)),
            SizedBox(
              height: height_5,
            ),
            Container(
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(20.0),
                    topRight: Radius.circular(20.0)),
                color: Colors.white,
              ),
              child: builder,
            ),
          ],
        );
      });
}

Widget customButton(
    {text, onTap, bottomMargin, leftMargin, rightMargin, topMargin}) {
  return InkWell(
    splashColor: Colors.transparent,
    onTap: () {
      onTap();
    },
    child: Container(
      width: Get.width,
      height: height_50,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius_10),
      ),
      child: Center(
        child: TextView(
          text: text,
          textStyle: textStyleBodyMedium().copyWith(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    ).marginOnly(
        top: topMargin ?? margin_30,
        left: leftMargin ?? margin_5,
        right: rightMargin ?? margin_5,
        bottom: bottomMargin ?? margin_35),
  );
}

List<Meeting> _getDataSource() {
  final List<Meeting> meetings = <Meeting>[];
  final DateTime today = DateTime.now();
  final DateTime startTime =
      DateTime(today.year, today.month, today.day, 9, 0, 0);
  final DateTime endTime = startTime.add(const Duration(hours: 2));
  meetings.add(Meeting(
      'Conference', startTime, endTime, const Color(0xFF0F8644), false));
  return meetings;
}

class Meeting {
  Meeting(this.eventName, this.from, this.to, this.background, this.isAllDay);

  String eventName;
  DateTime from;
  DateTime to;
  Color background;
  bool isAllDay;
}

String formatDateTime(String dateTimeString) {
  DateTime dateTime = DateTime.parse(dateTimeString);
  String formattedDate = DateFormat('EEEE, MMM d, yyyy').format(dateTime);
  return formattedDate;
}

class NoLeadingSpaceInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    if (newValue.text.isNotEmpty && newValue.text[0] == ' ') {
      return oldValue;
    }
    return newValue;
  }
}

class TimeOfDayWithSeconds {
  final int hours;
  final int minutes;
  final int seconds;

  TimeOfDayWithSeconds(
      {required this.hours, required this.minutes, required this.seconds});
}

TimeOfDayWithSeconds convertToTimeOfDay(String timeString) {
  List<String> timeParts = timeString.split(":");

  int hours = int.parse(timeParts[0]);
  int minutes = int.parse(timeParts[1]);
  int seconds = timeParts.length > 2
      ? int.parse(timeParts[2])
      : 0; // Handle case where there are no seconds

  return TimeOfDayWithSeconds(hours: hours, minutes: minutes, seconds: seconds);
}

String timeToUtc({required TimeOfDay time}) {
  var now = DateTime.now();
  final localDateTime = DateTime(
    now.year,
    now.month,
    now.day,
    time.hour,
    time.minute,
  );

  var finalTime = localDateTime.toUtc();
  var hour = finalTime.hour.toString().padLeft(2, '0');
  var minute = finalTime.minute.toString().padLeft(2, '0');

  return '$hour:$minute';
}

TimeOfDay convertStringToTimeOfDay({required String timeString}) {
  // Split the string into hours and minutes
  List<String> timeParts = timeString.split(':');

  // Ensure we have both hour and minute parts
  if (timeParts.length == 2) {
    int hour = int.parse(timeParts[0]);
    int minute = int.parse(timeParts[1]);

    // Return TimeOfDay object using the parsed values
    return TimeOfDay(hour: hour, minute: minute);
  } else {
    throw FormatException('Invalid time format. Expected "HH:mm"');
  }
}

Future<PickedFile?> permissionPicker(Permission permission) async {
  await permission.request();
  PermissionStatus permissionStatus = await permission.status;
  debugPrint("$permission $permissionStatus");
  switch (permissionStatus) {
    case PermissionStatus.denied:
      await permission.request().then((value) async {
        if (value.isPermanentlyDenied) {
          openAppSettings();
        }
      });
      break;
    case PermissionStatus.granted:
      if (permission == Permission.camera) {
        return await imageFromCamera();
      } else if (permission == Permission.photos ||
          permission == Permission.storage) {
        return await imageFromGallery();
      }
      break;
    case PermissionStatus.restricted:
      await permission.request();
      break;
    case PermissionStatus.limited:
      await permission.request();
      break;
    case PermissionStatus.permanentlyDenied:
      await openAppSettings();
      break;
    default:
      openAppSettings();
      break;
  }
  return null;
}

getDeviceType() {
  if (Platform.isAndroid) {
    return TYPE_ANDROID;
  } else if (Platform.isIOS) {
    return TYPE_IOS;
  } else {
    return TYPE_OTHER;
  }
}

profileWidget({icon, title, onTap, isWidget = false, widget, verticalPadding}) {
  return InkWell(
    splashColor: Colors.transparent,
    onTap: onTap ?? () {},
    child: Row(
      children: [
        AssetImageWidget(
          imageUrl: icon ?? "",
          imageHeight: height_22,
        ),
        TextView(
          text: '$title',
          textStyle: textStyleBodyMedium().copyWith(
            fontSize: font_15,
            fontWeight: FontWeight.normal,
          ),
        ).marginOnly(left: margin_8),
        Spacer(),
        isWidget == true
            ? widget
            : Icon(
                Icons.arrow_forward_ios_sharp,
                size: font_17,
                color: Colors.grey,
              )
      ],
    ).marginSymmetric(
        horizontal: margin_15, vertical: verticalPadding ?? margin_10),
  );
}

String getSmartDateLabel(DateTime date) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  final inputDate = DateTime(date.year, date.month, date.day);

  final difference = today.difference(inputDate).inDays;

  if (difference == 0) {
    return 'Today';
  } else if (difference == 1) {
    return 'Yesterday';
  } else {
    return DateFormat('dd MMM yyyy').format(date);
  }
}

Widget headerWidget(DateTime date) {
  return Padding(
    padding: EdgeInsets.all(margin_8),
    child: Row(
      children: [
        Expanded(
            child: Divider(
          color: Colors.grey.shade300,
        )),
        Text(
          getSmartDateLabel(date),
          style: TextStyle(fontWeight: FontWeight.normal, fontSize: 16),
        ).marginSymmetric(horizontal: margin_5),
        Expanded(
            child: Divider(
          color: Colors.grey.shade300,
        )),
      ],
    ),
  );
}

bool isSameDate(DateTime a, DateTime b) {
  return a.year == b.year && a.month == b.month && a.day == b.day;
}

class CustomDottedDivider extends StatelessWidget {
  final double height;
  final double dashWidth;
  final double dashSpacing;
  final Color color;

  const CustomDottedDivider({
    Key? key,
    this.height = 1,
    this.dashWidth = 4,
    this.dashSpacing = 4,
    this.color = Colors.grey,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constraints) {
      final boxWidth = constraints.constrainWidth();
      final dashCount = (boxWidth / (dashWidth + dashSpacing)).floor();

      return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(dashCount, (_) {
          return SizedBox(
            width: dashWidth,
            height: height,
            child: DecoratedBox(
              decoration: BoxDecoration(color: Colors.grey.shade300),
            ),
          );
        }),
      );
    });
  }
}

/// Calculate Distance

Future<double> calculateDistance(
    double startLat, double startLng, double endLat, double endLng) async {
  // Geolocator.distanceBetween returns the distance in meters.
  double distanceMeters = Geolocator.distanceBetween(
    startLat,
    startLng,
    endLat,
    endLng,
  );

  // Convert meters to kilometers by dividing by 1000.
  double distanceKm = distanceMeters / 1000;

  // Return the distance rounded to two decimal places for better readability.
  return double.parse(distanceKm.toStringAsFixed(2));
}

/// Calculate Time

// Assuming an average driving speed of 60 km/h (1 km/min)
// You can adjust this value to fit your use case (e.g., walking, cycling, etc.)
const double averageSpeedKmh = 60.0;
const double minutesPerKm = 60 / averageSpeedKmh;

Future<String> calculateTravelTime(
    double startLat, double startLng, double endLat, double endLng) async {
  // First, calculate the distance in kilometers.
  double distanceInKm =
      Geolocator.distanceBetween(startLat, startLng, endLat, endLng) / 1000;

  // Calculate the time in minutes.
  double travelTimeMinutes = distanceInKm * minutesPerKm;

  // Format the time for readability.
  int hours = (travelTimeMinutes ~/ 60);
  int minutes = (travelTimeMinutes % 60).round();

  if (hours > 0) {
    return '${hours}h ${minutes}m';
  } else {
    return '${minutes}m';
  }
}

getText(status) {
  switch (status) {
    case PENDING_BOOKING:
      return 'Pending';
    case ACCEPTED_BOOKING:
      return 'Accepted';
    case ONGOING_BOOKING:
      return 'Ongoing';
    case REJECTED_BOOKING:
      return 'Rejected';
    case CANCELLED_BOOKING:
      return 'Cancelled';
    case COMPLETE_BOOKING:
      return 'Completed';
    case PICKUP_BOOKING:
      return 'Pickup Parcel';
    case DROP_BOOKING:
      return 'Drop Parcel';
    default:
      return '';
  }
}

Color getColor(status) {
  switch (status) {
    case PENDING_BOOKING:
      return Colors.amber; // Waiting
    case ACCEPTED_BOOKING:
      return Colors.teal; // Booking accepted
    case ONGOING_BOOKING:
      return Colors.blue; // In transit
    case REJECTED_BOOKING:
      return Colors.orange; // Rejected
    case CANCELLED_BOOKING:
      return Colors.red.shade800; // Cancelled
    case COMPLETE_BOOKING:
      return Colors.green.shade800; // Completed
    case PICKUP_BOOKING:
      return Colors.deepPurple; // Pickup in progress
    case DROP_BOOKING:
      return Colors.green; // Successfully dropped
    default:
      return Colors.grey; // Unknown or default
  }
}

Future<void> downloadAndOpenPdf(
    BuildContext context, String pdfUrl, String fileName) async {
  try {
    // if (Platform.isAndroid) {
    //   var status = await Permission.storage.request();
    //
    //   if (!status.isGranted) {
    //     ScaffoldMessenger.of(context).showSnackBar(
    //       SnackBar(content: Text('Storage permission denied')),
    //     );
    //     return;
    //   }
    // }

    Directory? saveDir;

    if (Platform.isAndroid) {
      saveDir = await getExternalStorageDirectory();

      // Fix path to Downloads folder
      String newPath = "";
      List<String> paths = saveDir!.path.split("/");
      for (int x = 1; x < paths.length; x++) {
        String folder = paths[x];
        if (folder == "Android") break;
        newPath += "/$folder";
      }
      newPath += "/Download";
      saveDir = Directory(newPath);
    } else if (Platform.isIOS) {
      saveDir = await getApplicationDocumentsDirectory();
    }

    final savePath = '${saveDir!.path}/$fileName';

    if (!await saveDir.exists()) {
      await saveDir.create(recursive: true);
    }

    await Dio().download(pdfUrl, savePath);

    // toast('Downloaded to $savePath');

    await OpenFile.open(savePath);
  } catch (e) {
    toast('Download failed: $e');
  }
}

Widget headerImageWidget({isIcon = false, onTap}) {
  return SizedBox(
    child: Stack(
      children: [
        Align(
          alignment: Alignment.center,
          child: AssetImageWidget(
            imageUrl: iconChooseLg,
            imageHeight: height_80,
          ),
        ).marginOnly(top: margin_30),
        isIcon == true
            ? InkWell(
                splashColor: Colors.transparent,
                onTap: onTap ??
                    () {
                      Get.back();
                    },
                child: Align(
                  alignment: Alignment.topLeft,
                  child: AssetImageWidget(
                    imageUrl: iconBack,
                    imageHeight: height_35,
                  ),
                ),
              )
            : SizedBox(),
      ],
    ),
  );
}

void launchCaller(String phoneNumber) async {
  final Uri url = Uri(scheme: 'tel', path: phoneNumber);
  if (await canLaunchUrl(url)) {
    await launchUrl(url);
  } else {
    throw 'Could not launch $url';
  }
}

Future<void> launchPhoneNumber(String phoneNumber) async {
  final Uri phoneUri = Uri(scheme: 'tel', path: phoneNumber);
  if (await canLaunchUrl(phoneUri)) {
    await launchUrl(phoneUri);
  } else {
    throw 'Could not launch $phoneUri';
  }
}

void sendSMS(String phoneNumber, {String message = ''}) async {
  final Uri uri = Uri(
    scheme: 'sms',
    path: phoneNumber,
    queryParameters: {
      'body': message,
    },
  );

  if (await canLaunch(uri.toString())) {
    await launch(uri.toString());
  } else {
    toast('Could not launch SMS');
  }
}

Future<void> launchEmail({
  required String toEmail,
  String subject = '',
  String body = '',
}) async {
  final Uri emailUri = Uri(
    scheme: 'mailto',
    path: toEmail,
    query: Uri.encodeFull('subject=$subject&body=$body'),
  );
  if (await canLaunchUrl(emailUri)) {
    await launchUrl(emailUri);
  } else {
    throw 'Could not launch $emailUri';
  }
}

String maskPhoneNumber(String phoneNumber) {
  // Remove spaces or formatting
  phoneNumber = phoneNumber.replaceAll(' ', '');

  // Ensure valid length
  if (phoneNumber.length <= 3) return phoneNumber;

  // Extract last 3 digits
  String lastDigits = phoneNumber.substring(phoneNumber.length - 3);

  // Return masked
  return '${'X' * (phoneNumber.length - 3)}$lastDigits';
}

headerText({title}) {
  return TextView(
      text: title ?? "",
      textStyle: textStyleBodyMedium().copyWith(
          fontFamily: 'inter', fontWeight: FontWeight.w600, fontSize: font_16));
}

/// Pick Image
Future<String> globalUpdateImageFile(Future<PickedFile?> imagePath) async {
  PickedFile? file = await imagePath;
  if (file != null) {
    return file.path;
  }
  return file?.path ?? "";
}

Future<void> pickFile({
  required Function(File) onFilePicked,
}) async {
  FilePickerResult? result = await FilePicker.platform.pickFiles(
    type: FileType.custom,
    allowedExtensions: [
      'jpg', 'jpeg', 'png', // images
      'pdf', // pdf
      'doc', 'docx' // word documents
    ],
  );

  if (result != null && result.files.single.path != null) {
    final file = File(result.files.single.path!);
    onFilePicked(file);
  }
}

withdrawHeadingWidget({onTap}) {
  return Container(
    padding: EdgeInsets.symmetric(horizontal: margin_13, vertical: margin_18),
    decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius_12), color: bgColor),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            AssetImageWidget(
              imageUrl: iconWallet,
              imageHeight: height_16,
            ),
            TextView(
                    text: 'Available Balance',
                    textStyle: textStyleBodyMedium().copyWith(
                        fontSize: font_14, fontWeight: FontWeight.normal))
                .marginOnly(left: margin_10),
          ],
        ),
        TextView(
                text: '1200 SAR',
                textStyle: textStyleBodyMedium()
                    .copyWith(fontWeight: FontWeight.bold, fontSize: font_18))
            .marginSymmetric(vertical: margin_7),
        TextView(
            text: 'Minimum Payout: 100 SAR',
            textStyle: textStyleBodyMedium()
                .copyWith(fontWeight: FontWeight.w400, fontSize: font_14)),
        SizedBox(
          height: height_8,
        ),
        SizedBox(
          height: height_35,
          child: MaterialButtonWidget(
            padding: 0,
            onPressed: onTap ?? () {},
            buttonText: 'Request Withdraw',
          ),
        )
      ],
    ),
  );
}

feedbackStartPercentageWidget({title, value}) {
  return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
    Row(
      children: [
        TextView(
          text: '$title   ',
          textStyle: textStyleBodyMedium().copyWith(
              fontSize: font_15,
              fontWeight: FontWeight.w400,
              color: Colors.grey),
          textAlign: TextAlign.start,
        ),
        Icon(
          Icons.star,
          color: Colors.grey,
          size: font_14,
        )
      ],
    ),
    TextView(
        text: '$value%',
        textStyle: textStyleBodyMedium()
            .copyWith(fontSize: font_15, fontWeight: FontWeight.w400)),
  ]).marginSymmetric(vertical: margin_4);
}

Widget tabButton({dynamic label, bool? isActive, onTap}) {
  return InkWell(
    splashColor: Colors.transparent,
    onTap: onTap ?? () {},
    child: Container(
      margin: EdgeInsets.symmetric(horizontal: margin_6, vertical: margin_8),
      decoration: BoxDecoration(
          color: isActive == true ? colorAppColor : Colors.transparent,
          borderRadius: BorderRadius.circular(radius_20)),
      padding: EdgeInsets.all(margin_7),
      child: TextView(text: label, textStyle: textStyleBodyMedium().copyWith())
          .marginSymmetric(vertical: margin_3),
    ),
  );
}

Widget orderList(
    {itemCount,
    isDeliveryAddress = false,
    title,
    location,
    address,
    price,
    time,
    distance,
    VoidCallback? onTapAccept,
    VoidCallback? onTapReject,
    VoidCallback? onTapViewDetail,
    required List<NewOrderData> orderList}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      SizedBox(height: height_10),
      // --- Order List ---
      ListView.separated(
        physics: const NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        itemCount: orderList.length,
        separatorBuilder: (context, index) => SizedBox(height: height_15),
        itemBuilder: (context, index) {
          return Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.black12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12.withOpacity(0.05),
                  spreadRadius: 1,
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // --- Title Row ---
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextView(
                      text: orderList[index].restaurant?.restaurantName ?? '',
                      textStyle: TextStyle(
                        fontSize: font_16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        color: green,
                        borderRadius: BorderRadius.circular(30),
                      ),
                      padding: EdgeInsets.symmetric(
                        horizontal: width_10,
                        vertical: height_4,
                      ),
                      child: TextView(
                        text: '${orderList[index].finalAmount}',
                        textStyle: TextStyle(
                          fontSize: font_14,
                          fontWeight: FontWeight.w500,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: height_6),

                // --- Address ---
                TextView(
                  text: orderList[index].restaurant?.address ?? "",
                  textAlign: TextAlign.start,
                  textStyle: TextStyle(
                    fontSize: font_14,
                    fontWeight: FontWeight.w400,
                    color: Colors.black54,
                  ),
                ),
                SizedBox(height: height_10),

                // ---- address----
                isDeliveryAddress
                    ? Container(
                        decoration: BoxDecoration(
                          color: lightFieldColor,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            AssetImageWidget(
                              imageUrl: locationIcon,
                              imageHeight: height_20,
                              color: colorAppColor,
                            ),
                            SizedBox(
                              width: width_8,
                            ),
                            Column(
                              children: [
                                TextView(
                                  text: keyDeliveryAddress.tr,
                                  textAlign: TextAlign.start,
                                  textStyle: TextStyle(
                                    fontSize: font_14,
                                    fontWeight: FontWeight.w400,
                                    color: Colors.black38,
                                  ),
                                ),
                                SizedBox(
                                  height: height_5,
                                ),
                                TextView(
                                  text: address,
                                  textAlign: TextAlign.start,
                                  textStyle: TextStyle(
                                    fontSize: font_14,
                                    fontWeight: FontWeight.w400,
                                    color: Colors.black,
                                  ),
                                ),
                                SizedBox(
                                  height: height_20,
                                )
                              ],
                            )
                          ],
                        ).paddingAll(10),
                      )
                    : Container(),

                // --- Info Row ---
                Row(
                  children: [
                    rowCustom(icon: Icons.watch_later_outlined, text: time),
                    SizedBox(width: width_15),
                    rowCustom(isImage: true, image: ic_share, text: distance),
                  ],
                ),
                SizedBox(height: height_20),

                // --- Action Buttons ---
                Row(
                  children: [
                    // Accept Button
                    Expanded(
                      flex: 3,
                      child: ElevatedButton.icon(
                        onPressed: onTapAccept,
                        icon: Icon(Icons.check,
                            color: Colors.black, size: height_18),
                        label: Text(
                          keyAccept.tr,
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: font_13,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: colorAppColor,
                          minimumSize: const Size(double.infinity, 40),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(50),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: width_12),

                    // Reject Button
                    Expanded(
                      flex: 2,
                      child: ElevatedButton.icon(
                        onPressed: onTapReject,
                        icon: Icon(Icons.close,
                            color: Colors.black, size: height_18),
                        label: Text(
                          keyReject.tr,
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: font_13,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 40),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(50),
                          ),
                          side: const BorderSide(color: Colors.black12),
                        ),
                      ),
                    ),
                  ],
                ),
                if (isDeliveryAddress)
                  SizedBox(
                    height: height_20,
                  ),
                isDeliveryAddress
                    ? GestureDetector(
                        onTap: onTapViewDetail,
                        child: Row(
                          children: [
                            Text(
                              keyViewDetails.tr,
                              style: TextStyle(
                                color: darkGreenColor,
                                fontSize: font_14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            SizedBox(
                              width: width_8,
                            ),
                            Icon(
                              Icons.arrow_right_alt,
                              color: darkGreenColor,
                            )
                          ],
                        ),
                      )
                    : Container(),
                if (isDeliveryAddress)
                  SizedBox(
                    height: height_10,
                  ),
              ],
            ),
          );
        },
      ),
    ],
  );
}

rowCustom({text, icon, isImage = false, image}) {
  return Row(
    children: [
      isImage
          ? AssetImageWidget(
              imageUrl: image,
              imageHeight: height_14,
            )
          : Icon(icon, size: 20, color: Colors.black38),
      SizedBox(
        width: width_5,
      ),
      TextView(
          textAlign: TextAlign.start,
          text: text,
          textStyle: TextStyle(
              fontSize: font_14,
              fontWeight: FontWeight.w400,
              color: Colors.black38)),
    ],
  );
}

rowTextCustom({text, subtext, subTextColor}) {
  return Row(
    mainAxisAlignment: MainAxisAlignment.spaceBetween,
    children: [
      TextView(
          textAlign: TextAlign.start,
          text: text,
          textStyle: TextStyle(
              fontSize: font_14,
              fontWeight: FontWeight.w500,
              color: Colors.black)),
      TextView(
          textAlign: TextAlign.start,
          text: subtext,
          textStyle: TextStyle(
              fontSize: font_14,
              fontWeight: FontWeight.w600,
              color: subTextColor)),
    ],
  ).paddingAll(15);
}

columnWidget({title, subTitle}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      TextView(
          text: title,
          textStyle: TextStyle(
              fontSize: font_14,
              fontWeight: FontWeight.w600,
              color: Colors.black)),
      TextView(
          text: subTitle,
          maxLine: 1,
          textAlign: TextAlign.start,
          textStyle: TextStyle(
              fontSize: font_12,
              fontWeight: FontWeight.w400,
              color: Colors.black38)),
    ],
  );
}

String getOrderStatus(int status) {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Accepted";
    case 3:
      return "Ready for Pickup";
    case 4:
      return "Out for Delivery";
    case 5:
      return "Delivered";
    case 6:
      return "Cancelled";
    case 7:
      return "Rejected";
    case 8:
      return "Accepted by Driver";
    case 9:
      return "Reached Restaurant";
    case 10:
      return "At Door Step";
    default:
      return "Unknown Status";
  }
}

Future<bool> _handleLocationPermission() async {
  bool serviceEnabled;
  LocationPermission permission;

  serviceEnabled = await Geolocator.isLocationServiceEnabled();
  if (!serviceEnabled) {
    toast('Location services are disabled. Please enable the services');
    return false;
  }
  permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      toast('Location permissions are denied');
      return false;
    }
  }
  if (permission == LocationPermission.deniedForever) {
    Get.dialog(Dialog(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextView(
              text:
                  "Location permission denied forever, Please enable permission from settings",
              textStyle: textStyleBodyMedium().copyWith(color: Colors.black)),
          Row(
            children: [
              Expanded(
                child: MaterialButtonWidget(
                  padding: 10.0,
                  buttonRadius: radius_10,
                  onPressed: () {
                    SystemNavigator.pop();
                  },
                  buttonText: 'Cancel',
                ),
              ),
              SizedBox(
                width: width_10,
              ),
              Expanded(
                child: MaterialButtonWidget(
                  padding: 10.0,
                  buttonRadius: radius_10,
                  onPressed: () {
                    openAppSettings();
                  },
                  buttonText: 'Go to Settings',
                ),
              ),
            ],
          ).marginOnly(top: margin_10),
        ],
      ).marginAll(margin_15),
    ));
    toast(
        'Location permissions are permanently denied, we cannot request permissions.');
    return false;
  }
  return true;
}

Future<void> getCurrentPosition() async {
  final hasPermission = await _handleLocationPermission();
  if (!hasPermission) return;
  if (Get.isDialogOpen == true) {
    Get.back(result: true);
  }
  await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high)
      .then((Position position) {
    currentPosition.value = position;
    getAddressFromLatLng(position);
  }).catchError((e) {
    debugPrint(e);
  });
}

Future<void> getAddressFromLatLng(Position position) async {
  if (currentPosition.value != null)
    await placemarkFromCoordinates(
            currentPosition.value!.latitude, currentPosition.value!.longitude)
        .then((List<Placemark> placemarks) {
      Placemark place = placemarks[0];
      currentAddress.value =
          '${place.street}, ${place.subLocality},${place.subAdministrativeArea}, ${place.postalCode}';
    }).catchError((e) {
      debugPrint(e);
    });
}
