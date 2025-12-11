/*
* @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
* @author     : Shiv Charan Panjeta < shiv@ozvid.com >
* All Rights Reserved.
* Proprietary and confidential :  All information contained herein is, and remains
* the property of Ozvid Technologies Pvt. Ltd. and its partners.
* Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import 'package:buzzgrab/app/modules/about/bindings/bindings.dart';
import 'package:buzzgrab/app/modules/about/views/about_us_screen.dart';
import 'package:buzzgrab/app/modules/address/binding/address_binding.dart';
import 'package:buzzgrab/app/modules/address/views/add_address_screen.dart';
import 'package:buzzgrab/app/modules/authentication/views/forget_screen.dart';
import 'package:buzzgrab/app/modules/authentication/views/otp_screen.dart';
import 'package:buzzgrab/app/modules/cart/binding/cart_binding.dart';
import 'package:buzzgrab/app/modules/cart/views/cart_screen.dart';
import 'package:buzzgrab/app/modules/cart/views/checkout_screen.dart';
import 'package:buzzgrab/app/modules/document/binding/document_binding.dart';
import 'package:buzzgrab/app/modules/earning/binding/bindings.dart';
import 'package:buzzgrab/app/modules/earning/views/transaction_history_screen.dart';
import 'package:buzzgrab/app/modules/home/views/delivery_detail_screen.dart';
import 'package:buzzgrab/app/modules/home/views/delivery_request_screen.dart';
import 'package:buzzgrab/app/modules/home/views/live_order_screen.dart';
import 'package:buzzgrab/app/modules/order/view/orders_screen.dart';
import 'package:buzzgrab/app/modules/product/binding/binding.dart';
import 'package:buzzgrab/app/modules/product/controller/product_detail_controller.dart';
import 'package:buzzgrab/app/modules/product/view/product_list_screen.dart';
import 'package:buzzgrab/app/modules/profile/view/editProfile_screen.dart';
import 'package:buzzgrab/app/modules/profile/view/profile_screen.dart';
import 'package:buzzgrab/app/modules/authentication/views/register_screen.dart';
import 'package:buzzgrab/app/modules/home/views/home_screen.dart';
import 'package:buzzgrab/app/modules/onboarding/views/onboarding_screen.dart';
import 'package:buzzgrab/app/modules/profile/binding/binding.dart';
import 'package:buzzgrab/app/modules/ratings/binding/binding.dart';
import 'package:buzzgrab/app/modules/ratings/views/rating_screen.dart';
import 'package:buzzgrab/app/modules/search/binding/search_binding.dart';
import 'package:buzzgrab/app/modules/search/views/filter_screen.dart';
import 'package:buzzgrab/app/modules/search/views/search_screen.dart';
import 'package:buzzgrab/app/modules/setting/binding/setting_binding.dart';
import 'package:buzzgrab/app/modules/setting/view/change_password_screen.dart';
import 'package:buzzgrab/app/modules/setting/view/contact_us_screen.dart';
import 'package:buzzgrab/app/modules/splash_module/views/splash_screen.dart';
import 'package:buzzgrab/app/modules/staticPages/views/static_page_screen.dart';
import '../../export.dart';
import '../modules/address/views/address_screen.dart';
import '../modules/authentication/views/account_submit_screen.dart';
import '../modules/authentication/views/edit_profile_screen.dart';
import '../modules/authentication/views/id_verification_screen.dart';
import '../modules/authentication/views/location_picker_screen.dart';
import '../modules/authentication/views/permission_screen.dart';
import '../modules/document/views/document_screen.dart';
import '../modules/earning/views/earning_screen.dart';
import '../modules/home/views/chat_screen.dart';
import '../modules/home/views/main_screen.dart';
import '../modules/order/binding/binding.dart';
import '../modules/product/view/product_detail_screen.dart';
import '../modules/profile/view/notification_screen.dart';
import '../modules/profile/view/select_language_screen.dart';
import '../modules/staticPages/binding/binding.dart';

class AppPages {
  static const INITIAL = AppRoutes.splash;

  static final routes = [
    GetPage(
      name: AppRoutes.splash,
      page: () => SplashScreen(),
      bindings: [SplashBinding()],
    ),
    GetPage(
        name: AppRoutes.onBoarding,
        page: () => OnboardingScreen(),
        binding: OnBoardingBinding()),
    GetPage(
      name: AppRoutes.logIn,
      page: () => LoginScreen(),
      bindings: [AuthenticationBinding()],
    ),
    GetPage(
      name: AppRoutes.signUp,
      page: () => RegisterScreen(),
      bindings: [AuthenticationBinding()],
    ),
    GetPage(
      name: AppRoutes.forgotPassword,
      page: () => ForgetScreen(),
      bindings: [AuthenticationBinding()],
    ),
    GetPage(
      name: AppRoutes.accountSubmitScreen,
      page: () => AccountSubmitScreen(),
    ),
    GetPage(
      name: AppRoutes.home,
      page: () => HomeScreen(),
      bindings: [HomeBinding()],
    ),
    GetPage(
      name: AppRoutes.deliveryRequestScreen,
      page: () => DeliveryRequestScreen(),
      bindings: [HomeBinding()],
    ),
    GetPage(
      name: AppRoutes.deliveryDetailScreen,
      page: () => DeliveryDetailScreen(),
      bindings: [HomeBinding()],
    ),
    GetPage(
      name: AppRoutes.liveOrderScreen,
      page: () => LiveOrderScreen(),
      bindings: [HomeBinding()],
    ),
    GetPage(
      name: AppRoutes.mainScreen,
      page: () => MainScreen(),
      bindings: [HomeBinding()],
    ),
    GetPage(
      name: AppRoutes.ordersScreen,
      page: () => OrdersScreen(),
      bindings: [OrderBinding()],
    ),
    GetPage(
      name: AppRoutes.ratingScreen,
      page: () => RatingScreen(),
      bindings: [RatingBinding()],
    ),
    GetPage(
      name: AppRoutes.earningScreen,
      page: () => EarningScreen(),
      bindings: [EarningBinding()],
    ),
    GetPage(
      name: AppRoutes.transactionHistoryScreen,
      page: () => TransactionHistoryScreen(),
      bindings: [EarningBinding()],
    ),
    GetPage(
      name: AppRoutes.profile,
      page: () => ProfileScreen(),
      bindings: [AuthenticationBinding()],
    ),
    GetPage(
      name: AppRoutes.notificationScreen,
      page: () => NotificationScreen(),
      bindings: [ProfileBinding()],
    ),
    GetPage(
      name: AppRoutes.contactUs,
      page: () => ContactUsScreen(),
      bindings: [SettingBinding()],
    ),
    GetPage(
      name: AppRoutes.changePassword,
      page: () => ChangePasswordScreen(),
      bindings: [SettingBinding()],
    ),
    GetPage(
      name: AppRoutes.editProfileScreen,
      page: () => EditProfileScreen(),
      bindings: [SettingBinding()],
    ),
    GetPage(
      name: AppRoutes.staticPageScreen,
      page: () => StaticPageScreen(),
      bindings: [StaticPageBinding()],
    ),
    GetPage(
      name: AppRoutes.aboutUsScreen,
      page: () => AboutUsScreen(),
      bindings: [AboutUsBindings()],
    ),
    GetPage(
      name: AppRoutes.otpScreen,
      page: () => OtpScreen(),
      bindings: [AuthenticationBinding()],
    ),
    GetPage(
      name: AppRoutes.selectLanguage,
      page: () => SelectLanguageScreen(),
      bindings: [ProfileBinding()],
    ),
    GetPage(
      name: AppRoutes.chatScreen,
      page: () => ChatScreen(),
      bindings: [HomeBinding()],
    ),
    GetPage(
      name: AppRoutes.permissionScreen,
      page: () => PermissionScreen(),
      bindings: [AuthenticationBinding()],
    ),
    GetPage(
      name: AppRoutes.locationPickerScreen,
      page: () => LocationPickerScreen(),
      bindings: [AuthenticationBinding()],
    ),
    GetPage(
      name: AppRoutes.iDVerificationScreen,
      page: () => IDVerificationScreen(),
      bindings: [AuthenticationBinding()],
    ),
    GetPage(
      name: AppRoutes.addressScreen,
      page: () => AddressScreen(),
      bindings: [AddressBinding()],
    ),
    GetPage(
      name: AppRoutes.addAddressScreen,
      page: () => AddAddressScreen(),
      bindings: [AddressBinding()],
    ),
    GetPage(
      name: AppRoutes.documentScreen,
      page: () => DocumentsScreen(),
      bindings: [DocumentBinding()],
    ),
    GetPage(
      name: AppRoutes.productListScreen,
      page: () => ProductListScreen(),
      bindings: [ProductBinding()],
    ),
    GetPage(
      name: AppRoutes.productDetailScreen,
      page: () => ProductDetailScreen(),
      bindings: [ProductBinding()],
    ),
    GetPage(
      name: AppRoutes.cartScreen,
      page: () => CartScreen(),
      bindings: [CartBinding()],
    ),
    GetPage(
      name: AppRoutes.searchScreen,
      page: () => SearchScreen(),
      bindings: [SearchBinding()],
    ),
    GetPage(
      name: AppRoutes.filterScreen,
      page: () => FilterScreen(),
      bindings: [SearchBinding()],
    ),
    GetPage(
      name: AppRoutes.checkoutScreen,
      page: () => CheckoutScreen(),
      bindings: [CartBinding()],
    ),
  ];
}
