import React, {useEffect, useState} from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import {useTranslation} from "react-i18next";
import {useLanguage} from "@/contexts/LanguageContext";
import SettingItem from "@/components/SettingItem/SettingItem";
import {useUnits} from "@/contexts/UnitsContext";
import {UNITS} from "@/constants/units";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function SettingsScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const {labelLanguage} = useLanguage();
    const { system } = useUnits();
    const [, forceRender] = useState(0);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const unsub = () => forceRender((n) => n + 1);
        i18n.on('languageChanged', unsub);
        return () => i18n.off('languageChanged', unsub);
    }, [i18n]);

    const getThemeLabel = () => {
        switch (theme) {
            case 'light': return t('theme.light');
            case 'dark': return t('theme.dark');
            case 'system': return t('theme.system');
            default: return t('theme.system');
        }
    };
    const getUnits = () => {
        const currentSystem = UNITS.find(u => u.value === system);
        return currentSystem ? currentSystem.label : '';
    };

    return (
        <ScrollView style={[
            styles.scroll,
            {
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            },
        ]}>
            <ThemedView style={styles.container}>
                <ThemedText style={styles.header}>{t('settings.title')}</ThemedText>

                <ThemedView style={styles.section}>
                    <SettingItem
                        title={t("language.title")}
                        value={labelLanguage}
                        onPress={() => router.push('/settings/language')}
                    />
                    <SettingItem
                        title={t("units.title")}
                        value={getUnits()}
                        onPress={() => router.push('/settings/units')}
                    />
                    <SettingItem
                        title={t("theme.title")}
                        value={getThemeLabel()}
                        onPress={() => router.push('/settings/theme')}
                    />
                    <SettingItem
                        title={t("seeder.title")}
                        onPress={() => router.push('/settings/seeder')}
                    />
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    section: {
        borderRadius: 12,
        overflow: 'hidden',
    },
});
