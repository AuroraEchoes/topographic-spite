import { clamp } from "../lib/math"
import vector2 from "../lib/vector2"
import { COLS, GRID_SIZE, HEIGHT_PER_LEVEL, LEVEL_COUNT, ROWS, SquaresTerrain3D, TOTAL_HEIGHT } from "../views/squares_terrain_3d"
import type { AmbianceContext } from "./ambiance_context"

export type AmbianceProfile = {
  name: string,
  path: string,
  startFadeInVal: number | undefined,
  endFadeInVal: number | undefined,
  startFadeOutVal: number | undefined,
  endFadeOutVal: number | undefined,
  minGain: number,
  maxGain: number,
  getValue: (ctx: AmbianceContext) => number
}

export const HIGH_ALTITUDE_WIND_AMBIANCE: AmbianceProfile = {
  name: "HIGH_WIND",
  path: "/audio/high_wind.mp3",
  startFadeInVal: 0.5,
  endFadeInVal: 0.8,
  startFadeOutVal: undefined,
  endFadeOutVal: undefined,
  minGain: 0.0,
  maxGain: 4.0,
  getValue: (ctx: AmbianceContext): number => {
    const height = ctx.view.getCamera().transform.getY()
    const heightProportional = clamp(height / TOTAL_HEIGHT, 0, 1)
    return heightProportional
  }
}

export const MEDIUM_ALTITUDE_TREE_WIND_AMBIANCE: AmbianceProfile = {
  name: "MED_TREE_WIND",
  path: "/audio/med_tree_wind.mp3",
  startFadeInVal: 0.3,
  endFadeInVal: 0.4,
  startFadeOutVal: 0.8,
  endFadeOutVal: 1.0,
  minGain: 0.0,
  maxGain: 1.5,
  getValue: (ctx: AmbianceContext): number => {
    const height = ctx.view.getCamera().transform.getY()
    const heightProportional = clamp(height / TOTAL_HEIGHT, 0, 1)
    return heightProportional
  }
}

export const GROUND_FOOTSTEPS_AMBIANCE: AmbianceProfile = {
  name: "GRND_FTSTEP",
  path: "/audio/grnd_ftstep.mp3",
  startFadeInVal: -0.2,
  endFadeInVal: -0.1,
  startFadeOutVal: 0.1,
  endFadeOutVal: 0.2,
  minGain: 0.0,
  maxGain: 0.75,
  getValue: (ctx: AmbianceContext): number => {
    const pos = ctx.view.getCamera().transform.getPosition();
    const nearestX = Math.round(pos.x / GRID_SIZE)
    const nearestZ = Math.round(pos.z / GRID_SIZE)
    if (nearestX < 0 || nearestZ < 0 || nearestX >= COLS || nearestZ >= ROWS) {
      return 1.0
    }
    const sample = (ctx.view as SquaresTerrain3D).getSample(vector2.make(nearestX, nearestZ))
    if (sample === undefined) {
      return 1.0
    }
    const level = Math.floor(sample * LEVEL_COUNT)
    const terrainHeight = level * HEIGHT_PER_LEVEL * GRID_SIZE
    const heightAboveTerrain = pos.y - terrainHeight
    const heightProportional = clamp(heightAboveTerrain / TOTAL_HEIGHT, -1, 1)
    return heightProportional
  },
}

export const LOW_BIRDS_AMBIANCE: AmbianceProfile = {
  name: "LOW_BIRDS",
  path: "/audio/low_birds.mp3",
  startFadeInVal: -0.3,
  endFadeInVal: 0.0,
  startFadeOutVal: 0.2,
  endFadeOutVal: 0.5,
  minGain: 0.0,
  maxGain: 2.0,
  getValue: (ctx: AmbianceContext): number => {
    const pos = ctx.view.getCamera().transform.getPosition();
    const nearestX = Math.round(pos.x / GRID_SIZE)
    const nearestZ = Math.round(pos.z / GRID_SIZE)
    if (nearestX < 0 || nearestZ < 0 || nearestX >= COLS || nearestZ >= ROWS) {
      return 1.0
    }
    const sample = (ctx.view as SquaresTerrain3D).getSample(vector2.make(nearestX, nearestZ))
    if (sample === undefined) {
      return 1.0
    }
    const level = Math.floor(sample * LEVEL_COUNT)
    const terrainHeight = level * HEIGHT_PER_LEVEL * GRID_SIZE
    const heightAboveTerrain = pos.y - terrainHeight
    const heightProportional = clamp(heightAboveTerrain / TOTAL_HEIGHT, -1, 1)
    return heightProportional
  }
}
