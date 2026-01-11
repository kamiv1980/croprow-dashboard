import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Platform } from 'react-native';
import { useSensorsStore } from '@/store/useSensorsStore';
import { decodeSensorBuffer } from '../protobuf/decodeSensorData';

let manager: BleManager | null = null;
let device: Device | null = null;

const TARGET_DEVICE_NAME = 'AgriGate';
const SERVICE_UUID = '0000fe40-cc7a-482a-984a-7f2ed5b3e58f';
const CHARACTERISTIC_UUID = '0000fe42-8e22-4541-9d4c-21edae82ed19';

const getManager = () => {
    if (!manager) {
        manager = new BleManager();
    }
    return manager;
};

export async function bleRealStart() {
    if (Platform.OS === 'web') {
        console.warn('[BLE] not supported on web');
        return () => {};
    }

    const setSensors = useSensorsStore.getState().setSensors;
    const bleManager = getManager();

    console.log('[BLE] start scan');

    bleManager.startDeviceScan(null, null, async (error, scannedDevice) => {
        if (error) {
            console.error('[BLE] scan error', error);
            return;
        }

        if (!scannedDevice?.name?.includes(TARGET_DEVICE_NAME)) return;

        console.log('[BLE] device found:', scannedDevice.name);

        bleManager.stopDeviceScan();

        try {
            device = await scannedDevice.connect();
            await device.discoverAllServicesAndCharacteristics();

            console.log('[BLE] connected');

            device.monitorCharacteristicForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                async (error, characteristic) => {
                    if (error) {
                        console.error('[BLE] notify error', error);
                        return;
                    }

                    if (!characteristic?.value) return;

                    // 1️⃣ base64
                    console.log('[BLE] raw base64:', characteristic.value);

                    // 2️⃣ bytes
                    const buffer = Buffer.from(characteristic.value, 'base64');
                    console.log('[BLE] raw bytes:', buffer);

                    // 3️⃣ protobuf decode
                    try {
                        const decoded = await decodeSensorBuffer(buffer.buffer);
                        console.log('[BLE] decoded:', decoded);
                        setSensors(decoded);
                    } catch (e) {
                        console.warn('[BLE] decode failed', e);
                    }
                }
            );
        } catch (e) {
            console.error('[BLE] connection error', e);
        }
    });

    // cleanup
    return () => {
        console.log('[BLE] stop');
        try {
            bleManager.stopDeviceScan();
            device?.cancelConnection();
            device = null;
            bleManager.destroy();
            manager = null;
        } catch (e) {
            console.warn('[BLE] cleanup error', e);
        }
    };
}
