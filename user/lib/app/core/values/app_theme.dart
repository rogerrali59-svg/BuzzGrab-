/*
 * @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

import 'package:buzzgrab/export.dart';
import 'package:flutter/cupertino.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ThemeConfig {
  static ThemeData createTheme({
    required Brightness brightness,
    required Color background,
    required Color primaryText,
    Color? secondaryText,
    required Color accentColor,
    Color? divider,
    Color? buttonBackground,
    required Color buttonText,
    Color? cardBackground,
    Color? disabled,
    required Color error,
  }) {
    final baseTextTheme = brightness == Brightness.dark
        ? Typography.blackMountainView
        : Typography.whiteMountainView;

    // 👇 Set icon color based on brightness
    final iconColor =
    brightness == Brightness.dark ? Colors.white : Colors.black;

    return ThemeData(
      brightness: brightness,
      canvasColor: background,
      primaryColorDark: Colors.red,
      primarySwatch: Colors.red,
      scaffoldBackgroundColor: background,
      cardColor: background,
      dividerColor: divider,
      pageTransitionsTheme: const PageTransitionsTheme(builders: {
        TargetPlatform.iOS: CupertinoPageTransitionsBuilder(),
        TargetPlatform.android: CupertinoPageTransitionsBuilder(),
      }),
      dividerTheme: DividerThemeData(
        color: divider,
        space: 1,
        thickness: 1,
      ),

      primaryColor: accentColor,
      colorScheme:
      ColorScheme.fromSwatch(accentColor: accentColor, brightness: brightness),

      textSelectionTheme: TextSelectionThemeData(
        cursorColor: accentColor,
        selectionColor: Colors.orange.shade50,
        selectionHandleColor: accentColor,
      ),

      // ✅ AppBar theme
      appBarTheme: AppBarTheme(
        systemOverlayStyle: SystemUiOverlayStyle(statusBarBrightness: brightness),
        backgroundColor: brightness == Brightness.dark
            ? Colors.black
            : Colors.white,
        elevation: 0,
        toolbarTextStyle: TextStyle(
          color: secondaryText ?? primaryText,
          fontSize: 18,
        ),
        titleTextStyle: TextStyle(
          color: secondaryText ?? primaryText,
          fontSize: 18,
          fontWeight: FontWeight.w600,
        ),
        iconTheme: IconThemeData(
          color: iconColor, // 👈 white in dark, black in light
          size: 25,
        ),
      ),

      // ✅ Icon theme
      iconTheme: IconThemeData(
        color: iconColor,
        size: 25,
      ),

      buttonTheme: ButtonThemeData(
        textTheme: ButtonTextTheme.primary,
        colorScheme: ColorScheme(
          brightness: brightness,
          primary: Colors.purple,
          primaryContainer: accentColor,
          secondary: accentColor,
          secondaryContainer: accentColor,
          surface: background,
          background: background,
          error: error,
          onPrimary: buttonText,
          onSecondary: buttonText,
          onSurface: buttonText,
          onBackground: buttonText,
          onError: buttonText,
        ),
        padding: const EdgeInsets.all(16.0),
      ),

      cupertinoOverrideTheme: CupertinoThemeData(
        brightness: brightness,
        primaryColor: accentColor,
      ),

      inputDecorationTheme: InputDecorationTheme(
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.grey, width: 1.5),
        ),
        focusedBorder: UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.blueAccent, width: 1.5),
        ),
        errorStyle: TextStyle(color: error),
        labelStyle: TextStyle(
          fontFamily: 'inter',
          fontWeight: FontWeight.w600,
          fontSize: 16.0,
          color: primaryText.withOpacity(0.5),
        ),
      ),

      fontFamily: 'inter',
      unselectedWidgetColor: Colors.grey,

      textTheme: TextTheme(
        headlineSmall: baseTextTheme.headlineSmall?.copyWith(
          color: primaryText,
          fontSize: 22,
          fontFamily: "inter",
          fontWeight: FontWeight.w700,
        ),
        headlineMedium: baseTextTheme.headlineMedium?.copyWith(
          color: primaryText,
          fontSize: 18,
          fontFamily: "inter",
          fontWeight: FontWeight.w600,
        ),
        bodySmall: baseTextTheme.bodySmall?.copyWith(
          color: primaryText,
          fontSize: 16,
          fontFamily: "inter",
          fontWeight: FontWeight.w500,
        ),
        bodyMedium: baseTextTheme.bodyMedium?.copyWith(
          color: primaryText,
          fontSize: 14,
          fontFamily: "inter",
          fontWeight: FontWeight.w500,
        ),
        titleSmall: baseTextTheme.titleSmall?.copyWith(
          color: primaryText,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
        titleMedium: baseTextTheme.titleMedium?.copyWith(
          color: secondaryText ?? primaryText.withOpacity(0.7),
          fontSize: 12,
          fontWeight: FontWeight.w400,
        ),
      ),
    );
  }

  static ThemeData get lightTheme => createTheme(
        brightness: Brightness.light,
        background: Colors.white,
        cardBackground: Colors.white,
        primaryText: Colors.black,
        secondaryText: Colors.black,
        accentColor: Colors.black,
        divider: Colors.black,
        buttonBackground: Colors.black38,
        buttonText: Colors.black,
        disabled: Colors.black,
        error: Colors.red,
      );


  static ThemeData get darkTheme => createTheme(
    brightness: Brightness.dark,
    background: appBgColor,
    cardBackground: Colors.white,
    primaryText: Colors.white,
    secondaryText: Colors.black,
    accentColor: Colors.transparent,
    divider: Colors.black45,
    buttonBackground: Colors.white,
    buttonText: Colors.white,
    disabled: Colors.white,
    error: Colors.red,
  );


}
