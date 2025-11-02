import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useBLEStore } from '@/store/useBLEStore';
import Histogram from '@/components/Histogram/Histogram';
import { useSensorsStore } from '@/store/useSensorsStore';
import { bleMockStart } from '@/services/ble/bleService';
import HeaderInfo from '@/components/HeaderInfo/SpeedInfo';
import {simulateSensorUpdates} from "@/utils/mock-data";

export default function DashboardScreen() {
  // const connect = useBLEStore(s => s.connect);
  const sensors = useSensorsStore(s => s.sensors);
    const setSensors = useSensorsStore(s => s.setSensors);

    useEffect(() => {
        const cleanup = simulateSensorUpdates(setSensors, 3000);
        return cleanup;
    }, [setSensors]);


    useEffect(() => {
    // start mock BLE stream for demo
    const stop = bleMockStart();
    return () => stop();
  }, []);

  return (
      <SafeAreaView style={styles.container}>
        <HeaderInfo />
        <ThemedView style={styles.content}>
          <Histogram data={sensors} />
        </ThemedView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
});
