import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/constants/languages';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const saved = await AsyncStorage.getItem('language');
                if (saved && saved !== i18n.language) {
                    await i18n.changeLanguage(saved);
                    setLanguage(saved);
                }
            } catch (err) {
                console.warn('Failed to load language:', err);
            }
        };
        loadLanguage();
    }, [i18n]);

    const changeLanguage = useCallback(
        async (lang) => {
            try {
                await AsyncStorage.setItem('language', lang);
                await i18n.changeLanguage(lang);
                setLanguage(lang);
            } catch (err) {
                console.warn('Failed to change language:', err);
            }
        },
        [i18n]
    );

    const labelLanguage = useMemo(() => {
        return LANGUAGES.find((l) => l.lang === language)?.label || 'Unknown';
    }, [language]);

    useEffect(() => {
        const handler = (lng) => setLanguage(lng);
        i18n.on('languageChanged', handler);
        return () => i18n.off('languageChanged', handler);
    }, [i18n]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, labelLanguage }}>
    {children}
    </LanguageContext.Provider>
);
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
