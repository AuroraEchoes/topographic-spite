import { UberNoise } from "uber-noise"
import { type Vec2 } from "../lib/vector.ts"

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
  cached: Map<Vec2, number>

  public constructor(params: TerrainGenerationParams) {
    this.noise = new UberNoise({
      seed: params.seed,
      min: 0,
      max: 1,
      scale: params.scale,
      lacunarity: params.lacunarity,
      octaves: params.octaves,
    })
    this.cached = new Map<Vec2, number>()
  }

  public sample(pos: Vec2): number {
    const cachedVal = this.cached.get(pos)
    if (cachedVal !== undefined) {
      return cachedVal!
    }
    else {
      const sample = this.noise.get(pos.x, pos.y)
      this.cached.set(pos, sample)
      return sample
    }
  }
}
