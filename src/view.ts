import p5 from "p5";
import vec2 from "tsm/src/vec2.ts"

const WORLD_UNIT_SIZE_PX: number = 100

export abstract class View {
  protected p: p5

  public constructor(p: p5) {
    this.p = p;
  }

  public abstract draw(): void

  public pxToWorld(px: vec2): vec2 {
    const worldPos = px.scale(1 / WORLD_UNIT_SIZE_PX)
    return worldPos;
  }

  // Upper left hand of world cell specifically
  public worldToPx(px: vec2): vec2 {
    return px.scale(WORLD_UNIT_SIZE_PX)
  }

  public screenSizeWorld(): vec2 {
    return new vec2([this.p.width / WORLD_UNIT_SIZE_PX, this.p.height / WORLD_UNIT_SIZE_PX])
  }

  public screenBoundsWorld(): { min: vec2, max: vec2 } {
    const halfSize = this.screenSizePx().scale(0.5 * WORLD_UNIT_SIZE_PX)
    const extended = new vec2([Math.ceil(halfSize.x), Math.ceil(halfSize.y)])
    return { min: extended.scale(-1), max: extended }
  }

  public screenSizePx(): vec2 {
    return new vec2([this.p.width, this.p.height])
  }

  public worldUnitSizePx(): vec2 {
    return new vec2([WORLD_UNIT_SIZE_PX, WORLD_UNIT_SIZE_PX])
  }
}
