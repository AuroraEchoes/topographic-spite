import p5 from "p5";
import { View3D } from "../../model/view/view3d";
import type { Vec3 } from "../../lib/vector3";
import vector3 from "../../lib/vector3";
import { DEFAULT_PIXELS_PER_UNIT } from "../../model/camera/camera2d";

const UNSCALED_CUBE_LINES: { start: Vec3, end: Vec3 }[] = [
  { start: vector3.make(0, 0, 0), end: vector3.make(0, 0, 1) },
  { start: vector3.make(0, 0, 1), end: vector3.make(1, 0, 1) },
  { start: vector3.make(1, 0, 1), end: vector3.make(1, 0, 0) },
  { start: vector3.make(1, 0, 0), end: vector3.make(0, 0, 0) },
  { start: vector3.make(0, 1, 0), end: vector3.make(0, 1, 1) },
  { start: vector3.make(0, 1, 1), end: vector3.make(1, 1, 1) },
  { start: vector3.make(1, 1, 1), end: vector3.make(1, 1, 0) },
  { start: vector3.make(1, 1, 0), end: vector3.make(0, 1, 0) },
  { start: vector3.make(0, 0, 0), end: vector3.make(0, 1, 0) },
  { start: vector3.make(0, 0, 1), end: vector3.make(0, 1, 1) },
  { start: vector3.make(1, 0, 1), end: vector3.make(1, 1, 1) },
  { start: vector3.make(1, 0, 0), end: vector3.make(1, 1, 0) },
]

const NUMBER_UNITS_SIZE = 4

export class Debug3DCube extends View3D {

  public constructor(p: p5) {
    super(p)
  }

  public draw(): void {
    this.p.background("white")
    const scale = NUMBER_UNITS_SIZE * DEFAULT_PIXELS_PER_UNIT
    for (const line of UNSCALED_CUBE_LINES) {
      this.drawLine({ start: vector3.scale(line.start, scale), end: vector3.scale(line.end, scale) })
    }
    const delta = this.p.deltaTime * 1 / 1000
    const newRot = vector3.add(this.transform.getRotation(), vector3.make(delta, delta, delta))
    // this.transform.setRotation(newRot)
  }
}
