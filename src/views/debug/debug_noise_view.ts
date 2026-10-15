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
    this.p.background(this.p.color("white"))
    for (const worldPos of this.camera.gridPoints()) {
      const screenPos = this.camera.worldToScreen(worldPos)
      const sample = this.terrain.sample(worldPos)
      const color = this.p.color(sample * 255)
      this.p.fill(color)
      this.p.circle(screenPos.x, screenPos.y, 32)
    }
  }
}
