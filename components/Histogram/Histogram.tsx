import AnimatedBar from "@/components/Histogram/AnimatedBar";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/themes";
import { useTheme } from "@/contexts/ThemeContext";
import { SensorState, useSensorsStore } from '@/store/useSensorsStore';
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import {ThemedText} from "@/components/themed-text";

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
  const containerHeightRef = useRef(containerHeight);
  const maxRef = useRef(max);

  useEffect(() => {
    containerHeightRef.current = containerHeight;
  }, [containerHeight]);

  useEffect(() => {
    maxRef.current = max;
  }, [max]);

  const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          isDragging.value = true;
          initialTop.current = normTop.value;
        },
        onPanResponderMove: (_, gestureState) => {
          const currentContainerHeight = containerHeightRef.current;
          const currentMax = maxRef.current;

          let newTop = initialTop.current + gestureState.dy;
          newTop = Math.max(0, Math.min(newTop, currentContainerHeight));
          normTop.value = newTop;

          const newNorm = Math.round(((currentContainerHeight - newTop) / currentContainerHeight) * currentMax);
          const clampedNorm = Math.max(0, Math.min(newNorm, currentMax));

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
    height: isDragging.value ? 4 : 2,
    borderRadius: 2,
    backgroundColor: isDragging.value
        ? Colors[actualTheme].tint
        : Colors[actualTheme].text,
    zIndex: 1001,
  }));

  const normLineHitAreaStyle = useAnimatedStyle(() => ({
    top: normTop.value - 25,
    position: 'absolute',
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1000,
  }));

  const normLabelStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: normTop.value - 28,
    right: 4,
    zIndex: 1001,
    backgroundColor: Colors[actualTheme].background,
    paddingHorizontal: 4,
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
              style={normLineHitAreaStyle}
          />

          <Animated.View
              style={normLineStyle}
              pointerEvents="none"
          />
          {isDragging.value &&
            <Animated.View style={normLabelStyle} pointerEvents="none">
              <ThemedText type="defaultSemiBold">{norm}</ThemedText>
            </Animated.View>
          }
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
});
