import { FBM } from "ts-noise"
import vec2 from "tsm/src/vec2.ts"

export type TerrainGenerationParams = {
  seed: number
  scale: number,
  persistance: number,
  lacunarity: number,
  octaves: number,
  redistribution: number
}

export class Terrain {
  noise: FBM

  public constructor(params: TerrainGenerationParams) {
    this.noise = new FBM({
      seed: params.seed,
      scale: params.scale,
      persistance: params.persistance,
      lacunarity: params.lacunarity,
      octaves: params.octaves,
      redistribution: params.redistribution
    })
  }

  public sample(pos: vec2): number {
    return this.noise.get2([pos.x, pos.y])
  }
}
