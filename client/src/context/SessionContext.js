import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [userId, setUserId] = useState('dummy_user_123');
    const [currentSportId, setCurrentSportId] = useState(null);
    const [sportConfig, setSportConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamically get the host IP to avoid hardcoding
    const host = Constants.expoConfig?.hostUri ? Constants.expoConfig.hostUri.split(':').shift() : '127.0.0.1';
    const baseUrl = `http://${host}:8000`;

    const loadUserContext = async (uid) => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/user/dashboard-config?user_id=${uid}`);
            if (response.status === 200) {
                setCurrentSportId(response.data.active_sport);
                setSportConfig(response.data.config);
            }
        } catch (e) {
            console.log("User not onboarded or server down at", baseUrl);
            setCurrentSportId(null);
        } finally {
            setLoading(false);
        }
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
        }
        return false;
    };

    const switchSport = async (sportId) => {
        // Re-use onboard logic since backend handles the toggle
        return await onboardUser(sportId, 'Existing');
    };

    useEffect(() => {
        loadUserContext(userId);
    }, []);

    return (
        <SessionContext.Provider value={{
            userId,
            currentSportId,
            sportConfig,
            loading,
            onboardUser,
            switchSport,
            baseUrl
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
