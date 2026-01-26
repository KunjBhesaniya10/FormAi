import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/session_provider.dart';

class OnboardingScreen extends StatefulWidget {
  @override
  _OnboardingScreenState createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  // Hardcoded for MVP, ideally fetched from API /config/sports
  final List<Map<String, dynamic>> sports = [
    {
      "id": "table_tennis", 
      "name": "Table Tennis", 
      "color": 0xFFFFC107, 
      "icon": Icons.sports_tennis
    },
    {
      "id": "cricket", 
      "name": "Cricket", 
      "color": 0xFF1976D2, 
      "icon": Icons.sports_cricket
    },
  ];

  String? selectedSportId;
  String selectedSkill = "Beginner";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Choose Your Path",
                style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 10),
              Text(
                "Select the sport you want to master.",
                style: TextStyle(color: Colors.grey, fontSize: 16),
              ),
              SizedBox(height: 40),
              
              // Sport Carousel
              Container(
                height: 200,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: sports.length,
                  itemBuilder: (context, index) {
                    final sport = sports[index];
                    final isSelected = selectedSportId == sport['id'];
                    
                    return GestureDetector(
                      onTap: () => setState(() => selectedSportId = sport['id']),
                      child: Container(
                        width: 160,
                        margin: EdgeInsets.only(right: 16),
                        decoration: BoxDecoration(
                          color: isSelected ? Color(sport['color']) : Colors.grey[900],
                          borderRadius: BorderRadius.circular(20),
                          border: isSelected ? Border.all(color: Colors.white, width: 2) : null,
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(sport['icon'], size: 48, color: isSelected ? Colors.black : Colors.white),
                            SizedBox(height: 16),
                            Text(
                              sport['name'],
                              style: TextStyle(
                                color: isSelected ? Colors.black : Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 18
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              
              Spacer(),
              
              // Action Button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white, // Brand color
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: selectedSportId == null ? null : () async {
                    final success = await Provider.of<SessionProvider>(context, listen: false)
                        .onboardUser(selectedSportId!, selectedSkill);
                    
                    if (success) {
                      Navigator.pushReplacementNamed(context, '/dashboard');
                    }
                  },
                  child: Text(
                    "Start Training",
                    style: TextStyle(color: Colors.black, fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
