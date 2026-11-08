import p5 from "p5";
import { Camera } from "./camera.ts";
import type { Vec3 } from "../../lib/vector3.ts";
import vector3 from "../../lib/vector3.ts";
import type { Vec2 } from "../../lib/vector2.ts";
import vector2 from "../../lib/vector2.ts";
import { Transform, type Basis } from "../../lib/transform.ts";

const FOV_RADIANS: number = Math.PI / 4
const SENSITIVITY = 2.0

export class Camera3D extends Camera {
  transform: Transform

  public constructor(p: p5) {
    super(p)
    this.transform = new Transform(vector3.make(0, 0, 0), vector3.make(0, 0, 0))
  }

  public worldToScreen(point: Vec3): Vec2 {
    const viewPoint = this.transform.transformInverse(point)
    viewPoint.y *= -1
    const fov = Math.tan(FOV_RADIANS / 2) * 2;
    const z = Math.max(viewPoint.z, 0.001)
    const worldToScreenPx = (fov * this.p.height) / z
    let screen = vector2.make(viewPoint.x, viewPoint.y)
    screen = vector2.scale(screen, worldToScreenPx)
    const centerOffset = vector2.scale(vector2.make(this.p.width, this.p.height), 0.5)
    return vector2.make(screen.x + centerOffset.x, screen.y + centerOffset.y)
  }

  public pan(deltaNormalized: Vec2): void {
    const deltaPitch = deltaNormalized.y * SENSITIVITY
    const deltaYaw = deltaNormalized.x * SENSITIVITY
    const prevRotation = this.transform.getRotation()
    const newRotation = vector3.make(prevRotation.x + deltaPitch, prevRotation.y + deltaYaw, prevRotation.z)
    this.transform.setRotation(newRotation)
  }

  public zoom(centerNormalized: Vec2, amount: number): void { }
}
