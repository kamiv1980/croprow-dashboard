import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { SensorState, useSensorsStore } from '@/store/useSensorsStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/themes";
import { useTheme } from "@/contexts/ThemeContext";
import { hexToRgba } from "@/utils/hexToRgb";

type AnimatedBarProps = {
  sensor: SensorState;
  heightPercent: number;
  containerHeight: number;
};

function AnimatedBar({ sensor, heightPercent, containerHeight }: AnimatedBarProps) {
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

type Props = {
  data: SensorState[];
};

export default function Histogram({ data }: Props) {
  const norm = useSensorsStore(s => s.normLine);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const itemsPerRow = isLandscape ? 32 : 20;

  const rows: SensorState[][] = [];
  for (let i = 0; i < data.length; i += itemsPerRow) {
    rows.push(data.slice(i, i + itemsPerRow));
  }

  const availableHeight = height * 0.6;
  const rowHeight = rows.length > 1 ? availableHeight / rows.length : availableHeight;

  const max = Math.max(...data.map(d => d.grains), 1);

  return (
      <ThemedView style={styles.wrapper}>
        {rows.map((rowData, rowIndex) => (
            <ThemedView key={rowIndex} style={[styles.row, { height: rowHeight }]}>
              {rowData.map((d) => {
                const heightPercent = Math.min(
                    100,
                    Math.round((d.grains / (max * 1.15)) * 100)
                );

                return (
                    <AnimatedBar
                        key={d.id}
                        sensor={d}
                        heightPercent={heightPercent}
                        containerHeight={rowHeight}
                    />
                );
              })}
            </ThemedView>
        ))}
        <View style={styles.normRow}>
          <View style={[styles.normLine, { left: 0, right: 0 }]} />
          <Text style={styles.normLabel}>Norm: {norm}</Text>
        </View>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', alignItems: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 10,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  label: { marginTop: 6, fontSize: 10 },
  normRow: {
    position: 'relative',
    width: '100%',
    marginTop: 8,
    alignItems: 'center'
  },
  normLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#00000066',
    top: -20
  },
  normLabel: { fontSize: 12, color: '#333' }
});
