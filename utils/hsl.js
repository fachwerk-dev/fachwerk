/**
 * Convert HSL values to CSS HSLA color string.
 *
 * @param {number} h - Hue value (0-360).
 * @param {number} s - Saturation value (0-100).
 * @param {number} l - Lightness value (0-100).
 * @param {number} [a=1] - Alpha (opacity) value (0-1). Optional, defaults to 1 if not provided.
 * @returns {string} CSS HSL color string.
 */

export function hsl(h, s = 100, l = 50, a = 1) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}
