import type { Terrain } from "../../model/terrain";
import p5 from "p5";
import vector, { type Vec2 } from "../../lib/vector2";
import { Corner, corner_to_vector as cornerToVector } from "../../model/directions";
import { boolsToCase, caseToLineSegments } from "../../marching_squares/lookup_table";
import { View3D } from "../../model/view/view3d";
import vector3 from "../../lib/vector3";
import { Color } from "../../lib/color";

const LEVEL_COUNT: number = 20
const LEVEL_STEP: number = 1 / LEVEL_COUNT
const CORNERS: Corner[] = [Corner.BottomLeft, Corner.BottomRight, Corner.TopRight, Corner.TopLeft]
const CORNER_OFFSETS: Vec2[] = CORNERS.map(cornerToVector)


export class Debug3DSquares extends View3D {
  private terrain: Terrain

  public constructor(p: p5, terrain: Terrain) {
    super(p)
    this.terrain = terrain
  }

  public draw(): void {
    const ROWS = 200
    const COLS = 200
    const GRID_SIZE = 50
    const HEIGHT_PER = 1.5

    const samples = this.sampleGrid(ROWS, COLS)
    const paths: Path2D[] = []

    this.p.background("white")

    for (let i = 0; i < LEVEL_COUNT; i++) {
      paths.push(new Path2D())
    }


    for (let row = 0; row < ROWS - 1; row++) {
      for (let col = 0; col < COLS - 1; col++) {
        const pos = vector.make(col, row)
        const cornerVals = []

        for (let i = 0; i < CORNERS.length; i++) {
          const offset = vector.add(pos, CORNER_OFFSETS[i])
          const sample = samples[(offset.y) * COLS + offset.x]
          cornerVals.push(sample)
        }

        for (let level = 0; level < LEVEL_COUNT; level++) {
          const height = level * LEVEL_STEP
          const caseIdx = boolsToCase(cornerVals[0] >= height, cornerVals[1] >= height, cornerVals[2] >= height, cornerVals[3] >= height)
          for (const segment of caseToLineSegments(caseIdx)) {
            const start = vector3.make(pos.x + segment.start.x, HEIGHT_PER * level, pos.y + segment.start.y)
            const end = vector3.make(pos.x + segment.end.x, HEIGHT_PER * level, pos.y + segment.end.y)
            this.drawLine({
              start: vector3.scale(start, GRID_SIZE),
              end: vector3.scale(end, GRID_SIZE),
              strokeWidth: 6,
              color: new Color(height, height, height)
            })
          }
        }
      }
    }
  }

  private sampleGrid(rows: number, cols: number): Float32Array {
    const samples = new Float32Array(rows * cols)
    let idx = 0;
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const pos = vector.make(col, row)
        samples[idx] = this.terrain.sample(pos)
        idx++
      }
    }
    return samples
  }
}
