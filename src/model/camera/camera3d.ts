import p5 from "p5";
import { Camera } from "./camera.ts";
import type { Vec3 } from "../../lib/vector3.ts";
import vector3 from "../../lib/vector3.ts";
import type { Vec2 } from "../../lib/vector2.ts";
import vector2 from "../../lib/vector2.ts";
import { Transform } from "../../lib/transform.ts";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../../view_manager.ts";

const FOV_RADIANS: number = Math.PI / 4
const FOV_HEIGHT = Math.tan(FOV_RADIANS / 2) * 2
const SENSITIVITY = 2.0

export class Camera3D extends Camera {
  public transform: Transform
  public zoomChanged: (centerNormalized: Vec2, amount: number) => void = () => { };

  public constructor(p: p5) {
    super(p)
    this.transform = new Transform(vector3.make(0, 0, 0), vector3.make(0, 0, 0))
  }

  public worldToScreen(point: Vec3): Vec2 | undefined {
    const viewPoint = this.transform.transformInverse(point)
    viewPoint.y *= -1
    if (viewPoint.z < 0) {
      return undefined
    }
    const z = Math.max(viewPoint.z, 0.001)
    const worldToScreenPx = (FOV_HEIGHT * WINDOW_HEIGHT) / z
    let screen = vector2.make(viewPoint.x, viewPoint.y)
    screen = vector2.scale(screen, worldToScreenPx)
    const x = screen.x + WINDOW_WIDTH * 0.5
    const y = screen.y + WINDOW_HEIGHT * 0.5
    if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT)
      return undefined
    return vector2.make(x, y)
  }

  public pan(deltaNormalized: Vec2): void {
    const deltaPitch = deltaNormalized.y * SENSITIVITY
    const deltaYaw = deltaNormalized.x * SENSITIVITY
    const prevRotation = this.transform.getRotation()
    const newRotation = vector3.make(prevRotation.x + deltaPitch, prevRotation.y + deltaYaw, prevRotation.z)
    this.transform.setRotation(newRotation)
  }

  public zoom(centerNormalized: Vec2, amount: number): void {
    this.zoomChanged(centerNormalized, amount)
  }
}
