export type UnitsSystem = 'metric' | 'imperial';

// distance
export const kmToMiles = (km: number) => (km * 0.621371).toFixed(1);
export const milesToKm = (miles: number) => (miles / 0.621371).toFixed(1);

// volume
export const litersToGallons = (liters: number) => (liters * 0.264172).toFixed(1);
export const gallonsToLiters = (gallons: number) => (gallons / 0.264172).toFixed(1);

// weight
export const kgToLb = (kg: number) => (kg * 2.20462).toFixed(1);
export const lbToKg = (lb: number) => (lb / 2.20462).toFixed(1);
