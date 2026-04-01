import 'package:http/http.dart' as http;
import 'dart:convert';

class PredictionService {
  static const String baseUrl = "https://disaster-backend-api.onrender.com";

  Future<String> getPrediction(double lat, double lon) async {
    try {
      final response = await http.post(
        Uri.parse("$baseUrl/predict"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "lat": lat,
          "lon": lon
        }),
      );

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        return data['prediction'];
      } else {
        return "Error: ${response.statusCode}";
      }
    } catch (e) {
      return "Connection failed: $e";
    }
  }
}
