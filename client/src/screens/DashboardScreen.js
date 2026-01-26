import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { useSession } from '../context/SessionContext';
import { Play, TrendingUp, Calendar, Zap, ChevronRight, Award } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation }) {
    const { sportConfig } = useSession();
    const themeColor = sportConfig?.theme_color || '#FFC107';

    const BentoCard = ({ children, style, height = 160 }) => (
        <View style={[styles.bentoCard, { height, borderColor: '#222' }, style]}>
            {children}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.date}>MONDAY, 12 OCT</Text>
                        <Text style={styles.greeting}>Good Evening, Athlete</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <View style={[styles.avatar, { borderColor: themeColor }]}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>JD</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Hero Action Card (Full Width) */}
                <TouchableOpacity
                    style={[styles.heroCard, { backgroundColor: themeColor }]}
                    onPress={() => navigation.navigate('Practice')}
                >
                    <View style={styles.heroContent}>
                        <View style={styles.badge}>
                            <Text style={[styles.badgeText, { color: themeColor }]}>ACTIVE SESSION</Text>
                        </View>
                        <Text style={styles.heroTitle}>{sportConfig?.name.toUpperCase()} TRAINING</Text>
                        <Text style={styles.heroSubtitle}>Start AI-Powered Analysis</Text>
                    </View>
                    <View style={styles.playIcon}>
                        <Play fill="#000" color="#000" size={32} />
                    </View>
                </TouchableOpacity>

                {/* Bento Grid Layout */}
                <View style={styles.grid}>

                    {/* Left Column */}
                    <View style={styles.col}>
                        <BentoCard height={200} style={{ backgroundColor: '#161616' }}>
                            <View style={styles.cardHeader}>
                                <TrendingUp color={themeColor} size={24} />
                                <Text style={styles.cardLabel}>SKILL LEVEL</Text>
                            </View>
                            <View style={styles.bigStat}>
                                <Text style={styles.statNum}>7.5</Text>
                                <Text style={styles.statSub}>/ 10</Text>
                            </View>
                            <Text style={styles.statDesc}>Top 4% of players in your region</Text>
                        </BentoCard>

                        <BentoCard height={140} style={{ backgroundColor: '#111' }}>
                            <View style={styles.cardHeader}>
                                <Zap color="#fff" size={24} />
                                <Text style={styles.cardLabel}>STREAK</Text>
                            </View>
                            <Text style={[styles.statNum, { fontSize: 42, marginTop: 10 }]}>12 <Text style={{ fontSize: 20, color: '#666' }}>DAYS</Text></Text>
                        </BentoCard>
                    </View>

                    {/* Right Column */}
                    <View style={styles.col}>
                        <BentoCard height={140} style={{ backgroundColor: '#111' }}>
                            <View style={styles.cardHeader}>
                                <Calendar color="#fff" size={24} />
                                <Text style={styles.cardLabel}>LAST SESSION</Text>
                            </View>
                            <Text style={styles.statTitle}>Forehand & Footwork</Text>
                            <Text style={styles.timeAgo}>2 hours ago</Text>
                        </BentoCard>

                        <BentoCard height={200} style={{ backgroundColor: '#161616' }}>
                            <View style={styles.cardHeader}>
                                <Award color={themeColor} size={24} />
                                <Text style={styles.cardLabel}>FOCUS AREA</Text>
                            </View>
                            <Text style={styles.focusTitle}>Backhand Loop</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '65%', backgroundColor: themeColor }]} />
                            </View>
                            <Text style={styles.progressText}>65% Mastery</Text>

                            <Text style={[styles.focusTitle, { marginTop: 20 }]}>Service</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '40%', backgroundColor: themeColor }]} />
                            </View>
                            <Text style={styles.progressText}>40% Mastery</Text>
                        </BentoCard>
                    </View>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    scroll: { padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
    date: { color: '#666', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    greeting: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },

    heroCard: { width: '100%', height: 180, borderRadius: 32, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
    heroContent: { flex: 1 },
    badge: { backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 16 },
    badgeText: { fontWeight: '900', fontSize: 10, letterSpacing: 0.5 },
    heroTitle: { fontSize: 28, fontWeight: '900', color: '#000', lineHeight: 28 },
    heroSubtitle: { fontSize: 16, fontWeight: '600', color: '#000', marginTop: 8, opacity: 0.7 },
    playIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.4)', justifyContent: 'center', alignItems: 'center' },

    grid: { flexDirection: 'row', gap: 16 },
    col: { flex: 1, gap: 16 },
    bentoCard: { padding: 20, borderRadius: 24, borderWidth: 1, justifyContent: 'space-between' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    bigStat: { flexDirection: 'row', alignItems: 'baseline', marginTop: 10 },
    statNum: { fontSize: 48, fontWeight: '900', color: '#fff' },
    statSub: { fontSize: 20, color: '#666', fontWeight: '600' },
    statDesc: { color: '#666', fontSize: 12, lineHeight: 18 },
    statTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 12 },
    timeAgo: { color: '#666', fontSize: 14, marginTop: 4 },
    focusTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    progressBar: { height: 6, backgroundColor: '#333', borderRadius: 3, width: '100%', marginBottom: 6 },
    progressFill: { height: '100%', borderRadius: 3 },
    progressText: { color: '#666', fontSize: 12, alignSelf: 'flex-end' }
});
