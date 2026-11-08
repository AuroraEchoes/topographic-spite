import { UberNoise } from "uber-noise"
import { type Vec2 } from "../lib/vector2.ts"

const COORDINATE_OFFSET = 2 ** 16;

export type TerrainGenerationParams = {
  seed: number
  scale: number,
  persistance: number,
  lacunarity: number,
  octaves: number,
  redistribution: number
}

export class Terrain {
  noise: UberNoise
  cached: Map<number, number>

  public constructor(params: TerrainGenerationParams) {
    this.noise = new UberNoise({
      seed: params.seed,
      min: 0,
      max: 1,
      scale: params.scale,
      lacunarity: params.lacunarity,
      octaves: params.octaves,
    })
    this.cached = new Map<number, number>()
  }

  public sample(pos: Vec2): number {
    const key = this.key(pos)
    const cachedVal = this.cached.get(key)
    if (cachedVal !== undefined) {
      return cachedVal!
    }
    else {
      const sample = this.noise.get(pos.x, pos.y)
      this.cached.set(key, sample)
      // console.log("Caching new position", pos.x, pos.y, "w/ key", key, " size ", this.cached.size)
      return sample
    }
  }

  private key(pos: Vec2): number {
    return (pos.x * COORDINATE_OFFSET) + pos.y
  }
}
