import p5 from "p5";
import vector, { type Vec2 } from "./lib/vector.ts"
import { clamp } from "./lib/math.ts";

export const DEFAULT_PIXELS_PER_UNIT = 100
export const MIN_PIXELS_PER_UNIT = 40
export const MAX_PIXELS_PER_UNIT = 200
export const ZOOM_SENSITIVITY = 0.001

export type WorldRegion = { min: Vec2, max: Vec2 }
export type GridRegion = WorldRegion & { columns: number, rows: number }

export class Camera2D {
  private p: p5
  private center: Vec2
  private pixelsPerUnit: number

  public constructor(p: p5) {
    this.p = p
    this.center = vector.make(0, 0)
    this.pixelsPerUnit = DEFAULT_PIXELS_PER_UNIT
  }

  public screenPx(): Vec2 {
    return vector.make(this.p.width, this.p.height)
  }

  public screenWorld(): Vec2 {
    return vector.scale(this.screenPx(), 1 / this.pixelsPerUnit)
  }

  public unitPx(): number {
    return this.pixelsPerUnit
  }

  public screenToWorld(px: Vec2): Vec2 {
    const fromScreenCenterPx = vector.add(px, vector.scale(this.screenPx(), -0.5))
    return vector.add(this.center, vector.scale(fromScreenCenterPx, 1 / this.pixelsPerUnit))
  }

  public worldToScreen(world: Vec2): Vec2 {
    const fromCenterWorld = vector.add(world, vector.scale(this.center, -1))
    return vector.add(vector.scale(fromCenterWorld, this.pixelsPerUnit), vector.scale(this.screenPx(), 0.5))
  }

  public panByPx(deltaPx: Vec2): void {
    this.center = vector.add(this.center, vector.scale(deltaPx, -1 / this.pixelsPerUnit))
  }

  public zoomAt(px: Vec2, factor: number): void {
    const anchorBefore = this.screenToWorld(px)
    this.pixelsPerUnit = clamp(this.pixelsPerUnit * factor, MIN_PIXELS_PER_UNIT, MAX_PIXELS_PER_UNIT)
    const anchorAfter = this.screenToWorld(px)
    this.center = vector.add(this.center, vector.add(anchorBefore, vector.scale(anchorAfter, -1)))
  }

  public visibleBounds(): WorldRegion {
    return {
      min: this.screenToWorld(vector.make(0, 0)),
      max: this.screenToWorld(this.screenPx())
    }
  }

  public visibleGrid(marginCells: number = 1): GridRegion {
    const bounds = this.visibleBounds()
    const min = vector.make(Math.floor(bounds.min.x) - marginCells, Math.floor(bounds.min.y) - marginCells)
    const max = vector.make(Math.ceil(bounds.max.x) + marginCells, Math.ceil(bounds.max.y) + marginCells)
    return { min, max, columns: max.x - min.x + 1, rows: max.y - min.y + 1 }
  }

  public *gridPoints(marginCells: number = 1): Generator<Vec2> {
    const grid = this.visibleGrid(marginCells)
    for (let y = grid.min.y; y <= grid.max.y; y++)
      for (let x = grid.min.x; x <= grid.max.x; x++)
        yield vector.make(x, y)
  }
}
