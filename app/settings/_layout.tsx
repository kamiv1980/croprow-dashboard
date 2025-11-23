import {Stack} from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import {useTranslation} from "react-i18next";
import {Colors} from "@/constants/themes";
import {ButtonBack} from "@/components/ui/button-back";

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
                    headerTitle: t('theme.seedSensors'),
                    headerLeft: () => (<ButtonBack/>),
                }}
            />
            <Stack.Screen
                name="language"
                options={{
                    presentation: 'card',
                    headerTitle: t('language.title'),
                    headerLeft: () => (<ButtonBack/>),
                }}
            />
            <Stack.Screen
                name="units"
                options={{
                    presentation: 'card',
                    headerTitle: t('units.title'),
                    headerLeft: () => (<ButtonBack/>),
                }}
            />
            <Stack.Screen
                name="seeder"
                options={{
                    presentation: 'card',
                    headerTitle: t('seeder.title'),
                    headerLeft: () => (<ButtonBack/>),
                }}
            />
            <Stack.Screen
                name="sensors"
                options={{
                    presentation: 'card',
                    headerTitle: t('seeder.seedSensors'),
                }}
            />
        </Stack>
    );
}
