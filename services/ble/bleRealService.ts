import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { useSensorsStore } from '@/store/useSensorsStore';
import { decodeSensorBuffer } from '../protobuf/decodeSensorData';

const manager = new BleManager();

// TODO: подставишь реальные значения
const TARGET_DEVICE_NAME = 'YOUR_DEVICE_NAME';
const SERVICE_UUID = '0000fe40-cc7a-482a-984a-7f2ed5b3e58f';
const CHARACTERISTIC_UUID = '0000fe42-8e22-4541-9d4c-21edae82ed19';

let device: Device | null = null;

export async function bleRealStart() {
    const setSensors = useSensorsStore.getState().setSensors;

    console.log('[BLE] start scan');

    manager.startDeviceScan(null, null, async (error, scannedDevice) => {
        if (error) {
            console.error('[BLE] scan error', error);
            return;
        }

        // if (!scannedDevice?.name?.includes(TARGET_DEVICE_NAME)) return;

        console.log('[BLE] device found:', scannedDevice.name);

        manager.stopDeviceScan();

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

                    // 🔍 1. RAW base64
                    console.log('[BLE] raw base64:', characteristic.value);

                    // 🔍 2. RAW bytes
                    const buffer = Buffer.from(characteristic.value, 'base64');
                    console.log('[BLE] raw bytes:', buffer);

                    // 🔍 3. Попробуем protobuf (можно временно закомментировать)
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

    return () => {
        console.log('[BLE] stop');
        manager.stopDeviceScan();
        device?.cancelConnection();
        manager.destroy();
    };
}
