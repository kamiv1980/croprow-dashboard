import {Pressable, StyleSheet} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import {hexToRgba} from "@/utils/hexToRgb";
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";

export const GradientLayout = ({onClick, children}) => {
    const { actualTheme } = useTheme();
    const { border, card, seedActive } = Colors[actualTheme];

    return (
        <Pressable
            onLongPress={onClick}
            style={styles.container}
        >
            <LinearGradient
                colors={[hexToRgba(border, 1), hexToRgba(card, 1)]}
                style={[styles.gradient, {borderColor: seedActive}]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                {children}
            </LinearGradient>
        </Pressable>

    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 2
    },
    gradient: {
        height: 92,
        width: '100%',
        paddingVertical: 8,
        borderRadius: 16,
        paddingHorizontal: 12,
        borderStyle: 'solid',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
