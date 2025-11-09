import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, useWindowDimensions, PanResponder} from 'react-native';
import { SensorState, useSensorsStore } from '@/store/useSensorsStore';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/themes";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/hexToRgb";

type AnimatedBarProps = {
    sensor: SensorState;
    heightPercent: number;
    containerHeight: number;
};

export default function AnimatedBar({ sensor, heightPercent, containerHeight }: AnimatedBarProps) {
    const animatedHeight = useSharedValue(0);
    const { actualTheme } = useTheme();
    const { seedActive, seedOffline, seedClogged, background, text } = Colors[actualTheme];

    useEffect(() => {
        const targetHeight = sensor.state === 'disabled' ? 10 : heightPercent;
        animatedHeight.value = withTiming(targetHeight, {
            duration: 400,
        });
    }, [heightPercent, sensor.state]);

    const animatedStyle = useAnimatedStyle(() => ({
        height: `${animatedHeight.value}%`,
    }));

    const getGradientColors = () => {
        switch (sensor.state) {
            case 'working':
                return [hexToRgba(seedActive, 1), hexToRgba(seedActive, 0.1)];
            case 'clogged':
                return [hexToRgba(seedClogged, 1), hexToRgba(seedClogged, 0.1)];
            case 'offline':
                return [hexToRgba(seedOffline, 1), hexToRgba(seedOffline, 1)];
            case 'disabled':
                return [hexToRgba(background, 1), hexToRgba(text, 0.3)];
            default:
                return [background];
        }
    };

    const gradientStyle = sensor.state === 'offline'
        ? { height: '100%' }
        : animatedStyle;

    return (
        <Pressable
            onLongPress={() => alert(`Sensor #${sensor.id}\nState: ${sensor.state}\nGrains: ${sensor.grains}`)}
            style={styles.barContainer}
        >
            <View style={[styles.barWrapper, { height: containerHeight }]}>
                <Animated.View style={[styles.bar, gradientStyle]}>
                    <LinearGradient
                        colors={getGradientColors()}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    />
                </Animated.View>
            </View>
            <ThemedText style={styles.label}>{sensor.id}</ThemedText>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    barContainer: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
    barWrapper: { width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
    bar: { width: '80%', borderTopLeftRadius: 6, borderTopRightRadius: 6, overflow: 'hidden' },
    gradient: { flex: 1, width: '100%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
    label: { marginTop: 6, fontSize: 10 },
});
