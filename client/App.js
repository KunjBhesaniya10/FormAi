import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SessionProvider, useSession } from './src/context/SessionContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import CameraScreen from './src/screens/CameraScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Settings, Play, BarChart2, Home, User } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Dashboard component removed in favor of DashboardScreen import

function MainTabs() {
    const { sportConfig } = useSession();
    const themeColor = sportConfig?.theme_color || '#FFC107';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') return <Home color={color} size={size} />;
                    if (route.name === 'Profile') return <User color={color} size={size} />;
                    if (route.name === 'Settings') return <Settings color={color} size={size} />;
                },
                tabBarActiveTintColor: themeColor,
                tabBarInactiveTintColor: '#444',
                tabBarStyle: { backgroundColor: '#000', borderTopColor: '#111', height: 60, paddingBottom: 10 },
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

function Navigation() {
    const { currentSportId, loading, userId } = useSession();

    if (loading) {
        return (
            <View style={[styles.center, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    // Auth Flow

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!userId ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : !currentSportId ? (
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen
                            name="Practice"
                            component={CameraScreen}
                            options={{ animation: 'slide_from_bottom' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <SessionProvider>
            <Navigation />
        </SessionProvider>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, backgroundColor: '#000' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 10
    },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: -1 },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#111',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#222'
    },
    content: { flex: 1, padding: 24, justifyContent: 'center' },
    welcomeText: { fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
    subtext: { color: '#666', fontSize: 18, marginBottom: 48 },
    card: {
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#222'
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardInfo: { marginLeft: 16 },
    cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    cardVal: { color: '#666', marginTop: 4, fontSize: 14 },
    mainButton: {
        height: 72,
        borderRadius: 36,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold', marginLeft: 12 }
});
