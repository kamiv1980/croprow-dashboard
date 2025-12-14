import {Pressable, StyleSheet} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import {hexToRgba} from "@/utils/hexToRgb";
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";

export const GradientLayout = ({onClick, children}) => {
    const { actualTheme } = useTheme();
    const { border, card, seedActive, btn_border_start, btn_border_end } = Colors[actualTheme];

    return (
        <LinearGradient
            colors={[btn_border_start, btn_border_end]}
            style={styles.container}
        >
            <Pressable
                onLongPress={onClick}
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
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 2,
        borderRadius: 16,
        padding: 1,
    },
    gradient: {
        height: 92,
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
