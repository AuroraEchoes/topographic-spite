import type { Terrain } from "../../model/terrain";
import { View } from "../../view";
import p5 from "p5";
import vector from "../../lib/vector";
import { Corner, corner_to_vector as cornerToVector } from "../../model/directions";
import { boolsToCase as boolsToCase, caseToLineSegments as caseToLineSegments } from "../../marching_squares/lookup_table";

export class DebugBasicSquares extends View {
  private terrain: Terrain

  public constructor(p: p5, terrain: Terrain) {
    super(p)
    this.terrain = terrain
  }

  public draw(): void {
    this.p.background("white")

    for (const worldPos of this.camera.gridPoints()) {
      for (let height = 0.0; height < 1.0; height += 0.1) {
        this.p.strokeWeight(4)
        this.p.stroke(this.p.lerpColor(this.p.color("red"), this.p.color("green"), height))
        const corners = [Corner.BottomLeft, Corner.BottomRight, Corner.TopRight, Corner.TopLeft]
        const cornerBools = []
        for (let corner of corners) {
          const actualPos = vector.add(worldPos, cornerToVector(corner))
          const sample = this.terrain.sample(actualPos)
          cornerBools.push(sample >= height)
        }
        const idx = boolsToCase(cornerBools[0], cornerBools[1], cornerBools[2], cornerBools[3])
        const segments = caseToLineSegments(idx)
        const cellStart = this.camera.worldToScreen(worldPos)
        const cellSize = this.camera.unitPx()
        for (let segment of segments) {
          const startWorld = vector.add(cellStart, vector.scale(segment.start, cellSize))
          const endWorld = vector.add(cellStart, vector.scale(segment.end, cellSize))
          this.p.line(startWorld.x, startWorld.y, endWorld.x, endWorld.y)
        }
      }
    }
  }
}
