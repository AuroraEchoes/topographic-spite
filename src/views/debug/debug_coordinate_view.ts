import vec2 from "tsm/src/vec2";
import { View } from "../../view";
import p5 from "p5";

export class DebugCoordinateView extends View {

  drawn: boolean = false

  public constructor(p: p5) {
    super(p)
  }

  public draw(): void {
    const worldSize = this.screenSizeWorld()
    this.p.background(this.p.color("white"))
    for (let y = 0; y < worldSize.y; y++) {
      for (let x = 0; x < worldSize.x; x++) {
        const worldPos = new vec2([x, y])
        const screenPos = this.worldToPx(worldPos)
        const worldUnitSize = this.worldUnitSizePx()
        this.p.stroke(this.p.color("orange"))
        this.p.noFill()
        this.p.circle(screenPos.x, screenPos.y, 32)
        this.p.stroke(this.p.color("gray"))
        this.p.rect(screenPos.x, screenPos.y, worldUnitSize.x, worldUnitSize.y)
        this.p.textAlign("center", "center")
        this.p.fill(this.p.color("green"))
        this.p.text(`${worldPos.x}, ${worldPos.y}`, screenPos.x, screenPos.y)
      }
    }
  }
}
