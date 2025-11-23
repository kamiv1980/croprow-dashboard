import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";
import {Pressable, StyleSheet} from "react-native";
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import React from "react";

type SettingItemProps = {
    title: string;
    value?: string;
    onPress: () => void;
};

function SettingItem({ title, value, onPress }: SettingItemProps) {
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];

    return (
        <Pressable
            style={[styles.item, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
            onPress={onPress}
        >
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedView style={styles.valueContainer}>
                {value && <ThemedText style={styles.value}>{value}</ThemedText>}
                <IconSymbol size={28} name="chevron.right" color={colors.icon} />
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 16,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent',
    },
    value: {
        fontSize: 16,
        opacity: 0.6,
    },
});

export default SettingItem;
