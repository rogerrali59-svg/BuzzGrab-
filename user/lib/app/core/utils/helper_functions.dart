



import '../../../export.dart';

Future<MultipartFile?> convertToMultipart(String image) async {
  debugPrint(":::::::$image");
  MultipartFile? multipartImage;
  if (image != null && image != "" && !image.contains("http")) {
    multipartImage = await MultipartFile.fromFile(image,
        filename: image.split("/").toString());
  }
  return multipartImage;
}