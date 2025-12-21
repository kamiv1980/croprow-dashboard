export const getDirection = (heading: number | null): string => {
    if (heading === null) return 'N/A';

    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
};
