import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";
import {GradientLayout} from "@/components/HeaderInfo/GradientLayout";

export default function ShaftButton(){
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];

    // placeholders for shaft
    const value = '';
    const unit = 'rpm'

    return (
        <GradientLayout onClick={() => alert('Coming soon!')}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <ThemedText type="subtitle">{value || '!'}</ThemedText>
                    <ThemedText type="defaultSemiBold" style={{color:colors.icon}}>{unit}</ThemedText>
                </View>
                    <IconSymbol size={52} name="gearshape.arrow.trianglehead.2.clockwise.rotate.90" color={value ? colors.icon : colors.danger} />
            </View>
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    section: { alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
