import p5 from "p5";
import { Camera3D } from "../camera/camera3d.ts";
import { View } from "./view.ts";
import vector3, { type Vec3 } from "../../lib/vector3.ts";
import { Transform } from "../../lib/transform.ts";
import { Color } from "../../lib/color.ts";

export type Line3D = {
  start: Vec3,
  end: Vec3,
  strokeWidth?: number,
  color?: Color
}

const MOVE_SPEED: number = 1000
const DEFAULT_LINE_WIDTH = 6
const DEFAULT_COLOR = new Color(0, 0, 0)

export abstract class View3D extends View<Camera3D> {
  protected center: Vec3
  private lines: Line3D[] = []
  protected transform: Transform

  public constructor(p: p5) {
    super(p, new Camera3D(p))
    this.center = vector3.make(0, 0, 0)
    this.transform = new Transform(vector3.make(0, 0, 0), vector3.make(0, 0, 0))
  }

  public drawLine(line: Line3D) {
    this.lines.push(line)
  }

  public abstract draw(): void

  public activate(): void {
    super.activate()
  }

  public getTransform(): Transform {
    return this.transform
  }

  public render() {
    this.move()

    this.lines = []
    this.draw()
    const context = this.p.drawingContext as any
    for (const line of this.lines) {
      const lineStartWorld = this.transform.transform(line.start)
      const lineEndWorld = this.transform.transform(line.end)

      // TODO: Cull off-screen lines

      const lineStartScreen = this.camera.worldToScreen(lineStartWorld)
      const lineEndScreen = this.camera.worldToScreen(lineEndWorld)

      const path = new Path2D()
      path.moveTo(lineStartScreen.x, lineStartScreen.y)
      path.lineTo(lineEndScreen.x, lineEndScreen.y)
      context.lineWidth = line.strokeWidth ?? DEFAULT_LINE_WIDTH
      const color = line.color ?? DEFAULT_COLOR
      context.strokeStyle = color.toCssColor()
      context.stroke(path)
    }
    context.lineWidth = 1
  }

  private move() {
    const xAxis: number = +!!this.p.keyIsDown("d") - +!!this.p.keyIsDown("a")
    const yAxis: number = +!!this.p.keyIsDown("e") - +!!this.p.keyIsDown("q")
    const zAxis: number = +!!this.p.keyIsDown("w") - +!!this.p.keyIsDown("s")

    const velocity = this.p.deltaTime * (1 / 1000) * MOVE_SPEED
    const delta = vector3.scale(vector3.make(xAxis, yAxis, zAxis), velocity)
    const cameraBasis = this.camera.transform.getBasis()
    const rotated = Transform.transformPoint(delta, cameraBasis.ihat, cameraBasis.jhat, cameraBasis.khat)
    this.camera.transform.setPosition(vector3.add(this.camera.transform.getPosition(), rotated))
  }
}
