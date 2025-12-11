import '../../../export.dart';

class ThemeController extends GetxController {
  final RxBool _isDarkMode = true.obs;

  // Expose Rx for themeMode
  Rx<ThemeMode> themeMode = ThemeMode.light.obs;

  bool get isDarkMode => _isDarkMode.value;

  ThemeData get currentTheme =>
      isDarkMode ? ThemeConfig.darkTheme : ThemeConfig.lightTheme;

  @override
  void onInit() {
    super.onInit();
    _loadTheme();
  }

  void toggleTheme() {
    _isDarkMode.value = !_isDarkMode.value;
    themeMode.value = _isDarkMode.value ? ThemeMode.dark : ThemeMode.light;
    Get.changeThemeMode(themeMode.value);
    _saveTheme(_isDarkMode.value);
    update();
    themeMode.refresh();
  }

  void _loadTheme() async {
    bool? darkMode = await PreferenceManger().getDarkMode();
    _isDarkMode.value = darkMode ?? true;
    themeMode.value = _isDarkMode.value ? ThemeMode.dark : ThemeMode.light;
    Get.changeThemeMode(themeMode.value);
  }

  void _saveTheme(bool value) async {
    await PreferenceManger().setDarkMode(value);
  }
}
