import 'package:flutter/material.dart';

class SplashAnimation {
  final AnimationController controller;
  Animation<Offset>? slideAnimation;
  Animation<double>? scaleAnimation;



  SplashAnimation({
    required this.controller,
    String? animationType,
  }) {
    _initializeAnimation(animationType ?? "slideLeftToRight");
  }



  void _initializeAnimation(String animationType) {
    switch (animationType) {
      case "zoomIn":
        scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
          CurvedAnimation(parent: controller, curve: Curves.easeInOut),
        );
        break;

      case "zoomOut":
        scaleAnimation = Tween<double>(begin: 1.0, end: 0.0).animate(
          CurvedAnimation(parent: controller, curve: Curves.easeInOut),
        );
        break;

      case "slideLeftToRight":
        slideAnimation =
            Tween<Offset>(begin: Offset(-1.0, 0.0), end: Offset.zero).animate(
          CurvedAnimation(parent: controller, curve: Curves.easeInOut),
        );
        break;

      case "slideRightToLeft":
        slideAnimation =
            Tween<Offset>(begin: Offset(1.0, 0.0), end: Offset.zero).animate(
          CurvedAnimation(parent: controller, curve: Curves.easeInOut),
        );
        break;

      case "slideTopToBottom":
        slideAnimation =
            Tween<Offset>(begin: Offset(0.0, -1.0), end: Offset.zero).animate(
          CurvedAnimation(parent: controller, curve: Curves.easeInOut),
        );
        break;

      case "slideBottomToTop":
        slideAnimation =
            Tween<Offset>(begin: Offset(0.0, 1.0), end: Offset.zero).animate(
          CurvedAnimation(parent: controller, curve: Curves.easeInOut),
        );
        break;

      default:
        slideAnimation =
            Tween<Offset>(begin: Offset.zero, end: Offset.zero).animate(
          CurvedAnimation(parent: controller, curve: Curves.easeInOut),
        );
        break;
    }
  }



  Widget applySlideTransition(Widget child) {
    return SlideTransition(
      position: slideAnimation!,
      child: child,
    );
  }


  Widget applyScaleTransition(Widget child) {
    return ScaleTransition(
      scale: scaleAnimation!,
      child: child,
    );
  }


  void dispose() {
    controller.dispose();
  }
}
