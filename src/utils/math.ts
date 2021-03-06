export const PRECISION = 8;

export function remap(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
): number {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export function random(min: number = 0, max: number = 1): number {
  return min + Math.random() * (max - min);
}

export function randomint(min: number, max: number): number {
  return Math.floor(random(min, max));
}

export function trunc(value: number, precision = 8): number {
  return parseFloat(value.toFixed(PRECISION));
}
