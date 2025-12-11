import 'package:flutter_logger/FlutterLogger.dart';

import '../../../export.dart';

class CrashReportScreen extends StatefulWidget {
  const CrashReportScreen({super.key});

  @override
  State<CrashReportScreen> createState() => _CrashReportScreenState();
}

class _CrashReportScreenState extends State<CrashReportScreen> {
  Map<String, dynamic> crashData = {};

  @override
  void initState() {
    readData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: CustomAppBar(
          appBarTitleText: 'Crash Screen',
        ),
        body: crashData.isNotEmpty
            ? SingleChildScrollView(
                child: Column(
                  children: [
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: margin_10, vertical: margin_15),
                      child: Row(
                        children: [
                          SizedBox(
                              width: width_100,
                              child: Text(
                                'Crash On',
                                style: TextStyle(color: Colors.black),
                              )),
                          Text(":", style: TextStyle(color: Colors.black)),
                          SizedBox(
                            width: width_10,
                          ),
                          Expanded(child: Text(crashData["LogTime"], style: TextStyle(color: Colors.black)))
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: margin_10, vertical: margin_15),
                      child: Row(
                        children: [
                          SizedBox(width: width_100, child: Text('Device Version', style: TextStyle(color: Colors.black))),
                          Text(":", style: TextStyle(color: Colors.black)),
                          SizedBox(
                            width: width_10,
                          ),
                          Expanded(child: Text(crashData["Log[link]"], style: TextStyle(color: Colors.black)))
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: margin_10, vertical: margin_15),
                      child: Row(
                        children: [
                          SizedBox(width: width_100, child: Text('Device Name', style: TextStyle(color: Colors.black))),
                          Text(":", style: TextStyle(color: Colors.black)),
                          SizedBox(
                            width: width_10,
                          ),
                          Expanded(child: Text(crashData["Log[referer_link]"], style: TextStyle(color: Colors.black)))
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: margin_10, vertical: margin_15),
                      child: Row(
                        children: [
                          SizedBox(width: width_100, child: Text('Device ID', style: TextStyle(color: Colors.black))),
                          Text(":", style: TextStyle(color: Colors.black)),
                          SizedBox(
                            width: width_10,
                          ),
                          Expanded(child: Text(crashData["Log[user_ip]"], style: TextStyle(color: Colors.black)))
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: margin_10, vertical: margin_15),
                      child: Row(
                        children: [
                          SizedBox(width: width_100, child: Text('Error', style: TextStyle(color: Colors.black))),
                          Text(":", style: TextStyle(color: Colors.black)),
                          SizedBox(
                            width: width_10,
                          ),
                          Expanded(child: Text(crashData["Log[stackTrace]"], style: TextStyle(color: Colors.black)))
                        ],
                      ),
                    ),
                  ],
                ),
              )
            : Center(
                child: Text("${'Not Crash Record Yet'}!", style: TextStyle(color: Colors.black)),
              ),
      ),
    );
  }

  void readData() {
    (FlutterLogger().readFile()).then((value) {
      setState(() {
        crashData = value;
      });
    });
  }
}
