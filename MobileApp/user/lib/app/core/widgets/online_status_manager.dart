import '../../../export.dart';

class OnlineStatusManager with WidgetsBindingObserver {


  void init() {
    WidgetsBinding.instance.addObserver(this);
    setOnline();
  }

  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    setOffline();
  }

  void setOnline() {
    print("User is Online");


  }

  void setOffline() {
    print("User is Offline");


  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      setOnline();
    } else if (state == AppLifecycleState.paused) {
      setOffline();
    }
  }
}
