import type { Terrain } from "../../model/terrain";
import p5 from "p5";
import vector, { type Vec2 } from "../../lib/vector2";
import { Corner, corner_to_vector as cornerToVector } from "../../model/directions";
import { boolsToCase, caseToLineSegments } from "../../marching_squares/lookup_table";
import { View2D } from "../../model/view/view2d";

const LEVEL_COUNT: number = 10
const LEVEL_STEP: number = 1 / LEVEL_COUNT
const CORNERS: Corner[] = [Corner.BottomLeft, Corner.BottomRight, Corner.TopRight, Corner.TopLeft]
const CORNER_OFFSETS: Vec2[] = CORNERS.map(cornerToVector)


export class DebugSquaresOptimized extends View2D {
  private terrain: Terrain

  public constructor(p: p5, terrain: Terrain) {
    super(p)
    this.terrain = terrain
  }

  public draw(): void {
    const grid = this.camera.visibleGrid()
    const samples = this.sampleGrid()
    const paths: Path2D[] = []
    const origin = this.camera.worldToScreen(grid.min)

    this.p.background("white")

    for (let i = 0; i < LEVEL_COUNT; i++) {
      paths.push(new Path2D())
    }


    for (let row = 0; row < grid.rows - 1; row++) {
      for (let col = 0; col < grid.columns - 1; col++) {
        const pos = vector.make(col, row)
        const cornerVals = []

        for (let i = 0; i < CORNERS.length; i++) {
          const offset = vector.add(pos, CORNER_OFFSETS[i])
          const sample = samples[(offset.y) * grid.columns + offset.x]
          cornerVals.push(sample)
        }

        for (let level = 0; level < LEVEL_COUNT; level++) {
          const height = level * LEVEL_STEP
          const bools = cornerVals.map(val => val >= height)
          const caseIdx = boolsToCase(bools[0], bools[1], bools[2], bools[3])
          for (const segment of caseToLineSegments(caseIdx)) {
            const screenStart = vector.scale(vector.add(pos, segment.start), this.camera.unitPx())
            const screenEnd = vector.scale(vector.add(pos, segment.end), this.camera.unitPx())
            paths[level].moveTo(origin.x + screenStart.x, origin.y + screenStart.y)
            paths[level].lineTo(origin.x + screenEnd.x, origin.y + screenEnd.y)
          }
        }
      }
    }

    const drawingContext = (this.p.drawingContext) as any

    for (let i = 0; i < LEVEL_COUNT; i++) {
      drawingContext.lineWidth = 8
      drawingContext.stroke(paths[i])
    }
    drawingContext.lineWidth = this.p.strokeWeight()
  }

  private sampleGrid(): Float32Array {
    const grid = this.camera.visibleGrid()
    const samples = new Float32Array(grid.columns * grid.rows)
    let idx = 0;
    for (const worldPos of this.camera.gridPoints()) {
      samples[idx] = this.terrain.sample(worldPos)
      idx++
    }
    return samples
  }
}
