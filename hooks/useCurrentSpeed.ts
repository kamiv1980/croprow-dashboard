import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

export const useCurrentSpeed = () => {
    const [speed, setSpeed] = useState(0);
    const [heading, setHeading] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const lastLocationRef = useRef<Location.LocationObject | null>(null);
    const lastSpeedRef = useRef(0);
    const subRef = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        let mounted = true;

        const start = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Location permission denied');
                return;
            }

            subRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 500,
                    distanceInterval: 0,
                },
                (loc) => {
                    if (!mounted) return;

                    const prev = lastLocationRef.current;
                    lastLocationRef.current = loc;
                    setHeading(loc.coords.heading ?? null);

                    if (!prev) return;

                    const dt = (loc.timestamp - prev.timestamp) / 1000;
                    if (dt <= 0) return;

                    const distance = haversine(
                        prev.coords.latitude,
                        prev.coords.longitude,
                        loc.coords.latitude,
                        loc.coords.longitude
                    );

                    let speedKmh = (distance / dt) * 3.6;
                    if (speedKmh < 0.5) speedKmh = 0;

                    const smoothing = getSmoothing(speedKmh);
                    const smoothSpeed =
                        lastSpeedRef.current * smoothing +
                        speedKmh * (1 - smoothing);

                    lastSpeedRef.current = smoothSpeed;
                    setSpeed(Number(smoothSpeed.toFixed(1)));
                }
            );
        };

        start();

        return () => {
            mounted = false;
            subRef.current?.remove();
        };
    }, []);

    return { speed, heading, error };
};

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getSmoothing = (speed: number) => {
    if (speed < 3) return 0.9;
    if (speed < 10) return 0.75;
    if (speed < 40) return 0.6;
    return 0.45;
};
