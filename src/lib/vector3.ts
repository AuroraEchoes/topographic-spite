// Vector3 implementation is all my own, based on the Vector2 one

export interface Vec3 { x: number, y: number, z: number }

function make(x: number, y: number, z: number): Vec3 {
  return { x, y, z }
}

function add(a: Vec3, b: Vec3): Vec3 {
  return make(a.x + b.x, a.y + b.y, a.z + b.z)
}

function scale(a: Vec3, s: number): Vec3 {
  return make(a.x * s, a.y * s, a.z * s)
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return add(a, scale(b, -1))
}

function mult(a: Vec3, b: Vec3): Vec3 {
  return make(a.x * b.x, a.y * b.y, a.z * b.z)
}

function len(a: Vec3): number {
  return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z)
}

function normalize(a: Vec3): Vec3 {
  const l = len(a)
  if (l == 0) {
    return make(1, 0, 0)
  } else {
    return scale(a, 1 / l)
  }
}

function distance(a: Vec3, b: Vec3): number {
  return len(sub(b, a))
}

function distanceSquared(a: Vec3, b: Vec3): number {
  const v = sub(b, a)
  return dot(v, v)
}

function ray(a: Vec3, b: Vec3): Vec3 {
  return normalize(sub(b, a))
}

function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return make(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  )
}

function perpendicular(a: Vec3): Vec3 {
  const reference = Math.abs(a.x) < 0.9 ? make(1, 0, 0) : make(0, 1, 0)
  return normalize(cross(a, reference))
}

function rotate(v: Vec3, axis: Vec3, t: number): Vec3 {
  const k = normalize(axis)
  const ct = Math.cos(t)
  const st = Math.sin(t)
  return add(
    add(scale(v, ct), scale(cross(k, v), st)),
    scale(k, dot(k, v) * (1 - ct))
  )
}

function angle(a: Vec3, b: Vec3): number {
  const d = dot(normalize(a), normalize(b))
  return Math.acos(Math.min(Math.max(d, -1), 1))
}

function rotateToward(a: Vec3, b: Vec3, t: number): Vec3 {
  const full = angle(a, b)

  if (full == 0 || full < t) {
    return b
  } else {
    const normal = cross(a, b)
    const axis = len(normal) == 0 ? perpendicular(a) : normal
    return rotate(a, axis, t)
  }
}

function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const d = sub(b, a)
  return add(a, scale(d, t))
}

function isEqual(a: Vec3, b: Vec3): boolean {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) < 0.000001
}

function zero(): Vec3 {
  return make(0, 0, 0)
}

function randomRay(): Vec3 {
  const z = 2 * Math.random() - 1
  const t = 2 * Math.PI * Math.random()
  const r = Math.sqrt(1 - z * z)
  return make(r * Math.cos(t), r * Math.sin(t), z)
}

function modScalar(a: Vec3, b: number): Vec3 {
  return make(a.x % b, a.y % b, a.z % b)
}

function rayFromAngles(t: number, p: number): Vec3 {
  return make(Math.sin(p) * Math.cos(t), Math.sin(p) * Math.sin(t), Math.cos(p))
}

export default {
  make,
  add,
  scale,
  mult,
  sub,
  len,
  normalize,
  distance,
  distanceSquared,
  ray,
  dot,
  cross,
  perpendicular,
  rotate,
  angle,
  rayFromAngles,
  rotateToward,
  lerp,
  isEqual,
  zero,
  randomRay,
  modScalar
}
