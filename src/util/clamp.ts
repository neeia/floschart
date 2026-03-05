/**
 *  Clamps a value between a minimum and a maximum
 * @param min - Minimum value
 * @param value - Value to clamp
 * @param max - Maximum value
 * @returns Clamped `x`, for which min < `x` < max
 */
export default function clamp(min: number, value: number, max: number) {
  return Math.min(Math.max(min, value), max);
}
