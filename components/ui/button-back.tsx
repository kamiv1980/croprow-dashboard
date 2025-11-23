import {IconSymbol} from "@/components/ui/icon-symbol";
import React from "react";
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";
import {useRouter} from 'expo-router';
import {Pressable} from "react-native";

export const ButtonBack = () => {
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];
    const router = useRouter();

    return (
            <Pressable onPress={() => router.back()}>
                <IconSymbol size={28} name="chevron.left" color={colors.icon} />
            </Pressable>
    )
}
