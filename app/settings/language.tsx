import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/themes';
import {IconSymbol} from "@/components/ui/icon-symbol";
import {LANGUAGES} from "@/constants/languages";
import {useLanguage} from "@/contexts/LanguageContext";

export default function LanguageSettingsScreen() {
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];
    const {language, changeLanguage} = useLanguage();

    return (
        <ThemedView style={styles.container}>
            {LANGUAGES.map((lang) => (
                <Pressable
                    key={lang.lang}
                    style={[
                        styles.option,
                        {backgroundColor: colors.card}
                    ]}
                    onPress={() => changeLanguage(lang.lang)}
                >
                    <ThemedText style={[
                        styles.optionText,
                        language === lang.lang &&
                        {color: colors.primary}
                    ]}>{lang.label}</ThemedText>
                    {language === lang.lang && (
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
