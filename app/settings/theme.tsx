import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/themes';
import {IconSymbol} from "@/components/ui/icon-symbol";
import {useTranslation} from "react-i18next";

export default function ThemeSettingsScreen() {
    const { theme, setTheme, actualTheme } = useTheme();
    const colors = Colors[actualTheme];
    const { t } = useTranslation();

    const options: { value: 'light' | 'dark' | 'system'; label: string }[] = [
        { value: 'light', label: 'light' },
        { value: 'dark', label: 'dark' },
        { value: 'system', label: 'system' },
    ];

    return (
        <ThemedView style={styles.container}>
            {options.map((option) => (
                <Pressable
                    key={option.value}
                    style={[
                        styles.option,
                        {backgroundColor: colors.card}
                    ]}
                    onPress={() => setTheme(option.value)}
                >
                    <ThemedText style={[
                        styles.optionText,
                        theme === option.value &&
                            {color: colors.primary}
                    ]}>{t(`theme.${option.label}`)}</ThemedText>
                    {theme === option.value && (
                        <IconSymbol size={24} name="checkmark" color={colors.primary} />
                    )}
                </Pressable>
            ))}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    optionText: {
        fontSize: 16,
    },
});
