import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/session_provider.dart';
import 'screens/onboarding.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => SessionProvider()),
      ],
      child: FormAiApp(),
    ),
  );
}

class FormAiApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<SessionProvider>(
      builder: (context, session, child) {
        // Dynamic Theme based on Active Sport
        Color primaryColor = Colors.blue;
        if (session.sportConfig != null && session.sportConfig!['theme_color'] != null) {
           String hex = session.sportConfig!['theme_color'].replaceAll("#", "");
           primaryColor = Color(int.parse("FF$hex", radix: 16));
        }

        return MaterialApp(
          title: 'FormAi',
          theme: ThemeData(
            primaryColor: primaryColor,
            brightness: Brightness.dark,
            scaffoldBackgroundColor: Colors.black,
            useMaterial3: true,
          ),
          initialRoute: '/',
          routes: {
            '/': (ctx) => AuthWrapper(),
            '/onboarding': (ctx) => OnboardingScreen(),
            '/dashboard': (ctx) => Scaffold(
              appBar: AppBar(title: Text(session.sportConfig?['name'] ?? "Dashboard")),
              body: Center(child: Text("Welcome to ${session.sportConfig?['name']}")),
            ),
          },
        );
      },
    );
  }
}

class AuthWrapper extends StatefulWidget {
  @override
  _AuthWrapperState createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();
    // Simulate Login: Fetch Context for a dummy user ID
    Future.microtask(() async {
      final session = Provider.of<SessionProvider>(context, listen: false);
      await session.loadUserContext("dummy_user_123");
      
      if (session.currentSportId == null) {
        Navigator.pushReplacementNamed(context, '/onboarding');
      } else {
        Navigator.pushReplacementNamed(context, '/dashboard');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}
