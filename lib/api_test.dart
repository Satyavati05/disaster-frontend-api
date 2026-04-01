import 'package:http/http.dart' as http;
import 'dart:convert';

Future getPrediction() async {
  final response = await http.post(
    Uri.parse("https://disaster-backend-api.onrender.com/predict"),
    headers: {"Content-Type": "application/json"},
    body: jsonEncode({
      "lat": 28.6,
      "lon": 77.2
    }),
  );

  var data = jsonDecode(response.body);
  print(data['prediction']);
}
