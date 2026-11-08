import type { Vec2 } from "../lib/vector2"
import p5 from "p5"
import { Corner, corner_to_vector as cornerToVector } from "../model/directions"
import type { Terrain } from "../model/terrain"
import vector3 from "../lib/vector3"
import vector2 from "../lib/vector2"
import { boolsToCase, caseToLineSegments } from "../marching_squares/lookup_table"
import { Color } from "../lib/color"
import { AmbiancePlayer } from "../audio/ambiance_player"
import { AmbianceContext } from "../audio/ambiance_context"
import { GROUND_FOOTSTEPS_AMBIANCE, HIGH_ALTITUDE_WIND_AMBIANCE, LOW_BIRDS_AMBIANCE, MEDIUM_ALTITUDE_TREE_WIND_AMBIANCE } from "../audio/ambiance_profile"
import { View3D, type Line3D } from "../model/view/view3d"
import type { ITweakDrawer } from "../model/tweak_drawer"
import type { FolderApi } from "tweakpane"
import { TweakManager } from "../model/tweak_managers"

export const LEVEL_COUNT: number = 32
export const LEVEL_STEP: number = 1 / LEVEL_COUNT
export const CORNERS: Corner[] = [Corner.BottomLeft, Corner.BottomRight, Corner.TopRight, Corner.TopLeft]
export const CORNER_OFFSETS: Vec2[] = CORNERS.map(cornerToVector)
export const HEIGHT_PER_LEVEL = 1.5
export const GRID_SIZE = 64
export const TOTAL_HEIGHT = LEVEL_COUNT * HEIGHT_PER_LEVEL * GRID_SIZE

export const CHUNK_GRID_SIZE = 32
export const CHUNK_SIZE = CHUNK_GRID_SIZE * GRID_SIZE
export const RENDER_DIST_CHUNKS_LOD = 9
export const LOD_1_START = 2
export const LOD_2_START = 5
export const RENDER_DISTANCE_CHUNKS = 3

type LoDProfile = {
  LEVEL_COUNT: number,
  CHUNK_GRID_SIZE: number,
  GRID_SIZE: number, // size of grid cell, units
  STEP: number,
  CHUNK_SIZE: number, // size of chunk, units
  HEIGHT_PER_LEVEL: number
}

const LODS: Record<number, LoDProfile> = {
  0: {
    LEVEL_COUNT: 32,
    CHUNK_GRID_SIZE: 32,
    GRID_SIZE: 64,
    STEP: 1,
    CHUNK_SIZE: 64 * 32,
    HEIGHT_PER_LEVEL: 1.5
  },
  1: {
    LEVEL_COUNT: 16,
    CHUNK_GRID_SIZE: 16,
    GRID_SIZE: 128,
    STEP: 2,
    CHUNK_SIZE: 128 * 16,
    HEIGHT_PER_LEVEL: 3
  },
  2: {
    LEVEL_COUNT: 8,
    CHUNK_GRID_SIZE: 8,
    GRID_SIZE: 256,
    STEP: 4,
    CHUNK_SIZE: 256 * 8,
    HEIGHT_PER_LEVEL: 6
  }
}

export class SquaresTerrain3D extends View3D implements ITweakDrawer {
  private terrain: Terrain
  private ambiance: AmbiancePlayer
  private chunkCache: Map<string, SquaresTerrainChunk> = new Map<string, SquaresTerrainChunk>()
  private currentChunk: Vec2
  public useLods: boolean
  public folderName: string = "Terrain"

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
    this.useLods = true
    this.currentChunk = vector2.make(0, 0)

    TweakManager.instance.register(this)
  }

  public draw(): void {
    this.ambiance.update()
    this.p.background("skyblue")

    const cameraPos = this.getCamera().transform.getPosition()
    const rawChunkPos = vector3.scale(cameraPos, 1 / CHUNK_SIZE)
    const currentChunkUnrounded = vector2.make(rawChunkPos.x, rawChunkPos.z)
    const currentChunk = vector2.make(Math.floor(rawChunkPos.x), Math.floor(rawChunkPos.z))
    this.currentChunk = currentChunk
    const searchDist = RENDER_DIST_CHUNKS_LOD + 1

    const startX = currentChunk.x - searchDist
    const endX = currentChunk.x + searchDist
    const startY = currentChunk.y - searchDist
    const endY = currentChunk.y + searchDist

    for (let chunkY = startY; chunkY <= endY; chunkY++) {
      for (let chunkX = startX; chunkX <= endX; chunkX++) {
        const deltaX = chunkX - currentChunkUnrounded.x
        const deltaY = chunkY - currentChunkUnrounded.y

        // imma be clever and not use a sqrt watch me
        const chunkSqrDist = (deltaY * deltaY) + (deltaX * deltaX)
        const renderDist = this.useLods ? RENDER_DIST_CHUNKS_LOD : RENDER_DISTANCE_CHUNKS
        const shouldRender = chunkSqrDist <= (renderDist * renderDist)

        if (shouldRender) {
          const chunkHash = chunkX.toString() + "," + chunkY.toString()
          let chunk = this.chunkCache.get(chunkHash)
          if (chunk === undefined) {
            chunk = new SquaresTerrainChunk(vector2.make(chunkX, chunkY), this.terrain)
            this.chunkCache.set(chunkHash, chunk)
            console.log("Making new chunk", chunkHash)
          }
          let lines: Line3D[]
          if (this.useLods) {
            if (chunkSqrDist > LOD_2_START * LOD_2_START) {
              lines = chunk.getLod(2)
            }
            else if (chunkSqrDist > LOD_1_START * LOD_1_START) {
              lines = chunk.getLod(1)
            }
            else {
              lines = chunk.getLod(0)
            }
          } else {
            lines = chunk.getLod(0)
          }
          super.drawLines(lines)
        }
      }
    }
  }

  public getNoiseSampleAtCamera(): number | undefined {
    const hash = this.currentChunk.x.toString() + "," + this.currentChunk.y.toString()
    const currentChunk = this.chunkCache.get(hash)
    if (currentChunk === undefined)
      return undefined;

    const chunkPos = vector2.scale(this.currentChunk, CHUNK_SIZE)
    const cameraPos = this.getCamera().transform.getPosition()
    const cameraPosGround = vector2.make(cameraPos.x, cameraPos.z)
    const localPos = vector2.sub(cameraPosGround, chunkPos)
    const localCellUnrounded = vector2.scale(localPos, 1 / GRID_SIZE)
    const nearestSample = vector2.make(Math.round(localCellUnrounded.x), Math.round(localCellUnrounded.y))
    const sample = currentChunk.getSample(nearestSample)
    return sample
  }

  public registerTweakProperties(folder: FolderApi): void {
    folder.addBinding(this, "useLods", {})
  }
}

export class SquaresTerrainChunk {
  private chunkCoord: Vec2
  private samples: Float32Array
  private lods: Map<number, Line3D[]> = new Map<number, Line3D[]>()

  public constructor(chunkCoord: Vec2, terrain: Terrain) {
    const chunkSize = vector2.make(CHUNK_GRID_SIZE, CHUNK_GRID_SIZE)
    const start = vector2.mult(chunkCoord, chunkSize)
    const end = vector2.add(start, chunkSize)
    const samples = this.sampleGrid(start.x, end.x, start.y, end.y, terrain)

    this.samples = samples
    this.chunkCoord = chunkCoord
  }

  public getChunkCoord(): Vec2 {
    return this.chunkCoord
  }

  public getSample(localCell: Vec2): number {
    return this.samples[localCell.y * (CHUNK_GRID_SIZE + 1) + localCell.x]
  }

  public getLod(power: number): Line3D[] {
    let lines = this.lods.get(power)
    if (lines === undefined) {
      lines = this.constructLoD(power)
      this.lods.set(power, lines)
    }
    return lines
  }

  private sampleGrid(startX: number, endXExcl: number, startY: number, endYExcl: number, terrain: Terrain): Float32Array {
    const cols = Math.abs(endXExcl - startX)
    const rows = Math.abs(endYExcl - startY)

    const samples = new Float32Array((cols + 1) * (rows + 1))
    let idx = 0
    for (let y = startY; y <= endYExcl; y++) {
      for (let x = startX; x <= endXExcl; x++) {
        const pos = vector2.make(x, y)
        samples[idx] = terrain.sample(pos)
        idx++
      }
    }
    return samples
  }

  private constructLoD(power: number) {
    const lod: LoDProfile = LODS[power]
    const lines = []

    const levelStep = 1 / lod.LEVEL_COUNT

    const chunkOffset = vector3.scale(vector3.make(this.chunkCoord.x, 0, this.chunkCoord.y), lod.CHUNK_SIZE)
    for (let row = 0; row < lod.CHUNK_GRID_SIZE; row++) {
      for (let col = 0; col < lod.CHUNK_GRID_SIZE; col++) {
        const chunkPos = vector2.make(col, row)
        const cornerVals = []

        for (let i = 0; i < CORNERS.length; i++) {
          const posOffset = vector2.add(chunkPos, CORNER_OFFSETS[i])
          const sample = this.samples[(posOffset.y * lod.STEP) * ((lod.CHUNK_GRID_SIZE * lod.STEP) + 1) + (posOffset.x * lod.STEP)]
          cornerVals.push(sample)
        }

        for (let level = 0; level < lod.LEVEL_COUNT; level++) {
          const height = level * levelStep
          const caseIdx = boolsToCase(cornerVals[0] >= height, cornerVals[1] >= height, cornerVals[2] >= height, cornerVals[3] >= height)
          for (const segment of caseToLineSegments(caseIdx)) {
            const offsetInChunk = vector3.scale(vector3.make(chunkPos.x, lod.HEIGHT_PER_LEVEL * level / lod.STEP, chunkPos.y), lod.GRID_SIZE)
            const chunkStart = vector3.add(offsetInChunk, vector3.scale(vector3.make(segment.start.x, 0, segment.start.y), lod.GRID_SIZE))
            const chunkEnd = vector3.add(offsetInChunk, vector3.scale(vector3.make(segment.end.x, 0, segment.end.y), lod.GRID_SIZE))
            const start = vector3.add(chunkOffset, chunkStart)
            const end = vector3.add(chunkOffset, chunkEnd)

            lines.push({
              start: start,
              end: end,
              strokeWidth: 6,
              color: new Color((94 * height) / 255, (60 * height) / 255, (40 * height) / 255)
            })
          }
        }
      }
    }
    return lines
  }
}
