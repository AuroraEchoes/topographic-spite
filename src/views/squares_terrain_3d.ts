import type { Vec2 } from "../lib/vector2"
import p5 from "p5"
import { Corner, corner_to_vector as cornerToVector } from "../model/directions"
import type { Terrain } from "../model/terrain"
import { View3D } from "../model/view/view3d"
import vector3 from "../lib/vector3"
import vector2 from "../lib/vector2"
import { boolsToCase, caseToLineSegments } from "../marching_squares/lookup_table"
import { Color } from "../lib/color"
import { AmbiancePlayer } from "../audio/ambiance_player"
import { AmbianceContext } from "../audio/ambiance_context"
import { GROUND_FOOTSTEPS_AMBIANCE, HIGH_ALTITUDE_WIND_AMBIANCE, LOW_BIRDS_AMBIANCE, MEDIUM_ALTITUDE_TREE_WIND_AMBIANCE } from "../audio/ambiance_profile"

export const LEVEL_COUNT: number = 20
export const LEVEL_STEP: number = 1 / LEVEL_COUNT
export const CORNERS: Corner[] = [Corner.BottomLeft, Corner.BottomRight, Corner.TopRight, Corner.TopLeft]
export const CORNER_OFFSETS: Vec2[] = CORNERS.map(cornerToVector)
export const HEIGHT_PER_LEVEL = 1.5
export const GRID_SIZE = 50
export const TOTAL_HEIGHT = LEVEL_COUNT * HEIGHT_PER_LEVEL * GRID_SIZE
export const ROWS = 100
export const COLS = 100

export const CHUNK_SIZE = GRID_SIZE * 48
export const RENDER_DIST_CHUNKS = 3

export class SquaresTerrain3D extends View3D {
  private terrain: Terrain
  private ambiance: AmbiancePlayer
  private samples: Float32Array

  public constructor(p: p5, terrain: Terrain) {
    super(p)
    this.terrain = terrain

    const context = new AmbianceContext(p, this)
    this.ambiance = new AmbiancePlayer([
      HIGH_ALTITUDE_WIND_AMBIANCE,
      MEDIUM_ALTITUDE_TREE_WIND_AMBIANCE,
      GROUND_FOOTSTEPS_AMBIANCE,
      LOW_BIRDS_AMBIANCE
    ], context)

    this.samples = this.sampleGrid(ROWS, COLS)
  }

  public draw(): void {
    this.ambiance.update()
    const paths: Path2D[] = []

    this.p.background("skyblue")

    for (let i = 0; i < LEVEL_COUNT; i++) {
      paths.push(new Path2D())
    }


    for (let row = 0; row < ROWS - 1; row++) {
      for (let col = 0; col < COLS - 1; col++) {
        const pos = vector2.make(col, row)
        const cornerVals = []

        for (let i = 0; i < CORNERS.length; i++) {
          const offset = vector2.add(pos, CORNER_OFFSETS[i])
          const sample = this.samples[(offset.y) * COLS + offset.x]
          cornerVals.push(sample)
        }

        for (let level = 0; level < LEVEL_COUNT; level++) {
          const height = level * LEVEL_STEP
          const caseIdx = boolsToCase(cornerVals[0] >= height, cornerVals[1] >= height, cornerVals[2] >= height, cornerVals[3] >= height)
          for (const segment of caseToLineSegments(caseIdx)) {
            const start = vector3.make(pos.x + segment.start.x, HEIGHT_PER_LEVEL * level, pos.y + segment.start.y)
            const end = vector3.make(pos.x + segment.end.x, HEIGHT_PER_LEVEL * level, pos.y + segment.end.y)
            this.drawLine({
              start: vector3.scale(start, GRID_SIZE),
              end: vector3.scale(end, GRID_SIZE),
              strokeWidth: 6,
              color: new Color((94 * height) / 255, (60 * height) / 255, (40 * height) / 255)
            })
          }
        }
      }
    }
  }

  public getSample(gridPos: Vec2): number {
    return this.samples[(gridPos.y) * COLS + gridPos.x]
  }

  private sampleGrid(rows: number, cols: number): Float32Array {
    const samples = new Float32Array(rows * cols)
    let idx = 0;
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const pos = vector2.make(col, row)
        samples[idx] = this.terrain.sample(pos)
        idx++
      }
    }
    return samples
  }
}

export class SquaresTerrainChunk {
  chunkCoord: Vec2
  terrain: Terrain

  public constructor(chunkCoord: Vec2, terrain: Terrain) {

  }

  private sampleGrid(startX: number, endXExcl: number, startY: number, endYExcl: number): Float32Array {
    const cols = Math.abs(endXExcl - startX)
    const rows = Math.abs(endYExcl - startY)

    const samples = new Float32Array(cols * rows)
    let idx = 0
    for (let y = startY; y < endYExcl; y++) {
      for (let x = startX; x < endXExcl; x++) {
        const pos = vector2.make(x, y)
        samples[idx] = this.terrain.sample()
        idx++
      }
    }
  }
}
