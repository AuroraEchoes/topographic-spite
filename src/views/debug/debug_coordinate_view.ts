import { View2D } from "../../model/view/view2d";

const CIRCLE_DIAMETER_PROPORTION: number = 0.25

export class DebugCoordinateView extends View2D {
  public draw(): void {
    const unitSizePx = this.camera.unitPx()

    this.p.background(this.p.color("white"))
    this.p.textAlign("center", "center")

    for (const worldPos of this.camera.gridPoints()) {
      const screenPos = this.camera.worldToScreen(worldPos)

      this.p.stroke(this.p.color("orange"))
      this.p.noFill()
      this.p.circle(screenPos.x, screenPos.y, CIRCLE_DIAMETER_PROPORTION * unitSizePx)

      this.p.stroke(this.p.color("gray"))
      this.p.rect(screenPos.x, screenPos.y, unitSizePx, unitSizePx)

      this.p.fill(this.p.color("green"))
      this.p.text(`${worldPos.x}, ${worldPos.y}`, screenPos.x, screenPos.y)
    }
  }
}
