import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { Mic, X, Circle, Play, Info } from 'lucide-react-native';
import { useSession } from '../context/SessionContext';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function CameraScreen({ navigation }) {
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [micPermission, requestMicPermission] = useMicrophonePermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [lastFeedback, setLastFeedback] = useState("Ready to start?");
    const [analysis, setAnalysis] = useState(null);
    const cameraRef = useRef(null);
    const { sportConfig, userId, baseUrl } = useSession();

    const themeColor = sportConfig?.theme_color || '#FFC107';

    useEffect(() => {
        if (!cameraPermission || cameraPermission.status !== 'granted') {
            requestCameraPermission();
        }
        if (!micPermission || micPermission.status !== 'granted') {
            requestMicPermission();
        }
    }, []);

    const uploadVideo = async (videoUri) => {
        setLastFeedback("Syncing to AI Labs...");
        const formData = new FormData();
        formData.append('file', {
            uri: videoUri,
            type: 'video/mp4',
            name: `session_${Date.now()}.mp4`,
        });
        formData.append('user_id', userId);
        formData.append('sport_id', sportConfig.sport_id);

        try {
            const response = await axios.post(`${baseUrl}/session/analyze/deep`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log("Analysis Result:", response.data);
            setAnalysis(response.data);
            setLastFeedback("Analysis Complete!");
        } catch (e) {
            console.error("Upload failed", e);
            setLastFeedback("AI Analysis Failed. Check connection.");
        }
    };

    const handleToggleRecording = async () => {
        if (Platform.OS === 'web') {
            setIsRecording(!isRecording);
            setLastFeedback(isRecording ? "Ready to start?" : "Web recording limited. Use Expo Go for AI analysis.");
            return;
        }

        if (isRecording) {
            setIsRecording(false);
            try {
                if (cameraRef.current) {
                    await cameraRef.current.stopRecording();
                }
            } catch (e) {
                console.error("Stop recording error", e);
            }
        } else {
            setIsRecording(true);
            setLastFeedback("Watching your form...");
            if (cameraRef.current) {
                try {
                    const video = await cameraRef.current.recordAsync({
                        maxDuration: 600,
                        quality: '720p',
                    });
                    console.log("Video saved locally at:", video.uri);
                    await uploadVideo(video.uri);
                } catch (e) {
                    console.error("Recording error", e);
                    setIsRecording(false);
                }
            }
        }
    };

    if (!cameraPermission || !micPermission) {
        return <View style={styles.empty}><Text style={styles.text}>Requesting permissions...</Text></View>;
    }

    if (!cameraPermission.granted || !micPermission.granted) {
        return (
            <View style={styles.empty}>
                <Text style={styles.text}>No access to camera or microphone</Text>
                <TouchableOpacity onPress={() => { requestCameraPermission(); requestMicPermission(); }} style={{ marginTop: 20 }}>
                    <Text style={{ color: themeColor, fontWeight: 'bold' }}>Grant Permissions</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                ref={cameraRef}
                facing="back"
                mode="video"
            >
                <SafeAreaView style={styles.overlay}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                            <X color="#fff" size={24} />
                        </TouchableOpacity>
                        <View style={styles.sportBadge}>
                            <Text style={[styles.sportLabel, { color: themeColor }]}>{sportConfig?.name?.toUpperCase()}</Text>
                        </View>
                        <TouchableOpacity style={styles.iconButton}>
                            <Info color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* AI Feedback Bubble */}
                    <View style={styles.feedbackContainer}>
                        <View style={styles.glassBubble}>
                            <View style={[styles.aiPulse, { backgroundColor: themeColor }]} />
                            <Text style={styles.feedbackText}>{lastFeedback}</Text>
                        </View>
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.sideButton}>
                            <Mic color="#fff" size={28} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.recordButton, isRecording && { borderColor: '#ff4444' }]}
                            onPress={handleToggleRecording}
                        >
                            <View style={[
                                styles.recordInner,
                                { backgroundColor: isRecording ? '#ff4444' : themeColor },
                                isRecording && { borderRadius: 8, width: 30, height: 30 }
                            ]} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.sideButton}>
                            <Play color="#fff" size={28} />
                        </TouchableOpacity>
                    </View>

                    {/* Analysis Summary Overlay */}
                    {analysis && (
                        <View style={styles.analysisModal}>
                            <View style={styles.modalContent}>
                                <Text style={[styles.scoreText, { color: themeColor }]}>Form Score: {analysis.technical_score}/10</Text>
                                <Text style={styles.summaryText}>{analysis.summary}</Text>
                                <View style={styles.flawSection}>
                                    {analysis.detailed_flaws.map((flaw, i) => (
                                        <Text key={i} style={styles.flawItem}>• {flaw}</Text>
                                    ))}
                                </View>
                                <View style={[styles.gearTip, { borderColor: themeColor }]}>
                                    <Text style={[styles.gearLabel, { color: themeColor }]}>EQUIPMENT UPGRADE</Text>
                                    <Text style={styles.gearText}>{analysis.equipment_advice}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.closeButton, { backgroundColor: themeColor }]}
                                    onPress={() => { setAnalysis(null); navigation.navigate('Home'); }}
                                >
                                    <Text style={styles.closeButtonText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    overlay: { flex: 1, justifyContent: 'space-between', padding: 20 },
    empty: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    text: { color: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    sportBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    sportLabel: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1.2 },
    feedbackContainer: { alignItems: 'center', width: '100%', top: 20 },
    glassBubble: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: width * 0.8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    aiPulse: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
    feedbackText: { color: '#fff', fontSize: 16, fontWeight: '500' },
    footer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 40 },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    sideButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    analysisModal: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24, zIndex: 100 },
    modalContent: { backgroundColor: '#111', width: '100%', borderRadius: 32, padding: 32, borderWidth: 1, borderColor: '#333' },
    scoreText: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
    summaryText: { color: '#fff', fontSize: 18, marginBottom: 24, lineHeight: 24 },
    flawSection: { marginBottom: 32 },
    flawItem: { color: '#888', fontSize: 15, marginBottom: 8 },
    gearTip: { padding: 16, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(255,255,255,0.03)', marginBottom: 32 },
    gearLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
    gearText: { color: '#fff', fontSize: 15, fontWeight: '500' },
    closeButton: { height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    closeButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});
