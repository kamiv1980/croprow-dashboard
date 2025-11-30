import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";
import {GradientLayout} from "@/components/Dashboard/GradientLayout";

export default function HooperButton(){
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];

    // placeholders for hooper
    const value = 1;

    return (
        <GradientLayout onClick={() => alert('Coming soon!')}>
            <View style={styles.container}>
                <IconSymbol size={52} name="tray.fill" color={colors.icon} />
                <ThemedText type="subtitle">{value}</ThemedText>
            </View>
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'space-between'},
});
