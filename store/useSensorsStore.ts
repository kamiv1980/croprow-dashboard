import { create } from 'zustand';

export type SensorState = {
  id: number;
  state: 'working' | 'offline' | 'clogged' | 'disabled';
  grains: number;
};

type SensorsStore = {
  sensors: SensorState[];
  setSensors: (s: SensorState[]) => void;
  normLine: number;
  setNormLine: (n: number) => void;
};

export const useSensorsStore = create<SensorsStore>((set) => ({
  sensors: [],
  setSensors: (s) => set({ sensors: s }),
  normLine: 100,
  setNormLine: (n) => set({ normLine: n }),
}));
