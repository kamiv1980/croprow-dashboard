export type UnitsSystem = 'metric' | 'imperial';

// distance
export const kmToMiles = (km: number) => km * 0.621371;
export const milesToKm = (miles: number) => miles / 0.621371;

// volume
export const litersToGallons = (liters: number) => liters * 0.264172;
export const gallonsToLiters = (gallons: number) => gallons / 0.264172;

// weight
export const kgToLb = (kg: number) => kg * 2.20462;
export const lbToKg = (lb: number) => lb / 2.20462;
