import { SensorState } from '../store/useSensorsStore';
import { useSettingsStore } from '../store/useSettingsStore';

export function generateMockSensors(count?: number): SensorState[] {
    const sensorCount = count ?? useSettingsStore.getState().sensorCount;
    const states: SensorState['state'][] = ['working', 'offline', 'clogged', 'disabled'];

    return Array.from({ length: sensorCount }, (_, i) => {
        const rand = Math.random();
        let state: SensorState['state'];

        if (rand < 0.7) {
            state = 'working';
        } else if (rand < 0.8) {
            state = 'clogged';
        } else if (rand < 0.9) {
            state = 'offline';
        } else {
            state = 'disabled';
        }

        let grains = 0;

        if (state === 'working') {
            grains = Math.floor(Math.random() * 30) + 85; // 85-115
        } else if (state === 'clogged') {
            grains = Math.floor(Math.random() * 40) + 30; // 30-70
        } else if (state === 'offline' || state === 'disabled') {
            grains = 0;
        }

        return {
            id: i + 1,
            state,
            grains,
        };
    });
}

export function simulateSensorUpdates(
    callback: (sensors: SensorState[]) => void,
    interval: number = 2000
) {
    const updateSensors = () => {
        callback(generateMockSensors());
    };
    
    updateSensors();

    const intervalId = setInterval(updateSensors, interval);

    return () => clearInterval(intervalId);
}
