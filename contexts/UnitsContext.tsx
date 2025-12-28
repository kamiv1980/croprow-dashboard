import React, { createContext, useContext, useMemo, useState } from 'react';
import {
    kmToMiles,
    litersToGallons,
    kgToLb,
} from '@/utils/unitConverters';
import {UnitsSystem} from "@/utils/unitConverters";

type UnitsContextValue = {
    system: UnitsSystem;
    setSystem: (s: UnitsSystem) => void;

    distance: (valueKm: number) => number;
    volume: (valueLiters: number) => number;
    weight: (valueKg: number) => number;

    distanceUnit: string;
    volumeUnit: string;
    weightUnit: string;
};

const UnitsContext = createContext<UnitsContextValue | null>(null);

export const UnitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [system, setSystem] = useState<UnitsSystem>('metric');

    const value = useMemo(
        () => ({
            system,
            setSystem,

            distance: (km: number) =>
                system === 'imperial' ? kmToMiles(km) : km.toFixed(1),

            volume: (liters: number) =>
                system === 'imperial' ? litersToGallons(liters) : liters.toFixed(1),

            weight: (kg: number) =>
                system === 'imperial' ? kgToLb(kg) : kg.toFixed(1),

            distanceUnit: system === 'imperial' ? 'mi' : 'km',
            volumeUnit: system === 'imperial' ? 'gal' : 'l',
            weightUnit: system === 'imperial' ? 'lb' : 'kg',
        }),
        [system]
    );

    return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
};

export const useUnits = () => {
    const ctx = useContext(UnitsContext);
    if (!ctx) {
        throw new Error('useUnits must be used inside UnitsProvider');
    }
    return ctx;
};
