import type { Vec2 } from "../lib/vector2";
import vector from "../lib/vector2";

export enum Corner {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight
}

export function corner_to_vector(corner: Corner): Vec2 {
  if (corner === Corner.BottomLeft)
    return vector.make(0, 0)
  else if (corner === Corner.BottomRight)
    return vector.make(1, 0)
  else if (corner == Corner.TopLeft)
    return vector.make(0, 1)
  return vector.make(1, 1)
}
