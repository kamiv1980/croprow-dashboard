import AnimatedBar from "@/components/Histogram/AnimatedBar";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/themes";
import { useTheme } from "@/contexts/ThemeContext";
import { SensorState, useSensorsStore } from '@/store/useSensorsStore';
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
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

  // normTop позиціонується відносно одного ряду
  const normTop = useSharedValue(rowHeight - (normFromStore / max) * rowHeight);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    normTop.value = rowHeight - (normFromStore / max) * rowHeight;
    setNorm(normFromStore);
    currentNorm.current = normFromStore;
  }, [normFromStore, max, rowHeight]);

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
  const rowHeightRef = useRef(rowHeight);
  const maxRef = useRef(max);

  useEffect(() => {
    rowHeightRef.current = rowHeight;
  }, [rowHeight]);

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
          const currentRowHeight = rowHeightRef.current;
          const currentMax = maxRef.current;

          let newTop = initialTop.current + gestureState.dy;
          newTop = Math.max(0, Math.min(newTop, currentRowHeight));
          normTop.value = newTop;

          const newNorm = Math.round(((currentRowHeight - newTop) / currentRowHeight) * currentMax);
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

  // Лінія норми всередину ряду
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

  // Hit area всередину ряду для перетягування
  const normLineHitAreaStyle = useAnimatedStyle(() => ({
    top: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
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
          {/* Рядки з датчиками */}
          {rows.map((rowData, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { height: rowHeight, position: 'relative' }]}>
                {/* Hit area для перетягування - всередину ряду */}
                <Animated.View
                    {...panResponder.panHandlers}
                    style={normLineHitAreaStyle}
                />

                {/* Датчики */}
                <ThemedView style={styles.barsContainer}>
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

                {/* Лінія норми всередину ряду */}
                <Animated.View
                    style={normLineStyle}
                    pointerEvents="none"
                />

                {/* Лейбл - показується тільки при перетягуванні */}
                {isDragging.value && (
                    <Animated.View style={normLabelStyle} pointerEvents="none">
                      <ThemedText type="defaultSemiBold">{norm}</ThemedText>
                    </Animated.View>
                )}
              </View>
          ))}
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 10,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
  },
});
