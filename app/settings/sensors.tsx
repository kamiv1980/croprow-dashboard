import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput, View, Pressable, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/themes';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation } from 'react-i18next';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SeedSensorsSettingsScreen() {
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];
    const { t } = useTranslation();
    const sensorCount = useSettingsStore(s => s.sensorCount);
    const setSensorCount = useSettingsStore(s => s.setSensorCount);

    const [localValue, setLocalValue] = useState(String(sensorCount));

    useEffect(() => {
        setLocalValue(String(sensorCount));
    }, [sensorCount]);

    const handleDecrease = () => {
        const newValue = Math.max(1, sensorCount - 1);
        setSensorCount(newValue);
        setLocalValue(String(newValue));
    };

    const handleIncrease = () => {
        const newValue = Math.min(64, sensorCount + 1);
        setSensorCount(newValue);
        setLocalValue(String(newValue));
    };

    const handleTextChange = (text: string) => {
        setLocalValue(text);
    };

    const handleBlur = () => {
        const numValue = parseInt(localValue, 10);
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 64) {
            setSensorCount(numValue);
        } else {
            setLocalValue(String(sensorCount));
        }
    };

    return (
        <ScrollView
            style={[styles.scroll, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.scrollContent}
        >
            <ThemedView style={styles.container}>
                <ThemedView style={[styles.section, { backgroundColor: colors.card }]}>
                    <View style={styles.controlContainer}>
                        <Pressable
                            style={[styles.button, { backgroundColor: colors.background, borderColor: colors.border }]}
                            onPress={handleDecrease}
                            disabled={sensorCount <= 1}
                        >
                            <IconSymbol
                                size={24}
                                name="minus"
                                color={sensorCount <= 1 ? colors.text + '40' : colors.primary}
                            />
                        </Pressable>

                        <TextInput
                            style={[styles.input, {
                                color: colors.text,
                                borderColor: colors.border,
                                backgroundColor: colors.background
                            }]}
                            value={localValue}
                            onChangeText={handleTextChange}
                            onBlur={handleBlur}
                            keyboardType="number-pad"
                            maxLength={2}
                            selectTextOnFocus
                        />

                        <Pressable
                            style={[styles.button, { backgroundColor: colors.background, borderColor: colors.border }]}
                            onPress={handleIncrease}
                            disabled={sensorCount >= 64}
                        >
                            <IconSymbol
                                size={24}
                                name="plus"
                                color={sensorCount >= 64 ? colors.text + '40' : colors.primary}
                            />
                        </Pressable>
                    </View>

                    <ThemedText style={[styles.hint, { color: colors.text + '80' }]}>
                        {t('seeder.seedSensorsHint', { min: 1, max: 64 })}
                    </ThemedText>
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
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    controlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 8,
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: 80,
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    hint: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
    },
});

