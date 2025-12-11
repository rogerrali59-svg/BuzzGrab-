import '../../../export.dart';

class CustomWidget extends StatelessWidget {
  final child;
  final height;
  final color;
  final width;
  final bottomRightRadius;
  final bottomLeftRadius;
  CustomWidget({super.key, this.child, this.height, this.color, this.bottomRightRadius, this.bottomLeftRadius, this.width});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        width: width ?? Get.width,
        height: height,
        decoration: BoxDecoration(
            color: color ?? Colors.white,
            borderRadius: BorderRadius.only(bottomRight: Radius.circular(bottomRightRadius ?? radius_30), bottomLeft: Radius.circular(bottomLeftRadius ?? radius_30))),
        child: child,
      ),
    );
  }
}
