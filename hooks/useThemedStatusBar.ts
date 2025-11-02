import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export function useThemedStatusBar() {
    const { actualTheme } = useTheme();

    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setBarStyle(actualTheme === 'dark' ? 'light-content' : 'dark-content');
            StatusBar.setBackgroundColor(Colors[actualTheme].background);
        }
    }, [actualTheme]);
}
