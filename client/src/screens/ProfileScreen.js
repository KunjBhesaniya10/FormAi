import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useSession } from '../context/SessionContext';
import { Award, Target, Zap } from 'lucide-react-native';

export default function ProfileScreen() {
    const { sportConfig, userStats, userData } = useSession();
    const themeColor = sportConfig?.theme_color || '#FFC107';

    const StatBox = ({ icon: Icon, label, value }) => (
        <View style={styles.statBox}>
            <Icon color={themeColor} size={24} />
            <Text style={styles.statVal}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.profileHeader}>
                    <View style={[styles.avatar, { borderColor: themeColor }]}>
                        <Text style={styles.avatarText}>
                            {(userData?.username || "U").substring(0, 2).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.name}>{userData?.full_name || "User"}</Text>
                    <Text style={styles.level}>{sportConfig?.name} Athlete • {userStats?.tier || "Beginner"}</Text>
                </View>

                <View style={styles.statsRow}>
                    <StatBox icon={Zap} value={userStats?.points || 0} label="Points" />
                    <StatBox icon={Award} value={userStats?.accuracy || "0%"} label="Accuracy" />
                    <StatBox icon={Target} value={userStats?.tier || "Beginner"} label="Tier" />
                </View>

                <View style={styles.gearSection}>
                    <Text style={styles.sectionTitle}>Equipments</Text>
                    <View style={styles.gearCard}>
                        <Text style={styles.gearText}>Primary Bat: Gray-Nicolls Legend</Text>
                        <TouchableOpacity onPress={() => alert('Gear improvement suggestions coming soon!')}>
                            <Text style={[styles.upgradeText, { color: themeColor }]}>Check Upgrade</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { padding: 24, alignItems: 'center' },
    profileHeader: { alignItems: 'center', marginBottom: 40 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#111', borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '900' },
    name: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    level: { color: '#666', fontSize: 16, marginTop: 4 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 40 },
    statBox: { backgroundColor: '#111', flex: 1, marginHorizontal: 6, padding: 16, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
    statVal: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 12 },
    statLabel: { color: '#666', fontSize: 12, marginTop: 4 },
    gearSection: { width: '100%' },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    gearCard: { backgroundColor: '#111', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#222' },
    gearText: { color: '#fff', fontSize: 16 },
    upgradeText: { marginTop: 12, fontWeight: 'bold' }
});
