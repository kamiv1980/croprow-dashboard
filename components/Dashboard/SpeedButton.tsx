import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemedText} from "@/components/themed-text";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";
import {GradientLayout} from "@/components/HeaderInfo/GradientLayout";

export default function SpeedButton(){
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];

    // placeholders for speed/heading
    const speed = 12.3;
    const direction = 'NW'
    const unit = 'km/h'

    return (
        <GradientLayout onClick={() => alert('Coming soon!')}>
            <View style={styles.container}>
                <View style={styles.section}>
                    <ThemedText type="title">{speed}</ThemedText>
                    <ThemedText type="defaultSemiBold" style={{color:colors.icon}}>{unit}</ThemedText>
                </View>
                <View style={styles.section}>
                    <IconSymbol size={40} name="gauge.open.with.lines.needle.33percent" color={colors.icon} />
                    <View style={styles.direction}>
                        <IconSymbol size={24} name="location.north.circle.fill" color={colors.primary} />
                        <ThemedText type="defaultSemiBold" style={{color: colors.primary}} >
                            {direction}
                        </ThemedText>
                    </View>
                </View>
            </View>
        </GradientLayout>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    section: { alignItems: 'center', justifyContent: 'space-between'},
    direction: {flexDirection: 'row', alignItems: 'center'}
});
