import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemedText} from "@/components/themed-text";
import {ThemedView} from "@/components/themed-view";
import {IconSymbol} from "@/components/ui/icon-symbol";
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";

export default function SpeedInfo(){
    const { actualTheme } = useTheme();
    const colors = Colors[actualTheme];

    // placeholders for speed/heading
  const speed = 12.3;
  const direction = 'NW'
  return (
    <ThemedView style={styles.container}>
        <ThemedText type="defaultSemiBold" style={styles.value}>{speed}</ThemedText>

        <View style={styles.units}>
            <View style={styles.direction}>
                <IconSymbol size={24} name="location.north.circle.fill" color={colors.primary} />
                <ThemedText type="defaultSemiBold" style={{color: colors.primary}} >
                    {direction}
                </ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={{color:colors.icon}}>km/h</ThemedText>
        </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 4 },
    value: {fontSize: 64, lineHeight: 64},
    units: { paddingBottom: 8, alignItems: 'center', gap: 4},
    direction: {flexDirection: 'row', alignItems: 'center'}

});
