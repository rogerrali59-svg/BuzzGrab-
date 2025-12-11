import '../../../export.dart';

class EarningContainerWidget extends StatelessWidget {
  final icon,percent,title,price;
   EarningContainerWidget({super.key, this.icon, this.percent, this.title, this.price});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(margin_12),
      decoration: BoxDecoration(
          border: Border.all(color: borderColor),
          borderRadius: BorderRadius.circular(radius_10),
          color: bgColor
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              AssetImageWidget(imageUrl: icon,imageHeight: height_35,),
              TextView(text: percent??"", textStyle: textStyleBodySmall().copyWith(
                  fontSize: font_14
              ))
            ],
          ),
          SizedBox(height: height_15,),
          TextView(text: title??"", textStyle: textStyleBodyMedium().copyWith(
              color: Colors.grey,fontSize: font_13,fontWeight: FontWeight.normal
          )),
          SizedBox(height: height_8,),
          TextView(text: price??"", textStyle: textStyleBodyMedium().copyWith(
              fontWeight: FontWeight.bold,fontSize: font_18
          )),
        ],
      ),
    );
  }

}
