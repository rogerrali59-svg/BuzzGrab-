## []{#anchor}Naming rules

Flutter follows the Java naming conventions. In particular:

Names of packages are always lower case and do not use underscores
(**org.example.myproject**). Using multi-word names is generally
discouraged, but if you do need to use multiple words, you can either
simply concatenate them together or use camel humps
(**org.example.myProject**).

Names of classes and objects start with an upper case letter and use
camel humps:

For class

**class **HomeScreen

State of the Class

**class **\_HomeScreenState

### 

### Widget Build

Less code use in build method or top Level Method

**fun** processDeclarations() { \... }

build Method break into sub methods

Widget \_buildThemeButton() {

return Text(""):

}

E

Reuse Of Widgets that are used Common Like Text,TextFormFields etc

**abstract** **class** Foo { \...

**class **MaterialButtonWidget **extends **StatelessWidget {\
**final **String **buttonText**;\
**final **Color **buttonColor**;\
**final **Color **textColor**;\
**final **Function **onPressed**;\
**final **double **fontsize**;\
\
**const **MaterialButtonWidget({\
**this**.**buttonText**,\
**this**.**buttonColor**,\
**this**.**textColor **= Colors.*white*,\
**this**.**onPressed**,**this**.**fontsize**,\
});\
\
\@override\
Widget build(BuildContext context) {\
**return **SizedBox(\
width: HelperWidget.*fullWidthScreen*(context),\
height: Dimens.*height_50*,\
child: RaisedButton(\
elevation: Dimens.*elvation_2*,\
color: **buttonColor**,\
onPressed: **onPressed**,\
shape: RoundedRectangleBorder(\
borderRadius: BorderRadius.circular(Dimens.*radius_3*),\
side: BorderSide(color: **buttonColor**)\
),\
child: Text(\
**buttonText**,\
style: HelperWidget.*textStyle*(**textColor**, **fontsize**),\
),\
),\
);\
}\
}\

### Property names

Names of constants (properties marked with **const**, or top-level or
object **val** properties with no custom **get** function that hold
deeply immutable data) should use uppercase underscore-separated names:

**const** **val** MAX_COUNT = 8

**static const **String *imageUrl *

N

Usage of colors,assets ,images ,icons,dimension

**class **Assets {\
Assets.\_();\
\
*// splash screen assets*\
\
**static const **String *slider3 *= **\"assets/slider3.png\"**;\
\
}

[]{#anchor}Formatting

key points for .yaml

1\) Add dependencies without the specific verison

**dependencies**:\
**flutter**: // after two space than add dependencies\
**sdk**: flutter\
* ***cupertino_icons**:

2\) For Assests // also two spaces

**assets**:\
- assets/\
- assets/icons/\
- assets/fonts/

3\) Fonts

**fonts**:\
- **family**: ProductSans\
**fonts**:\
 - **asset**: assets/fonts/Product-Sans-Regular.ttf\
 - **asset**: assets/fonts/Product-Sans-Italic.ttf\
**style**: italic\
 - **asset**: assets/fonts/Product-Sans-Bold.ttf\
**weight**: 700

\
