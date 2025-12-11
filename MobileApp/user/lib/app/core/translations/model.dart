import '../../../export.dart';

class LanguageTypeModel {
  dynamic languageTitle;
  dynamic languageType;
  dynamic image;

  LanguageTypeModel({this.languageTitle, this.languageType, this.image});

  factory LanguageTypeModel.fromJson(Map<String, dynamic> json) {
    return LanguageTypeModel(
      languageTitle: json['languageTitle'],
      languageType: json['languageType'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'languageTitle': languageTitle,
      'languageType': languageType,
    };
  }
}


RxList<LanguageTypeModel> newLanguageList = [
  LanguageTypeModel(
    languageTitle: 'English',
    languageType: 0,
  ),
  LanguageTypeModel(
    languageTitle: 'عربي',
    languageType: 1,
  ),
  LanguageTypeModel(
    languageTitle: '中国人',
    languageType: 2,
  ),
  LanguageTypeModel(
    languageTitle: 'Español',
    languageType: 3,
  ),
  LanguageTypeModel(
    languageTitle: 'Français',
    languageType: 4,
  ),
].obs;
