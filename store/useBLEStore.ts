import { create } from 'zustand';

interface BLEState {
  isConnected: boolean;
  deviceName?: string;
  connect: (deviceName: string) => void;
  disconnect: () => void;
}

export const useBLEStore = create<BLEState>((set) => ({
  isConnected: false,
  deviceName: undefined,
  connect: (deviceName) => set({ isConnected: true, deviceName }),
  disconnect: () => set({ isConnected: false, deviceName: undefined }),
}));
