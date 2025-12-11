import 'dart:isolate';
import 'package:http/http.dart' as http;
import '../../../../export.dart';
import '../../../../main.dart';
import '../../../core/values/app_global_values.dart';
import '../../../data/remote_service/network/dio_client.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:permission_handler/permission_handler.dart';

import '../../../../export.dart';
import '../../../data/remote_service/network/network_exceptions.dart';
import '../model/load_chat_response_model.dart';
import '../model/send_message_response_model.dart';

class ChatScreenController extends TbaseController {
  final TextEditingController textController = TextEditingController();
  Timer? timer;
  Timer? chatTimer;
  TextEditingController sendController = TextEditingController();
  FocusNode sendFocusNode = FocusNode();
  ScrollController scrollController = ScrollController();
  SendMessageResponseModel sendMessageResponseModel =
      SendMessageResponseModel();
  RxList<LoadChatDataModel> chatList = <LoadChatDataModel>[
    LoadChatDataModel(
      id: '1',
      message: 'Hello',
      createdOn: DateTime.now(),
    ),
    LoadChatDataModel(
      id: '1',
      message: 'Hello',
      receiver: '4935f644-ec54-46f6-8cd2-718f797aa379',
      createdOn: DateTime.now(),
    ),
  ].obs;
  RxString profileImage = "".obs;
  String docMessage = "";
  RxBool isPushNotification = false.obs;
  bool isSupport = false;

  void scroll() {
    scrollController.animateTo(0.0,
        duration: Duration(milliseconds: 400), curve: Curves.easeIn);
  }

  late Isolate? isolate;

  @override
  void onReady() async {
    // ontToOnePagination();
    // runTimer();
    // runChatListTimer();
  }

  @override
  void onInit() {
    getArgs();
    super.onInit();
  }

  @override
  void onClose() {
    timer?.cancel();
    chatTimer?.cancel();
    super.onClose();
  }

  getArgs() {
    if (Get.arguments != null) {
      receiverName = Get.arguments['receiverName'] ?? '';
      if(receiverName=='support'){
        isSupport=true;
      }
      driverId = Get.arguments['driver_id'];
      fullName = Get.arguments['full_name'];
      profileFile = Get.arguments['profile_file'];
      mobileNo = Get.arguments['mobile_no'];
      isPushNotification.value = Get.arguments['isPushNotification'] ?? false;

      receiverId = Get.arguments['receiverId'] ?? '';
      if (driverId != null) getMessagesFromIsolate(driverId);
    }
    loadChatList();
  }

  void runTimer() {
    if (timer == null) {
      timer = Timer.periodic(
        Duration(seconds: 1),
        (timer) => getMessagesFromIsolate(driverId),
      );
    }
  }

  void runChatListTimer() {
    if (chatTimer == null) {
      chatTimer = Timer.periodic(
        Duration(seconds: 3),
        (timer) => loadChatList(),
      );
    }
  }

  var toId, toUser, driverId, fullName, profileFile, mobileNo;
  var receiverName, receiverId;

  hitSendMessageApiCall({toIdMessage}) async {
    try {
      var reqBody = {
        "message": sendController.text.trim(),
        "receiver_id": receiverId,
      };

      // debugPrint('reqBody====>${reqBody}');

      final response = DioClient().post(
        "/chat/send-message/",
        data: FormData.fromMap(reqBody),
        skipAuth: false,
      );
      sendMessageResponseModel =
          SendMessageResponseModel.fromJson(await response);
      chatList.insert(0, sendMessageResponseModel.messages!);
      sendController.clear();
      scroll();
    } catch (e, str) {
      print("====eeee====$e\n$str");
      customLoader.hide();
      Future.error(
          NetworkExceptions.getDioException(e, str, "/chat/send-message/"));
      showInSnackBar(message: NetworkExceptions.messageData);
    }
  }

  Rx<LoadChatResponseModel> loadChatResponseModel = LoadChatResponseModel().obs;

  ontToOnePagination() {
    scrollController.addListener(() {
      print("ssss" + (perPage.value).toString());
      if (scrollController.position.pixels ==
          scrollController.position.maxScrollExtent) {
        print(
            'loadChatResponseModel-------${loadChatResponseModel.value.meta?.perPage}');
        if (perPage.value <
            (loadChatResponseModel.value.meta!.pageCount! + 1)) {
          print('perPage-------');
          perPage.value++;
          print('perPage--value-----${perPage.value}');
          loadChatList();
        }
      } else {
        update();
      }
    });
  }

  RxInt perPage = 0.obs;
  var user = "";

  loadChatList() async {
    try {
      var request = {'receiver_id': driverId};
      final response = DioClient().post(
        "api//chat/load-chat",
        data: FormData.fromMap(request),
        queryParameters: {
          // 'page': perPage.value,
          'access-token': preferenceManger.getAuthToken(),
        },
        skipAuth: false,
      );
      loadChatResponseModel.value =
          LoadChatResponseModel.fromJson(await response);

      if (perPage.value == 0) {
        chatList.clear();
        chatList.value = loadChatResponseModel.value.data ?? [];
      } else {
        chatList.addAll(loadChatResponseModel.value.data ?? []);
      }
      chatList.value = chatList.reversed.toList();
      chatList.refresh();
      print('chatList>>> ${chatList.length}');
      customLoader.hide();
    } catch (e, str) {
      customLoader.hide();
      Future.error(NetworkExceptions.getDioException(e, str, "chat/old-chat"));
      showInSnackBar(message: NetworkExceptions.messageData);
    }
  }

  Future<void> getMessagesFromIsolate(String receiverId) async {
    // 1. Create ReceivePort to get messages from isolate
    final receivePort = ReceivePort();

    // 2. Fetch auth token, user agent, lang in main isolate BEFORE spawning isolate
    final token = await PreferenceManger().getAuthToken();
    final userAgent = await getUserAgent();

    // 3. Spawn isolate and pass IsolateMessage with all required data
    await Isolate.spawn(
      fetchMessagesInIsolate,
      IsolateMessage(receivePort.sendPort, receiverId, token, userAgent),
    );

    // 4. Listen for data coming back from isolate
    receivePort.listen((message) {
      if (message is Map && message.containsKey('error')) {
        print('Error from isolate: ${message['error']}');
        receivePort.close();
      } else {
        try {
          final loadChatResponseModel = LoadChatResponseModel.fromJson(message);

          if (loadChatResponseModel.data != null &&
              loadChatResponseModel.data!.isNotEmpty) {
            // Insert new messages at the beginning (index 0)
            chatList.insertAll(0, loadChatResponseModel.data!);
            scroll();
          }
        } catch (e) {
          print("Parsing error in isolate response: $e");
        }
        receivePort.close();
      }
    });
  }

  Future<void> openFilePicker() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.image, // This restricts the picker to image files
    );

    if (result != null && result.files.single.path != null) {
      File imageFile = File(result.files.single.path!);
      String imagePath = imageFile.path;

      debugPrint("Selected image path: $imagePath");

      // Send the image to the server
      await sendImageToServer(imageFile);
    } else {
      bottomToast("No image selected");
    }
  }

  Future<void> sendImageToServer(File imageFile) async {
    try {
      // Create a FormData object for multipart request
      FormData formData = FormData.fromMap({
        "Chat[to_id]": toId ?? "",
        "Chat[type_id]": 1,
        "Chat[message]": await MultipartFile.fromFile(
          imageFile.path,
          filename: imageFile.uri.pathSegments.last, // Use the image filename
        ),
      });

      final response = await DioClient().post(
        "api/chat/send-message",
        data: formData,
        skipAuth: false,
      );

      sendMessageResponseModel =
          SendMessageResponseModel.fromJson(await response);
      chatList.insert(0, sendMessageResponseModel.messages!);
      sendController.clear();
      docMessage = "";
      profileImage.value = "";
      profileImage.refresh();
      scroll();
    } catch (e, str) {
      Future.error(
          NetworkExceptions.getDioException(e, str, "api/chat/send-message"));
      bottomToast(NetworkExceptions.messageData);
      debugPrint("Error uploading image: $e");
    }
  }

  Future<MultipartFile?> convertToMultipart(String image) async {
    debugPrint(":::::::$image");
    MultipartFile? profileMultipartImage;
    if (image != "" && !image.contains("http")) {
      profileMultipartImage =
          await MultipartFile.fromFile(image, filename: image);
    }
    debugPrint("profileMultipartImage ${profileMultipartImage.toString()}");
    return profileMultipartImage;
  }

  Future<String?> downloadAndShow({String? url}) async {
    await Permission.storage.request();
    File file;
    String filePath = '';
    String myUrl = '';

    String dir = "/storage/emulated/0/Download";
    String fileName = "$dir/fitness-${url!.split("=").last}";
    if (await File('$fileName').exists()) {
    } else {
      try {
        customLoader.show(Get.overlayContext);
        myUrl = url;
        var response = await http.get(Uri.parse(myUrl));
        if (response.statusCode == 200) {
          var bytes = response.bodyBytes;
          filePath = '$fileName';
          file = File(filePath);
          await file.writeAsBytes(bytes);
          customLoader.hide();

          Future.delayed(Duration(seconds: 1)).then((value) {
            //openFile(path: filePath);
          });
        } else {
          customLoader.hide();
          launchUrl(Uri.parse(url));
          filePath = 'Error code: ' + response.statusCode.toString();
        }
      } catch (ex) {
        customLoader.hide();
        launchUrl(Uri.parse(url));
        filePath = 'Can not fetch url';
      }
      return filePath;
    }
    return null;
  }
}

// Isolate message to pass parameters safely
class IsolateMessage {
  final SendPort sendPort;
  final String receiverId;
  final String authToken;
  final String userAgent;

  IsolateMessage(
      this.sendPort, this.receiverId, this.authToken, this.userAgent);
}

// The function that runs inside the isolate
Future<void> fetchMessagesInIsolate(IsolateMessage message) async {
  try {
    final dio = Dio();
    var request = {'receiver_id': message.receiverId ?? ""};
    final response = await dio.post(
      "${baseUrl}chat/load-messages-api/",
      data: FormData.fromMap(request),
      options: Options(headers: {
        "Authorization": "Token ${message.authToken}",
        "User-Agent": message.userAgent,
      }),
    );
    message.sendPort.send(response.data);
  } catch (e, st) {
    message.sendPort.send({'error': e.toString()});
  }
}
