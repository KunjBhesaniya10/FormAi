import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [currentSportId, setCurrentSportId] = useState(null);
    const [sportConfig, setSportConfig] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Initial load

    // Dynamically get the host IP to avoid hardcoding
    const host = Constants.expoConfig?.hostUri ? Constants.expoConfig.hostUri.split(':').shift() : '127.0.0.1';
    const baseUrl = `http://${host}:8000`;

    const loadUserContext = async (uid) => {
        if (!uid) return;
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/user/dashboard-config?user_id=${uid}`);
            if (response.status === 200) {
                setCurrentSportId(response.data.active_sport); // Can be null/table_tennis
                setSportConfig(response.data.config);
                setUserStats(response.data.stats);
                setUserData({
                    full_name: response.data.full_name,
                    username: response.data.username
                });
            }
        } catch (e) {
            console.log("User config fetch failed", e);
            setCurrentSportId(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user/login`, { username, password });
            if (response.status === 200) {
                const uid = response.data.user_id;
                setUserId(uid);
                await loadUserContext(uid);
                return true;
            }
        } catch (e) {
            console.error("Login failed", e);
            const msg = e.response?.data?.detail || "Could not connect to server.";
            Alert.alert("Login Failed", msg);
            setLoading(false);
            return false;
        }
    };

    const register = async (userData) => {
        // userData: { username, password, email, full_name, sport_id, skill_level }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user/register`, userData);
            if (response.status === 200) {
                const uid = response.data.user_id;
                setUserId(uid);
                await loadUserContext(uid);
                return true;
            }
        } catch (e) {
            console.error("Registration failed", e);
            const msg = e.response?.data?.detail || "Registration failed.";
            Alert.alert("Error", msg);
            setLoading(false);
            return false;
        }
    };

    const logout = () => {
        setUserId(null);
        setCurrentSportId(null);
        setSportConfig(null);
        setUserStats(null);
    };

    const onboardUser = async (sportId, skillLevel) => {
        try {
            const response = await axios.post(`${baseUrl}/user/onboard`, {
                user_id: userId,
                sport_id: sportId,
                skill_level: skillLevel
            });
            if (response.status === 200) {
                await loadUserContext(userId);
                return true;
            }
        } catch (e) {
            console.error("Onboarding failed", e);
            Alert.alert("Error", "Failed to switch sport.");
        }
        return false;
    };

    const switchSport = async (sportId) => {
        // Re-use onboard logic since backend handles the toggle
        return await onboardUser(sportId, 'Existing');
    };

    // No auto-load on mount anymore since we wait for login
    // Or check local storage for persisted auth token (skipping for this prototype)
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <SessionContext.Provider value={{
            userId,
            currentSportId,
            sportConfig,
            userStats,
            userData,
            loading,
            login,
            register,
            logout,
            onboardUser,
            switchSport,
            baseUrl
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
