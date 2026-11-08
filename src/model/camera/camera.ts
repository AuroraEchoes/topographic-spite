import p5 from "p5";
import type { Vec2 } from "../../lib/vector2";

export type WorldRegion = { min: Vec2, max: Vec2 }
export type GridRegion = WorldRegion & { columns: number, rows: number }

export abstract class Camera {
  protected p: p5

  public constructor(p: p5) {
    this.p = p
  }

  public abstract pan(deltaNormalized: Vec2): void
  public abstract zoom(centerNormalized: Vec2, amount: number): void;
}
