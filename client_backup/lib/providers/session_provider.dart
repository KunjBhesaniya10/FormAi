import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class SessionProvider with ChangeNotifier {
  String? _userId;
  String? _currentSportId;
  Map<String, dynamic>? _sportConfig;
  bool _isLoading = false;

  String? get currentSportId => _currentSportId;
  Map<String, dynamic>? get sportConfig => _sportConfig;
  bool get isLoading => _isLoading;

  // Base URL for Android Emulator (IP 10.0.2.2 usually) or Localhost
  final String baseUrl = "http://127.0.0.1:8000"; 

  Future<void> loadUserContext(String userId) async {
    _isLoading = true;
    _userId = userId;
    notifyListeners();

    try {
      final response = await http.get(Uri.parse('$baseUrl/user/dashboard-config?user_id=$userId'));
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _currentSportId = data['active_sport'];
        _sportConfig = data['config'];
      } else {
        // User might not be onboarded yet
        _currentSportId = null;
      }
    } catch (e) {
      print("Error fetching context: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> onboardUser(String sportId, String skillLevel) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/user/onboard'),
        headers: {"Content-Type": "application/json"},
        body: json.encode({
          "user_id": _userId,
          "sport_id": sportId,
          "skill_level": skillLevel
        }),
      );

      if (response.statusCode == 200) {
        // Reload context to get the new config/theme
        await loadUserContext(_userId!); 
        return true;
      }
    } catch (e) {
      print("Onboarding failed: $e");
    }
    return false;
  }
}
