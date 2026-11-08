import p5 from "p5"
import { Terrain } from "./model/terrain.ts"
import { DebugCoordinateView } from "./views/debug/debug_coordinate_view.ts"
import { DebugBasicSquares } from "./views/debug/debug_basic_squares.ts"
import { DebugNoiseView } from "./views/debug/debug_noise_view.ts"
import { Pane } from "tweakpane"
import { ViewManager, type ViewFactory } from "./view_manager.ts"
import { DebugSquaresOptimized } from "./views/debug/debug_squares_optimized.ts"
import { Debug3DCube } from "./views/debug/debug_3d_cube.ts"
import { Debug3DSquares } from "./views/debug/debug_squares_3d.ts"
import { SquaresTerrain3D } from "./views/squares_terrain_3d.ts"
import { TweakManager } from "./model/tweak_managers.ts"

const WINDOW_PADDING = 64

const terrain = new Terrain({
  seed: 124816,
  scale: 0.02,
  persistance: 0.3,
  lacunarity: 2,
  octaves: 24,
  redistribution: 1.0
})

const pane = new Pane()
const tweakManager = new TweakManager(pane)

const sketch = (p: p5) => {
  let views: ViewManager

  p.setup = () => {
    p.createCanvas(p.windowWidth - WINDOW_PADDING, p.windowHeight - WINDOW_PADDING)

    const VIEWS: Record<string, ViewFactory> = {
      "3D Squares Terrain": (p) => new SquaresTerrain3D(p, terrain),
      "Debug 3D Squares": (p) => new Debug3DSquares(p, terrain),
      "Debug 3D Cube": (p) => new Debug3DCube(p),
      "Debug Squares Optimized": (p) => new DebugSquaresOptimized(p, terrain),
      "Debug Coordinates": (p) => new DebugCoordinateView(p),
      "Debug Noise": (p) => new DebugNoiseView(p, terrain),
      "Debug Basic Squares": (p) => new DebugBasicSquares(p, terrain)
    }

    views = new ViewManager(p, pane, VIEWS)
  }

  p.draw = () => {
    views.render()
  }
}

new p5(sketch)
