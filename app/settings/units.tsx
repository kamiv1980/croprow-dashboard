import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/themes';
import {IconSymbol} from "@/components/ui/icon-symbol";
import {UNITS} from "@/constants/units";
import {useUnits} from "@/contexts/UnitsContext";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {UnitsSystem} from "@/utils/unitConverters";

export default function UnitsSettingsScreen() {
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];
    const { system, setSystem } = useUnits();
    const insets = useSafeAreaInsets();

    return (
        <ThemedView style={[
            styles.container,
        {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }]
        }>
            {UNITS.map((unit) => (
                <Pressable
                    key={unit.value}
                    style={[
                        styles.option,
                        {backgroundColor: colors.card}
                    ]}
                    onPress={() => setSystem(unit.value as UnitsSystem)}
                >
                    <ThemedText style={[
                        styles.optionText,
                        system === unit.value &&
                            {color: colors.primary}
                    ]}>{unit.label}</ThemedText>
                    {system === unit.value && (
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
