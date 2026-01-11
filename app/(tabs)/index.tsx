import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import Histogram from '@/components/Histogram/Histogram';
import { useSensorsStore } from '@/store/useSensorsStore';
import HeaderInfo from '@/components/Dashboard/HeaderInfo';
import FooterInfo from '@/components/Dashboard/FooterInfo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { startBLE } from '@/services/ble';
import { useBLEStore } from '@/store/useBLEStore';

export default function DashboardScreen() {
    const sensors = useSensorsStore(s => s.sensors);
    const { status, deviceName, error } = useBLEStore();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const stop = startBLE(__DEV__ ? 'mock' : 'real');
        return () => stop?.();
    }, []);

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
            ]}
        >
            {/* BLE STATUS INDICATOR */}
            <View style={styles.bleStatus}>
                <Text
                    style={[
                        styles.bleText,
                        status === 'connected' && styles.connected,
                        status === 'error' && styles.error,
                    ]}
                >
                    BLE: {status}
                    {deviceName ? ` (${deviceName})` : ''}
                </Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <HeaderInfo />

            <ThemedView style={styles.content}>
                <Histogram data={sensors} />
            </ThemedView>

            <FooterInfo />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 4,
    },
    bleStatus: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    bleText: {
        fontSize: 14,
        color: '#ffaa00',
    },
    connected: {
        color: '#00ff88',
    },
    error: {
        color: '#ff4444',
    },
    errorText: {
        fontSize: 12,
        color: '#ff4444',
        marginTop: 2,
    },
});
