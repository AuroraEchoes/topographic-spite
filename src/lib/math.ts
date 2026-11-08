export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(a: number, b: number, t: number): number {
  return (1 - t) * a + t * b;
}

export function remap(inMin: number, inMax: number, outMin: number, outMax: number, val: number): number {
  return outMin + ((outMax - outMin) / (inMax - inMin)) * (val - inMin)
}
