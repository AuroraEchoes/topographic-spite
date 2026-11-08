// Vector2 implementation based on https://github.com/mcrowe/vector2

export interface Vec2 { x: number, y: number }
export interface PolarVec2 { t: number, r: number }

function make(x: number, y: number): Vec2 {
  return { x, y }
}

function add(a: Vec2, b: Vec2): Vec2 {
  return make(a.x + b.x, a.y + b.y)
}


function scale(a: Vec2, s: number): Vec2 {
  return make(a.x * s, a.y * s)
}

function sub(a: Vec2, b: Vec2): Vec2 {
  return add(a, scale(b, -1))
}

function mult(a: Vec2, b: Vec2): Vec2 {
  return make(a.x * b.x, a.y * b.y)
}


function len(a: Vec2): number {
  return Math.sqrt(a.x * a.x + a.y * a.y)
}

function normalize(a: Vec2): Vec2 {
  const l = len(a)
  if (l == 0) {
    return make(1, 0)
  } else {
    return scale(a, 1 / l)
  }
}

function distance(a: Vec2, b: Vec2): number {
  return len(sub(b, a))
}


function distanceSquared(a: Vec2, b: Vec2): number {
  const v = sub(b, a)
  return dot(v, v)
}

// Ray from a to b
function ray(a: Vec2, b: Vec2): Vec2 {
  return normalize(sub(b, a))
}


function dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y
}


// Rotate vector v by t radians
function rotate(v: Vec2, t: number): Vec2 {
  const ct = Math.cos(t)
  const st = Math.sin(t)
  return make(ct * v.x - st * v.y, st * v.x + ct * v.y)
}

function angle(a: Vec2, b: Vec2): number {
  const t = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x)

  if (t < 0) {
    return 2 * Math.PI + t
  } else {
    return t
  }
}


function rayFromAngle(t: number): Vec2 {
  return make(Math.cos(t), Math.sin(t))
}


// Rotate from a towards b, by a maximum of 't' radians.
function rotateToward(a: Vec2, b: Vec2, t: number): Vec2 {
  const full = angle(a, b)

  if (full == 0 || Math.abs(full) < t) {
    return b
  } else {
    if (full > Math.PI) {
      return rotate(a, -t)
    } else {
      return rotate(a, t)
    }
  }
}


function lerp(a: Vec2, b: Vec2, t: number): Vec2 {
  const d = sub(b, a)
  return add(a, scale(d, t))
}


function isEqual(a: Vec2, b: Vec2): boolean {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) < 0.000001
}


function zero(): Vec2 {
  return make(0, 0)
}


function randomRay(): Vec2 {
  const t = 2 * Math.PI * Math.random()
  return rotate(make(1, 0), t)
}

function modScalar(a: Vec2, b: number) {
  return make(a.x % b, a.y % b)
}


function fromPolar(v: PolarVec2): Vec2 {
  return scale(rayFromAngle(v.t), v.r)
}


function toPolar(v: Vec2): PolarVec2 {
  return {
    t: Math.atan2(v.y, v.x),
    r: len(v)
  }
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
  rotate,
  angle,
  rayFromAngle,
  rotateToward,
  lerp,
  isEqual,
  zero,
  randomRay,
  fromPolar,
  toPolar,
  modScalar
}
