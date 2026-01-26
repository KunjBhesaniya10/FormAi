import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useSession } from '../context/SessionContext';
import { Trophy, Activity, Target } from 'lucide-react-native';

const sports = [
    { id: 'table_tennis', name: 'Table Tennis', color: '#FFC107', icon: Trophy },
    { id: 'cricket', name: 'Cricket', color: '#1976D2', icon: Activity },
];

export default function OnboardingScreen({ navigation }) {
    const [selectedId, setSelectedId] = useState(null);
    const { onboardUser } = useSession();

    const handleStart = async () => {
        if (!selectedId) return;
        const success = await onboardUser(selectedId, 'Beginner');
        if (success) {
            // Navigation is handled by the Root Navigator based on state
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>FormAi</Text>
                <Text style={styles.subtitle}>Choose your arena</Text>

                <FlatList
                    data={sports}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const isSelected = selectedId === item.id;
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.card,
                                    isSelected && { borderColor: item.color, backgroundColor: item.color + '20' }
                                ]}
                                onPress={() => setSelectedId(item.id)}
                            >
                                <Icon size={48} color={isSelected ? item.color : '#666'} />
                                <Text style={[styles.cardText, isSelected && { color: item.color }]}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />

                <TouchableOpacity
                    style={[styles.button, !selectedId && styles.buttonDisabled]}
                    onPress={handleStart}
                    disabled={!selectedId}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { flex: 1, padding: 24, justifyContent: 'center' },
    title: { fontSize: 42, fontWeight: '900', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 18, color: '#888', marginBottom: 40 },
    list: { paddingVertical: 20 },
    card: {
        width: 160,
        height: 200,
        backgroundColor: '#111',
        borderRadius: 24,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent'
    },
    cardText: { marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#666' },
    button: {
        backgroundColor: '#fff',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    buttonDisabled: { backgroundColor: '#333' },
    buttonText: { fontSize: 18, fontWeight: 'bold', color: '#000' }
});
