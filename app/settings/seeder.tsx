import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/themes';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store/useSettingsStore';
import SettingItem from "@/components/SettingItem/SettingItem";

export default function SeederSettingsScreen() {
    const router = useRouter();
    const { actualTheme } = useTheme();
    const { t } = useTranslation();
    const sensorCount = useSettingsStore(s => s.sensorCount);
    const colors = Colors[actualTheme];

    return (
        <ScrollView
            style={[styles.scroll, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <ThemedView style={styles.container}>
                <ThemedView style={styles.section}>
                    <SettingItem
                        title={t('seeder.seedSensors')}
                        value={String(sensorCount)}
                        onPress={() => router.push('/settings/sensors')}
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
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        borderRadius: 12,
        overflow: 'hidden',
    },
});

