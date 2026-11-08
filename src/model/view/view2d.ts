import p5 from "p5";
import vector, { type Vec2 } from "../../lib/vector2.ts"
import { Camera2D, ZOOM_SENSITIVITY } from "../camera/camera2d.ts";
import { View } from "./view.ts";

export abstract class View2D extends View<Camera2D> {
  protected center: Vec2

  public constructor(p: p5) {
    super(p, new Camera2D(p))
    this.center = vector.make(0, 0)
  }

  public abstract draw(): void
  public render() { console.log("render 2d"); this.draw() }
}
