import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsState = {
  language: string;
  theme: 'dark'|'light'|'system';
  units: 'metric'|'imperial';
  sensorCount: number;
  setLanguage: (l: string) => void;
  setTheme: (t: SettingsState['theme']) => void;
  setUnits: (u: SettingsState['units']) => void;
  setSensorCount: (n: number) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'en',
  theme: 'system',
  units: 'metric',
  sensorCount: 8,
  setLanguage: (l) => { set({ language: l }); AsyncStorage.setItem('language', l); },
  setTheme: (t) => { set({ theme: t }); AsyncStorage.setItem('theme', t); },
  setUnits: (u) => { set({ units: u }); AsyncStorage.setItem('units', u); },
  setSensorCount: (n) => { set({ sensorCount: n }); AsyncStorage.setItem('sensorCount', String(n)); },
}));
