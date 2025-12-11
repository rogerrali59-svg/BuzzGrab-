library google_places_flutter;

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';

import 'package:rxdart/rxdart.dart';
import 'package:http/http.dart'as http;
import 'package:buzzgrab/export.dart';

import '../../../main.dart';

class GooglePlaceAutoCompleteTextFieldd extends StatefulWidget {
  InputDecoration inputDecoration;
  ItemClick? itemClick;
  GetPlaceDetailswWithLatLng? getPlaceDetailWithLatLng;
  bool isLatLngRequired = true;

  TextStyle textStyle;
  String googleAPIKey;
  int debounceTime = 600;
  List<String>? countries = [];
  TextEditingController textEditingController = TextEditingController();
  ListItemBuilder? itemBuilder;
  Widget? seperatedBuilder;
  void clearData;
  BoxDecoration? boxDecoration;
  bool isCrossBtnShown;
  bool showError;
  double? containerHorizontalPadding;
  double? containerVerticalPadding;
  FocusNode? focusNode;
  final validate;
  PlaceType? placeType;
  String? language;

  GooglePlaceAutoCompleteTextFieldd(
      {required this.textEditingController,
        required this.googleAPIKey,
        this.debounceTime = 600,
        this.inputDecoration = const InputDecoration(),
        this.itemClick,
        this.isLatLngRequired = true,
        this.textStyle = const TextStyle(),
        this.countries,
        this.getPlaceDetailWithLatLng,
        this.itemBuilder,
        this.boxDecoration,
        this.validate,
        this.isCrossBtnShown = true,
        this.seperatedBuilder,
        this.showError = true,
        this.containerHorizontalPadding,
        this.containerVerticalPadding,
        this.focusNode,
        this.placeType,
        this.language = 'en'});

  @override
  _GooglePlaceAutoCompleteTextFielddState createState() => _GooglePlaceAutoCompleteTextFielddState();
}

class _GooglePlaceAutoCompleteTextFielddState extends State<GooglePlaceAutoCompleteTextFieldd> {
  final subject = new PublishSubject<String>();
  OverlayEntry? _overlayEntry;
  List<Prediction> alPredictions = [];

  TextEditingController controller = TextEditingController();
  final LayerLink _layerLink = LayerLink();
  bool isSearched = false;

  bool isCrossBtn = true;
  late var _dio;

  CancelToken? _cancelToken = CancelToken();

  @override
  Widget build(BuildContext context) {
    return CompositedTransformTarget(
      link: _layerLink,
      child: Container(
        margin: EdgeInsets.zero,
        alignment: Alignment.centerLeft,
        decoration: widget.boxDecoration ?? BoxDecoration(shape: BoxShape.rectangle, border: Border.all(color: Colors.grey, width: 0.6), borderRadius: BorderRadius.all(Radius.circular(10))),
        child: Row(
          mainAxisSize: MainAxisSize.max,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: TextFormField(

                validator: widget.validate,
                decoration: widget.inputDecoration,
                style: widget.textStyle,
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp("[0-9a-zA-Z /]")),
                ],
                autovalidateMode: AutovalidateMode.onUserInteraction,
                controller: widget.textEditingController,
                focusNode: widget.focusNode ?? FocusNode(),
                onChanged: (string) {
                  //print("Address string ${string}");
                  subject.add(string);
                  if (widget.isCrossBtnShown) {
                    isCrossBtn = string.isNotEmpty ? true : false;
                    setState(() {});
                  }
                },
              ),
            ),
            (!widget.isCrossBtnShown)
                ? SizedBox()
                : isCrossBtn && _showCrossIconWidget()
                ? IconButton(onPressed: clearData, icon: Icon(Icons.close))
                : SizedBox()
          ],
        ),
      ),
    );
  }
  Future getAddressFromLatLong(currentLat, currentLong) async {
    List placemarks = await placemarkFromCoordinates(double.parse(currentLat), double.parse(currentLong));
    Placemark place = placemarks[0];

    customLoader.hide();
  }
  getLocation(String text) async {
    String apiURL = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=$text&key=${widget.googleAPIKey}&language=${widget.language}";

    if (widget.countries != null) {
      // in

      for (int i = 0; i < widget.countries!.length; i++) {
        String country = widget.countries![i];

        if (i == 0) {
          apiURL = apiURL + "&components=country:$country";
        } else {
          apiURL = apiURL + "|" + "country:" + country;
        }
      }
    }
    if (widget.placeType != null) {
      apiURL += "&types=${widget.placeType?.apiString}";
    }

    if (_cancelToken?.isCancelled == false) {
      _cancelToken?.cancel();
      _cancelToken = CancelToken();
    }

    print("urlll $apiURL");
    try {
      String proxyURL = "https://cors-anywhere.herokuapp.com/";
      String url = kIsWeb ? proxyURL + apiURL : apiURL;

      /// Add the custom header to the options
      final options = kIsWeb ? Options(headers: {"x-requested-with": "XMLHttpRequest"}) : null;
      Response response = await _dio.get(url);
      ScaffoldMessenger.of(context).hideCurrentSnackBar();

      Map map = response.data;
      print("resonse map ${map}");

      if (map.containsKey("error_message")) {
        throw response.data;
      }

      PlacesAutocompleteResponse subscriptionResponse = PlacesAutocompleteResponse.fromJson(response.data);

      if (text.length == 0) {
        alPredictions.clear();
        this._overlayEntry!.remove();
        return;
      }

      isSearched = false;
      alPredictions.clear();
      if (subscriptionResponse.predictions!.length > 0 && (widget.textEditingController.text.toString().trim()).isNotEmpty) {
        alPredictions.addAll(subscriptionResponse.predictions!);
      }

      this._overlayEntry = null;
      this._overlayEntry = this._createOverlayEntry();
      Overlay.of(context)!.insert(this._overlayEntry!);
    } catch (e) {
      var errorHandler = ErrorHandler.internal().handleError(e);
      if (text.length != 0) {
        _showSnackBar("${errorHandler.message}");
      }
      if (text.length == 0) {
        alPredictions.clear();
      }
    }
  }


  @override
  void initState() {
    super.initState();
    _dio = Dio();
    subject.stream.distinct().debounceTime(Duration(milliseconds: widget.debounceTime)).listen(textChanged);
  }

  textChanged(String text) async {
    getLocation(text);
  }

  OverlayEntry? _createOverlayEntry() {
    if (context != null && context.findRenderObject() != null) {
      RenderBox renderBox = context.findRenderObject() as RenderBox;
      var size = renderBox.size;
      var offset = renderBox.localToGlobal(Offset.zero);
      return OverlayEntry(
          builder: (context) => Positioned(
            left: offset.dx,
            top: size.height + offset.dy,
            width: size.width,
            child: CompositedTransformFollower(
              showWhenUnlinked: false,
              link: this._layerLink,
              offset: Offset(0.0, size.height + 5.0),
              child: Material(
                  child: ListView.separated(
                    padding: EdgeInsets.zero,
                    shrinkWrap: true,
                    itemCount: alPredictions.length,
                    separatorBuilder: (context, pos) => widget.seperatedBuilder ?? SizedBox(),
                    itemBuilder: (BuildContext context, int index) {
                      return InkWell(
                        onTap: () {
                          var selectedData = alPredictions[index];
                          if (index < alPredictions.length) {
                            widget.itemClick!(selectedData);

                            if (widget.isLatLngRequired) {
                              getPlaceDetailsFromPlaceId(selectedData);
                            }
                            removeOverlay();
                          }
                        },
                        child: widget.itemBuilder != null ? widget.itemBuilder!(context, index, alPredictions[index]) : Container(padding: EdgeInsets.all(10), child: Text(alPredictions[index].description!)),
                      );
                    },
                  )),
            ),
          ));
    }
  }

  removeOverlay() {
    alPredictions.clear();
    this._overlayEntry = this._createOverlayEntry();
    if (context != null) {
      Overlay.of(context).insert(this._overlayEntry!);
      this._overlayEntry!.markNeedsBuild();
    }
  }

  Future<Response?> getPlaceDetailsFromPlaceId(Prediction prediction) async {
    //String key = GlobalConfiguration().getString('google_maps_key');

    var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=${prediction.placeId}&key=${widget.googleAPIKey}";
    try {
      Response response = await _dio.get(
        url,
      );

      PlaceDetails placeDetails = PlaceDetails.fromJson(response.data);

      prediction.lat = placeDetails.result!.geometry!.location!.lat.toString();
      prediction.lng = placeDetails.result!.geometry!.location!.lng.toString();

      widget.getPlaceDetailWithLatLng!(prediction);
    } catch (e) {
      var errorHandler = ErrorHandler.internal().handleError(e);
      _showSnackBar("${errorHandler.message}");
    }
  }

  void clearData() {
    widget.textEditingController.clear();
    if (_cancelToken?.isCancelled == false) {
      _cancelToken?.cancel();
    }

    setState(() {
      alPredictions.clear();
      isCrossBtn = false;
    });

    if (this._overlayEntry != null) {
      try {
        this._overlayEntry?.remove();
      } catch (e) {}
    }
  }

  _showCrossIconWidget() {
    return (widget.textEditingController.text.isNotEmpty);
  }

  _showSnackBar(String errorData) {
    if (widget.showError) {
      final snackBar = SnackBar(
        content: Text("$errorData"),
      );

      // Find the ScaffoldMessenger in the widget tree
      // and use it to show a SnackBar.
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }
}

PlacesAutocompleteResponse parseResponse(Map responseBody) {
  return PlacesAutocompleteResponse.fromJson(responseBody as Map<String, dynamic>);
}

PlaceDetails parsePlaceDetailMap(Map responseBody) {
  return PlaceDetails.fromJson(responseBody as Map<String, dynamic>);
}

typedef ItemClick = void Function(Prediction postalCodeResponse);
typedef GetPlaceDetailswWithLatLng = void Function(Prediction postalCodeResponse);

typedef ListItemBuilder = Widget Function(BuildContext context, int index, Prediction prediction);

class DioErrorHandler {
  ErrorResponse errorResponse = ErrorResponse();
  String errorDescription = "";

  ErrorResponse handleDioError(DioException dioError) {
    switch (dioError.type) {
      case DioExceptionType.cancel:
        errorResponse.message = "Request to API server was cancelled".tr;
        break;
      case DioExceptionType.connectionTimeout:
        errorResponse.message = "Connection timeout with API server".tr;
        break;
      case DioExceptionType.unknown:
        if ((dioError.message?.contains("RedirectException") ?? false)) {
          errorResponse.message = "${dioError.message}";
        } else {
          errorResponse.message ="Please check the internet connection".tr;
        }
        break;
      case DioExceptionType.receiveTimeout:
        errorResponse.message = "Receive timeout in connection with API server".tr;
        break;
      case DioExceptionType.badResponse:
        try {
          if (dioError.response?.data['message'] != null) {
            errorResponse.message = dioError.response?.data['message'];
          } else {
            if ((dioError.response?.statusMessage ?? "").isNotEmpty)
              errorResponse.message = dioError.response?.statusMessage;
            else
              return _handleError(dioError.response!.statusCode, dioError.response!.data);
          }
        } catch (e) {
          if ((dioError.response?.statusMessage ?? "").isNotEmpty)
            errorResponse.message = dioError.response?.statusMessage;
          else
            return _handleError(dioError.response!.statusCode, dioError.response!.data);
        }

        break;
      case DioExceptionType.sendTimeout:
        errorResponse.message = "Send timeout in connection with API server".tr;
        break;
      default:
        errorResponse.message = "Something went wrong".tr;
        break;
    }
    return errorResponse;
  }

  ErrorResponse _handleError(int? statusCode, dynamic error) {
    switch (statusCode) {
      case 400:
        return getMas(error);
    // case 401:
    //   return checkTokenExpire(error);
      case 404:
        return getMas(error);
      case 403:
        return getMas(error);
      case 500:
        errorResponse.message = "Internal Server Error".tr;
        return errorResponse;
      default:
        return getUnKnownMes(error);
    }
  }

  // checkTokenExpire(error) {
  //   // print("my error ${error}");
  //   if (error['msg'].toString().toLowerCase() ==
  //       "Token has expired".toLowerCase()) {
  //     UIData.tokenExpire(error['msg']);
  //     return;
  //   }
  //   errorResponse.message = error['msg'].toString();
  //   return errorResponse;
  // }

  getMas(dynamic error) {
    print("myError ${error.runtimeType}");
    if (error.runtimeType != String) {
      errorResponse.message = error['message'].toString(); //?? S.of(Get.context).something_wrong;
    } else {
      if (error['msg'] != null) {
        errorResponse.message = error['msg'].toString();
      } else {
        errorResponse.message = "Something went wrong".tr;
      } //S.of(Get.context).something_wrong;
    }
    return errorResponse;
  }

  getUnKnownMes(dynamic error) {
    if (error['msg'] != null) {
      errorResponse.message = error['msg'].toString();
    } else if (error['message'] != null) {
      errorResponse.message = error['message'].toString();
    } else {
      errorResponse.message = "Something went wrong".tr;
    }
    return errorResponse;
  }
}

class ErrorHandler {
  static final ErrorHandler _inst = ErrorHandler.internal();
  ErrorHandler.internal();

  factory ErrorHandler() {
    return _inst;
  }
  ErrorResponse errorResponse = ErrorResponse();

  ErrorResponse handleError(var error) {
    if (error.runtimeType.toString().toLowerCase() == "_TypeError".toLowerCase()) {
      // return error.toString();
      errorResponse.message = "The Provided API key is invalid".tr;
      return errorResponse;
    } else if (error is DioException) {
      return DioErrorHandler().handleDioError(error);
    }
    errorResponse.message = "The Provided API key is invalid".tr;
    return errorResponse;
  }
}

class PlaceType {
  final String apiString;
  const PlaceType(this.apiString);

  static const geocode = PlaceType("geocode");
  static const address = PlaceType("address");
  static const establishment = PlaceType("establishment");
  static const region = PlaceType("(region)");
  static const cities = PlaceType("(cities)");
}

class PlacesAutocompleteResponse {
  List<Prediction>? predictions;
  String? status;

  PlacesAutocompleteResponse({this.predictions, this.status});

  PlacesAutocompleteResponse.fromJson(Map<String, dynamic> json) {
    if (json['predictions'] != null) {
      predictions = [];
      json['predictions'].forEach((v) {
        predictions!.add(new Prediction.fromJson(v));
      });
    }
    status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.predictions != null) {
      data['predictions'] = this.predictions!.map((v) => v.toJson()).toList();
    }
    data['status'] = this.status;
    return data;
  }
}

class Prediction {
  String? description;
  String? id;
  List<MatchedSubstrings>? matchedSubstrings;
  String? placeId;
  String? reference;
  StructuredFormatting? structuredFormatting;
  List<Terms>? terms;
  List<String>? types;
  String? lat;
  String? lng;

  Prediction(
      {this.description,
        this.id,
        this.matchedSubstrings,
        this.placeId,
        this.reference,
        this.structuredFormatting,
        this.terms,
        this.types,
        this.lat,
        this.lng});

  Prediction.fromJson(Map<String, dynamic> json) {
    description = json['description'];
    id = json['id'];
    if (json['matched_substrings'] != null) {
      matchedSubstrings = [];
      json['matched_substrings'].forEach((v) {
        matchedSubstrings!.add(new MatchedSubstrings.fromJson(v));
      });
    }
    placeId = json['place_id'];
    reference = json['reference'];
    structuredFormatting = json['structured_formatting'] != null
        ? new StructuredFormatting.fromJson(json['structured_formatting'])
        : null;
    if (json['terms'] != null) {
      terms =[];
      json['terms'].forEach((v) {
        terms!.add(new Terms.fromJson(v));
      });
    }
    types = json['types'].cast<String>();
    lat = json['lat'];
    lng = json['lng'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['description'] = this.description;
    data['id'] = this.id;
    if (this.matchedSubstrings != null) {
      data['matched_substrings'] =
          this.matchedSubstrings!.map((v) => v.toJson()).toList();
    }
    data['place_id'] = this.placeId;
    data['reference'] = this.reference;
    if (this.structuredFormatting != null) {
      data['structured_formatting'] = this.structuredFormatting!.toJson();
    }
    if (this.terms != null) {
      data['terms'] = this.terms!.map((v) => v.toJson()).toList();
    }
    data['types'] = this.types;
    data['lat'] = this.lat;
    data['lng'] = this.lng;

    return data;
  }
}

class MatchedSubstrings {
  int? length;
  int? offset;

  MatchedSubstrings({this.length, this.offset});

  MatchedSubstrings.fromJson(Map<String, dynamic> json) {
    length = json['length'];
    offset = json['offset'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['length'] = this.length;
    data['offset'] = this.offset;
    return data;
  }
}

class StructuredFormatting {
  String? mainText;

  String? secondaryText;

  StructuredFormatting({this.mainText, this.secondaryText});

  StructuredFormatting.fromJson(Map<String, dynamic> json) {
    mainText = json['main_text'];

    secondaryText = json['secondary_text'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['main_text'] = this.mainText;
    data['secondary_text'] = this.secondaryText;
    return data;
  }
}

class Terms {
  int? offset;
  String? value;

  Terms({this.offset, this.value});

  Terms.fromJson(Map<String, dynamic> json) {
    offset = json['offset'];
    value = json['value'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['offset'] = this.offset;
    data['value'] = this.value;
    return data;
  }
}

class PlaceDetails {
  Result? result;
  String? status;

  PlaceDetails({this.result, this.status});

  PlaceDetails.fromJson(Map<String, dynamic> json) {
    result =
    json['result'] != null ? new Result.fromJson(json['result']) : null;
    status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();

    if (this.result != null) {
      data['result'] = this.result!.toJson();
    }
    data['status'] = this.status;
    return data;
  }
}

class Result {
  List<AddressComponents>? addressComponents;
  String? adrAddress;
  String? formattedAddress;
  Geometry? geometry;
  String? icon;
  String? name;
  List<Photos>? photos;
  String? placeId;
  String? reference;
  String? scope;
  List<String>? types;
  String? url;
  int? utcOffset;
  String? vicinity;
  String? website;

  Result(
      {this.addressComponents,
        this.adrAddress,
        this.formattedAddress,
        this.geometry,
        this.icon,
        this.name,
        this.photos,
        this.placeId,
        this.reference,
        this.scope,
        this.types,
        this.url,
        this.utcOffset,
        this.vicinity,
        this.website});

  Result.fromJson(Map<String, dynamic> json) {
    if (json['address_components'] != null) {
      addressComponents = [];
      json['address_components'].forEach((v) {
        addressComponents!.add(new AddressComponents.fromJson(v));
      });
    }
    adrAddress = json['adr_address'];
    formattedAddress = json['formatted_address'];
    geometry = json['geometry'] != null
        ? new Geometry.fromJson(json['geometry'])
        : null;
    icon = json['icon'];
    name = json['name'];
    if (json['photos'] != null) {
      photos = [];
      json['photos'].forEach((v) {
        photos!.add(new Photos.fromJson(v));
      });
    }
    placeId = json['place_id'];
    reference = json['reference'];
    scope = json['scope'];
    types = json['types'].cast<String>();
    url = json['url'];
    utcOffset = json['utc_offset'];
    vicinity = json['vicinity'];
    website = json['website'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.addressComponents != null) {
      data['address_components'] =
          this.addressComponents!.map((v) => v.toJson()).toList();
    }
    data['adr_address'] = this.adrAddress;
    data['formatted_address'] = this.formattedAddress;
    if (this.geometry != null) {
      data['geometry'] = this.geometry!.toJson();
    }
    data['icon'] = this.icon;
    data['name'] = this.name;
    if (this.photos != null) {
      data['photos'] = this.photos!.map((v) => v.toJson()).toList();
    }
    data['place_id'] = this.placeId;
    data['reference'] = this.reference;
    data['scope'] = this.scope;
    data['types'] = this.types;
    data['url'] = this.url;
    data['utc_offset'] = this.utcOffset;
    data['vicinity'] = this.vicinity;
    data['website'] = this.website;
    return data;
  }
}

class AddressComponents {
  String? longName;
  String? shortName;
  List<String>? types;

  AddressComponents({this.longName, this.shortName, this.types});

  AddressComponents.fromJson(Map<String, dynamic> json) {
    longName = json['long_name'];
    shortName = json['short_name'];
    types = json['types'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['long_name'] = this.longName;
    data['short_name'] = this.shortName;
    data['types'] = this.types;
    return data;
  }
}

class Geometry {
  Location? location;
  Viewport? viewport;

  Geometry({this.location, this.viewport});

  Geometry.fromJson(Map<String, dynamic> json) {
    location = json['location'] != null
        ? new Location.fromJson(json['location'])
        : null;
    viewport = json['viewport'] != null
        ? new Viewport.fromJson(json['viewport'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.location != null) {
      data['location'] = this.location!.toJson();
    }
    if (this.viewport != null) {
      data['viewport'] = this.viewport!.toJson();
    }
    return data;
  }
}

class Location {
  double? lat;
  double? lng;

  Location({this.lat, this.lng});

  Location.fromJson(Map<String, dynamic> json) {

    if (json["lat"] != null) {
      lat = double.parse(json["lat"].toString());
    }
    if (json["lng"] != null) {
      lng = double.parse(json["lng"].toString());
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['lat'] = this.lat;
    data['lng'] = this.lng;
    return data;
  }
}

class Viewport {
  Location? northeast;
  Location? southwest;

  Viewport({this.northeast, this.southwest});

  Viewport.fromJson(Map<String, dynamic> json) {
    northeast = json['northeast'] != null
        ? new Location.fromJson(json['northeast'])
        : null;
    southwest = json['southwest'] != null
        ? new Location.fromJson(json['southwest'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.northeast != null) {
      data['northeast'] = this.northeast!.toJson();
    }
    if (this.southwest != null) {
      data['southwest'] = this.southwest!.toJson();
    }
    return data;
  }
}

class Photos {
  int? height;
  List<String>? htmlAttributions;
  String? photoReference;
  int? width;

  Photos({this.height, this.htmlAttributions, this.photoReference, this.width});

  Photos.fromJson(Map<String, dynamic> json) {
    height = json['height'];
    htmlAttributions = json['html_attributions'].cast<String>();
    photoReference = json['photo_reference'];
    width = json['width'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['height'] = this.height;
    data['html_attributions'] = this.htmlAttributions;
    data['photo_reference'] = this.photoReference;
    data['width'] = this.width;
    return data;
  }
}

class ErrorResponse {
  String? message;
  int? status;

  ErrorResponse( {this.message, this.status});

  ErrorResponse.fromJson(Map<String, dynamic> json) {
    message = json['message'];
    status = json['status'];

  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['message'] = message;
    data['status'] = status;

    return data;
  }
}


