/**
 * @param value 
 * @returns Commercially rounded value (e.g. 0.4 down, 0.5 up)
 */
export function roundCommercial(value: number) {
    return Math.round(value * 100) / 100;
}