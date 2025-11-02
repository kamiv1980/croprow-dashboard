import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    actualTheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemTheme = useSystemColorScheme();
    const [theme, setThemeState] = useState<Theme>('system');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('app-theme');
            if (savedTheme) {
                setThemeState(savedTheme as Theme);
            }
        } catch (error) {
            console.error('Failed to load theme', error);
        }
    };

    const setTheme = async (newTheme: Theme) => {
        try {
            await AsyncStorage.setItem('app-theme', newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('Failed to save theme', error);
        }
    };

    const actualTheme = theme === 'system' ? (systemTheme ?? 'light') : theme;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
    {children}
    </ThemeContext.Provider>
);
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
