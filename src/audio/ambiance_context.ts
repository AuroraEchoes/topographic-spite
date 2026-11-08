import p5 from "p5";
import type { View3D } from "../model/view/view3d";

export class AmbianceContext {
  public p: p5
  public view: View3D

  public constructor(p: p5, view: View3D) {
    this.p = p
    this.view = view
  }
}
