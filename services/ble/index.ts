import { bleMockStart } from './bleService';
import { bleRealStart } from './bleRealService';

export type BLEMode = 'mock' | 'real';

export function startBLE(mode: BLEMode = 'mock') {
    if (mode === 'real') {
        return bleRealStart();
    }
    return bleMockStart();
}
