import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSession } from '../context/SessionContext';
import { ArrowRight, Zap, Check } from 'lucide-react-native';

export default function LoginScreen() {
    const { login, register, loading } = useSession();
    const [isRegistering, setIsRegistering] = useState(false);

    // Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [sportId, setSportId] = useState('table_tennis'); // Default
    const [skillLevel, setSkillLevel] = useState('Beginner'); // Default

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAuth = async () => {
        if (!username.trim() || !password.trim()) return;

        setIsSubmitting(true);
        let success = false;

        if (isRegistering) {
            success = await register({
                username,
                password,
                email,
                full_name: fullName,
                sport_id: sportId,
                skill_level: skillLevel
            });
        } else {
            success = await login(username, password);
        }

        setIsSubmitting(false);
    };

    const SportOption = ({ id, label }) => (
        <TouchableOpacity
            style={[styles.optionBtn, sportId === id && styles.optionBtnActive]}
            onPress={() => setSportId(id)}
        >
            <Text style={[styles.optionText, sportId === id && styles.optionTextActive]}>{label}</Text>
            {sportId === id && <Check size={16} color="#000" />}
        </TouchableOpacity>
    );

    const SkillOption = ({ level }) => (
        <TouchableOpacity
            style={[styles.optionBtn, skillLevel === level && styles.optionBtnActive]}
            onPress={() => setSkillLevel(level)}
        >
            <Text style={[styles.optionText, skillLevel === level && styles.optionTextActive]}>{level}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <View style={styles.header}>
                        <View style={styles.logoBox}>
                            <Zap color="#FFC107" size={32} fill="#FFC107" />
                        </View>
                        <Text style={styles.title}>FormAi</Text>
                        <Text style={styles.subtitle}>AI Sports Coaching</Text>
                    </View>

                    <View style={styles.toggleContainer}>
                        <TouchableOpacity style={[styles.toggleBtn, !isRegistering && styles.toggleBtnActive]} onPress={() => setIsRegistering(false)}>
                            <Text style={[styles.toggleText, !isRegistering && styles.toggleTextActive]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.toggleBtn, isRegistering && styles.toggleBtnActive]} onPress={() => setIsRegistering(true)}>
                            <Text style={[styles.toggleText, isRegistering && styles.toggleTextActive]}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="username"
                            placeholderTextColor="#666"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="password"
                            placeholderTextColor="#666"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {isRegistering && (
                            <>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@example.com"
                                    placeholderTextColor="#666"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />

                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor="#666"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />

                                <Text style={styles.label}>Select Sport</Text>
                                <View style={styles.optionsRow}>
                                    <SportOption id="table_tennis" label="Table Tennis" />
                                    <SportOption id="cricket" label="Cricket" />
                                </View>

                                <Text style={[styles.label, { marginTop: 16 }]}>Skill Level</Text>
                                <View style={styles.optionsRow}>
                                    <SkillOption level="Beginner" />
                                    <SkillOption level="Intermediate" />
                                </View>
                                <View style={[styles.optionsRow, { marginTop: 8 }]}>
                                    <SkillOption level="Advanced" />
                                    <SkillOption level="Pro" />
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            style={[styles.button, (!username || !password) && styles.buttonDisabled]}
                            onPress={handleAuth}
                            disabled={!username || !password || isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <>
                                    <Text style={styles.buttonText}>{isRegistering ? "Create Account" : "Login"}</Text>
                                    <ArrowRight color="#000" size={20} style={{ marginLeft: 8 }} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    content: { flex: 1, padding: 24 },
    header: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
    logoBox: {
        width: 80, height: 80, borderRadius: 24, backgroundColor: '#111',
        justifyContent: 'center', alignItems: 'center', marginBottom: 24,
        borderWidth: 1, borderColor: '#222', shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8
    },
    title: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: -1 },
    subtitle: { fontSize: 18, color: '#666', marginTop: 8 },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#111', borderRadius: 12, padding: 4, marginBottom: 32 },
    toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
    toggleBtnActive: { backgroundColor: '#333' },
    toggleText: { color: '#666', fontWeight: 'bold' },
    toggleTextActive: { color: '#fff' },
    form: { width: '100%' },
    label: { color: '#888', marginBottom: 8, marginLeft: 4, fontWeight: '600' },
    input: {
        backgroundColor: '#111', borderWidth: 1, borderColor: '#333', borderRadius: 16,
        padding: 16, fontSize: 16, color: '#fff', marginBottom: 16
    },
    button: {
        backgroundColor: '#FFC107', height: 64, borderRadius: 32, flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center', marginTop: 24,
        shadowColor: '#FFC107', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8
    },
    buttonDisabled: { backgroundColor: '#333', shadowOpacity: 0 },
    buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
    optionsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
    optionBtn: {
        paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20,
        borderWidth: 1, borderColor: '#333', backgroundColor: '#111',
        flexDirection: 'row', alignItems: 'center', gap: 6
    },
    optionBtnActive: { backgroundColor: '#FFC107', borderColor: '#FFC107' },
    optionText: { color: '#888', fontWeight: '600' },
    optionTextActive: { color: '#000', fontWeight: 'bold' }
});
