import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";
import {GradientLayout} from "@/components/Dashboard/GradientLayout";

export default function FanButton(){
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];

    // placeholders for fan
    const value = 2500;
    const unit = 'rpm'

    return (
        <GradientLayout onClick={() => alert('Coming soon!')}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <ThemedText type="subtitle">{value || '!'}</ThemedText>
                    <ThemedText type="defaultSemiBold" style={{color:colors.icon}}>{unit}</ThemedText>
                </View>
                    <IconSymbol size={52} name="fan" color={value ? colors.icon : colors.danger} />
            </View>
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    section: { alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
