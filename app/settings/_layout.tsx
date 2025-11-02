import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import {useTranslation} from "react-i18next";
import {Colors} from "@/constants/themes";

export default function SettingsLayout() {
    const { actualTheme } = useTheme();

    const { t } = useTranslation();

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: Colors[actualTheme].background,
                },
                headerTitleStyle: {
                    fontSize: 24,
                },
                headerTintColor: Colors[actualTheme].text,
            }}
        >
            <Stack.Screen
                name="theme"
                options={{
                    presentation: 'card',
                    headerTitle: t('theme.title')
                }}
            />
            <Stack.Screen
                name="language"
                options={{
                    presentation: 'card',
                    headerTitle: t('language.title')
                }}
            />
            <Stack.Screen
                name="units"
                options={{
                    presentation: 'card',
                    headerTitle: t('units.title')
                }}
            />
        </Stack>
    );
}
