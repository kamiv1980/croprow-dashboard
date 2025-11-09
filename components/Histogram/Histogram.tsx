import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, useWindowDimensions, PanResponder, View, Text } from 'react-native';
import { SensorState, useSensorsStore } from '@/store/useSensorsStore';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/ThemeContext";
import AnimatedBar from "@/components/Histogram/AnimatedBar";
import { Colors } from "@/constants/themes";

type Props = {
  data: SensorState[];
};

export default function Histogram({ data }: Props) {
  const normFromStore = useSensorsStore(s => s.normLine);
  const setNormInStore = useSensorsStore(s => s.setNormLine);
  const { width, height } = useWindowDimensions();
  const { actualTheme } = useTheme();

  const isLandscape = width > height;
  const itemsPerRow = isLandscape ? 32 : 20;

  const rows: SensorState[][] = [];
  for (let i = 0; i < data.length; i += itemsPerRow) {
    rows.push(data.slice(i, i + itemsPerRow));
  }

  const availableHeight = height * 0.6;
  const rowHeight = rows.length > 1 ? availableHeight / rows.length : availableHeight;
  const max = Math.max(...data.map(d => d.grains), 1);

  const [norm, setNorm] = useState(normFromStore);
  const [containerHeight, setContainerHeight] = useState(availableHeight);
  const prevDataLength = useRef(data.length);
  const prevScreenHeight = useRef(height);
  const currentNorm = useRef(normFromStore);

  const normTop = useSharedValue(containerHeight - (normFromStore / max) * containerHeight);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    normTop.value = containerHeight - (normFromStore / max) * containerHeight;
    setNorm(normFromStore);
    currentNorm.current = normFromStore;
  }, [normFromStore, max, containerHeight]);

  const handleLayout = (event: any) => {
    const { height: layoutHeight } = event.nativeEvent.layout;

    const isFirstRender = containerHeight === availableHeight;
    const dataLengthChanged = prevDataLength.current !== data.length;
    const screenHeightChanged = prevScreenHeight.current !== height;

    if (layoutHeight > 0 && (isFirstRender || dataLengthChanged || screenHeightChanged)) {
      setContainerHeight(layoutHeight);
      prevDataLength.current = data.length;
      prevScreenHeight.current = height;
    }
  };

  const initialTop = useRef(0);

  const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          isDragging.value = true;
          initialTop.current = normTop.value;
        },
        onPanResponderMove: (_, gestureState) => {
          let newTop = initialTop.current + gestureState.dy;
          newTop = Math.max(0, Math.min(newTop, containerHeight));
          normTop.value = newTop;

          const newNorm = Math.round(((containerHeight - newTop) / containerHeight) * max);
          const clampedNorm = Math.max(0, Math.min(newNorm, max));
          currentNorm.current = clampedNorm;
          setNorm(clampedNorm);
        },
        onPanResponderRelease: () => {
          isDragging.value = false;
          setNormInStore(currentNorm.current);
        },
      })
  ).current;

  const normLineStyle = useAnimatedStyle(() => ({
    top: normTop.value,
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: isDragging.value
        ? (actualTheme === 'dark' ? '#FFD700' : '#FF4500')
        : (actualTheme === 'dark' ? '#888888' : '#00000066'),
    zIndex: 1000,
  }));

  const normLabelStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: normTop.value - 20,
    right: 8,
    zIndex: 1001,
    backgroundColor: actualTheme === 'dark' ? '#000000AA' : '#FFFFFFAA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  }));

  return (
      <ThemedView style={styles.wrapper}>
        <View
            style={[styles.chartContainer, { height: availableHeight }]}
            onLayout={handleLayout}
        >
          {rows.map((rowData, rowIndex) => (
              <ThemedView key={rowIndex} style={[styles.row, { height: rowHeight }]}>
                {rowData.map((d) => {
                  const heightPercent = Math.min(100, Math.round((d.grains / (max * 1.15)) * 100));
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

          <Animated.View
              {...panResponder.panHandlers}
              style={normLineStyle}
          />

          <Animated.View style={normLabelStyle} pointerEvents="none">
            <Text style={[styles.normLabel, { color: actualTheme === 'dark' ? '#FFF' : '#333' }]}>
              Norm: {norm}
            </Text>
          </Animated.View>
        </View>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center'
  },
  chartContainer: {
    width: '100%',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 10
  },
  normLabel: {
    fontSize: 12,
    fontWeight: '600'
  },
});
