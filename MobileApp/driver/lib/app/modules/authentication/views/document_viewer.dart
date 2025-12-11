import '../../../../export.dart';

class DocumentViewerScreen extends StatelessWidget {
  final String url,title;
  const DocumentViewerScreen({required this.url,required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Image.network(url, fit: BoxFit.contain, errorBuilder: (c,e,s)=>Text("Not an image / Failed to load")),
      ),
    );
  }
}



