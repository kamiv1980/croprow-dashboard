import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import {ThemeProvider, useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";
import {Platform, View} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import '@/i18n';
import {useTranslation} from "react-i18next";
import {LanguageProvider} from "@/contexts/LanguageContext";

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
    const { actualTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    return (
        <>
            {Platform.OS === 'ios' && (
                <View
                    style={{
                        height: insets.top,
                        backgroundColor: Colors[actualTheme].background
                    }}
                />
            )}

            <Stack >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                <Stack.Screen name="settings" options={{ headerShown: false }}/>
            </Stack>
            <StatusBar
                style={actualTheme === 'dark' ? 'light' : 'dark'}
                backgroundColor={Colors[actualTheme].background}
            />
        </>
    );
}

export default function RootLayout() {

  return (
    <ThemeProvider>
        <LanguageProvider>
            <RootLayoutNav/>
        </LanguageProvider>
    </ThemeProvider>
  );
}
