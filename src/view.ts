import p5 from "p5";
import vector, { type Vec2 } from "./lib/vector.ts"

const WORLD_UNIT_SIZE_PX: number = 10

export abstract class View {
  protected p: p5
  protected center: Vec2

  public constructor(p: p5) {
    this.p = p;
    this.center = vector.make(0, 0)
    this.p.mouseDragged = (event) => onMouseDragged(event, this)
  }

  public abstract draw(): void

  public pxToWorld(px: Vec2): Vec2 {
    const worldPos = vector.scale(px, 1 / WORLD_UNIT_SIZE_PX)
    return worldPos;
  }

  // Upper left hand of world cell specifically
  public worldToPx(px: Vec2): Vec2 {
    return vector.scale(px, WORLD_UNIT_SIZE_PX)
  }

  public screenSizeWorld(): Vec2 {
    this.screenSizePx()
    return vector.make(this.p.width / WORLD_UNIT_SIZE_PX, this.p.height / WORLD_UNIT_SIZE_PX)
  }

  public screenBoundsWorld(): { min: Vec2, max: Vec2 } {
    const halfSize = vector.scale(this.screenSizePx(), 0.5 * WORLD_UNIT_SIZE_PX)
    const extended = vector.make(Math.ceil(halfSize.x), Math.ceil(halfSize.y))
    return { min: vector.scale(extended, -1), max: extended }
  }

  public screenSizePx(): Vec2 {
    return vector.make(this.p.width, this.p.height)
  }

  public worldUnitSizePx(): Vec2 {
    return vector.make(WORLD_UNIT_SIZE_PX, WORLD_UNIT_SIZE_PX)
  }

  public dragCenterPx(deltaPx: Vec2) {
    const worldDelta = vector.scale(deltaPx, 1 / WORLD_UNIT_SIZE_PX)
    this.center = vector.add(this.center, worldDelta)
    console.log("Dragged center", this.center.x, this.center.y)
  }
}

function onMouseDragged(event: MouseEvent | undefined, view: View) {
  if (event === undefined)
    return

  const delta = vector.make(event.movementX, event.movementY)
  view.dragCenterPx(delta)
  console.log("Drag", delta.x, delta.y)
}
