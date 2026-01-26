import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useSession } from '../context/SessionContext';
import { ChevronRight, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react-native';

export default function SettingsScreen({ navigation }) {
    const { sportConfig, switchSport } = useSession();
    const themeColor = sportConfig?.theme_color || '#FFC107';

    const SettingItem = ({ icon: Icon, title, subtitle }) => (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.iconBox}>
                    <Icon color="#666" size={22} />
                </View>
                <View>
                    <Text style={styles.itemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <ChevronRight color="#333" size={20} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Active Sport</Text>
                    <View style={styles.sportSwitcher}>
                        <TouchableOpacity
                            style={[styles.sportOption, sportConfig?.sport_id === 'table_tennis' && { borderColor: '#FFC107', backgroundColor: '#FFC10720' }]}
                            onPress={() => switchSport('table_tennis')}
                        >
                            <Text style={[styles.sportOptionText, sportConfig?.sport_id === 'table_tennis' && { color: '#FFC107' }]}>Table Tennis</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.sportOption, sportConfig?.sport_id === 'cricket' && { borderColor: '#1976D2', backgroundColor: '#1976D220' }]}
                            onPress={() => switchSport('cricket')}
                        >
                            <Text style={[styles.sportOptionText, sportConfig?.sport_id === 'cricket' && { color: '#1976D2' }]}>Cricket</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <SettingItem icon={User} title="Profile" subtitle="Personal details & sports" />
                    <SettingItem icon={Bell} title="Notifications" subtitle="Practice reminders" />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy & Support</Text>
                    <SettingItem icon={Shield} title="Privacy Policy" />
                    <SettingItem icon={HelpCircle} title="Help Center" />
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <LogOut color="#ff4444" size={20} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 24, paddingTop: 20 },
    headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
    scroll: { padding: 24 },
    section: { marginBottom: 32 },
    sectionTitle: { color: '#444', fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' },
    item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    itemLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    itemTitle: { color: '#fff', fontSize: 17, fontWeight: '600' },
    itemSubtitle: { color: '#666', fontSize: 13, marginTop: 2 },
    logoutButton: { flexDirection: 'row', alignItems: 'center', marginTop: 20, padding: 16, borderRadius: 16, backgroundColor: 'rgba(255, 68, 68, 0.1)' },
    logoutText: { color: '#ff4444', fontSize: 16, fontWeight: 'bold', marginLeft: 12 },
    sportSwitcher: { flexDirection: 'row', gap: 12 },
    sportOption: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#333', alignItems: 'center', backgroundColor: '#111' },
    sportOptionText: { color: '#666', fontWeight: 'bold' }
});
