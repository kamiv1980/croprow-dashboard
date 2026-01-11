import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useBLEStore } from '@/store/useBLEStore';
import Histogram from '@/components/Histogram/Histogram';
import { useSensorsStore } from '@/store/useSensorsStore';
import { bleMockStart } from '@/services/ble/bleService';
import HeaderInfo from '@/components/Dashboard/HeaderInfo';
import {simulateSensorUpdates} from "@/utils/mock-data";
import FooterInfo from "@/components/Dashboard/FooterInfo";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {startBLE} from "@/services/ble";

export default function DashboardScreen( ) {
  const connect = useBLEStore(s => s.connect);
  const sensors = useSensorsStore(s => s.sensors);
    const setSensors = useSensorsStore(s => s.setSensors);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const stop = startBLE(__DEV__ ? 'mock' : 'real');
        return () => stop?.();
    }, []);

    useEffect(() => {
        return simulateSensorUpdates(setSensors, 3000);
    }, [setSensors]);


  //   useEffect(() => {
  //   // start mock BLE stream for demo
  //   const stop = bleMockStart();
  //   return () => stop();
  // }, []);

  return (
      <SafeAreaView style={[
          styles.container,
          {
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
          },
      ]}>
        <HeaderInfo />
        <ThemedView style={styles.content}>
          <Histogram data={sensors} />
        </ThemedView>
          <FooterInfo />

      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 4 },
});
