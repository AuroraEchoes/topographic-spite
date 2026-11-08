import p5 from "p5";
import vector, { type Vec2 } from "../../lib/vector2.ts"
import type { Camera } from "../camera/camera.ts";
import { ZOOM_SENSITIVITY } from "../camera/camera2d.ts";

export abstract class View<TCamera extends Camera> {
  protected p: p5
  protected camera: TCamera

  public constructor(p: p5, camera: TCamera) {
    this.p = p;
    this.camera = camera
  }

  public abstract draw(): void
  public abstract render(): void
  public getCamera(): TCamera {
    return this.camera
  }
}
