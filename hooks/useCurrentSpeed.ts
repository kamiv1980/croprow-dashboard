import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

interface SpeedData {
    speed: number; // km/h
    heading: number | null; 
}

interface UseSpeedOptions {
    enableHighAccuracy?: boolean;
    distanceInterval?: number;
    timeInterval?: number;
}

export const useCurrentSpeed = (options: UseSpeedOptions = {}) => {
    const {
        enableHighAccuracy = true,
        distanceInterval = 10,
        timeInterval = 1000,
    } = options;

    const [speedData, setSpeedData] = useState<SpeedData>({
        speed: 0,
        heading: null,
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        let isMounted = true;

        const requestPermissions = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    setError('Permission to access location was denied');
                    setIsLoading(false);
                    return;
                }

                if (isMounted) {
                    setHasPermission(true);
                    setIsLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Unknown error');
                    setIsLoading(false);
                }
            }
        };

        requestPermissions();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!hasPermission) return;

        const startTracking = async () => {
            try {
                subscriptionRef.current = await Location.watchPositionAsync(
                    {
                        accuracy: enableHighAccuracy
                            ? Location.Accuracy.BestForNavigation
                            : Location.Accuracy.High,
                        distanceInterval,
                        timeInterval,
                    },
                    (location) => {
                        const speedMps = location.coords.speed || 0;
                        const speedKmh = speedMps * 3.6;
                        const heading = location.coords.heading;

                        setSpeedData({
                            speed: Math.max(0, speedKmh),
                            heading: heading !== undefined && heading >= 0 ? heading : null,
                        });
                    }
                );
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to track speed');
            }
        };

        startTracking();

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.remove();
                subscriptionRef.current = null;
            }
        };
    }, [hasPermission, enableHighAccuracy, distanceInterval, timeInterval]);

    return {
        speed: speedData.speed,
        heading: speedData.heading,
        isLoading,
        hasPermission,
        error,
    };
};
