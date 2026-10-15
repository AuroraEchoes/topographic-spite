import type { Terrain } from "../../model/terrain";
import { View } from "../../view";
import p5 from "p5";
import vector from "../../lib/vector";

export class DebugNoiseView extends View {
  terrain: Terrain

  constructor(p: p5, terrain: Terrain) {
    super(p)
    this.terrain = terrain
  }

  public draw(): void {
    const size = this.screenSizeWorld()
    let min = 1
    let max = 0
    for (let y = 0; y < size.y; y++) {
      for (let x = 0; x < size.x; x++) {
        const worldPos = vector.make(x, y)
        const screenPos = this.worldToPx(worldPos)
        const sample = this.terrain.sample(worldPos)
        min = Math.min(sample, min)
        max = Math.max(sample, max)
        const color = this.p.color(sample * 255)
        this.p.fill(color)
        this.p.circle(screenPos.x, screenPos.y, 32)
      }
    }
    console.log("min", min, "max", max)
  }
}
