import p5 from "p5"
import { Terrain } from "./model/terrain.ts"
import { DebugCoordinateView } from "./views/debug/debug_coordinate_view.ts"
import { DebugBasicSquares } from "./views/debug/debug_basic_squares.ts"
import { DebugNoiseView } from "./views/debug/debug_noise_view.ts"
import { Pane } from "tweakpane"
import { ViewManager, type ViewFactory } from "./view_manager.ts"
import { DebugSquaresOptimized } from "./views/debug/debug_squares_optimized.ts"

const WINDOW_PADDING = 64

const terrain = new Terrain({
  seed: 124816,
  scale: 0.05,
  persistance: 0.1,
  lacunarity: 0.1,
  octaves: 6,
  redistribution: 1.0
})

const VIEWS: Record<string, ViewFactory> = {
  "Debug Squares Optimized": (p) => new DebugSquaresOptimized(p, terrain),
  "Debug Coordinates": (p) => new DebugCoordinateView(p),
  "Debug Noise": (p) => new DebugNoiseView(p, terrain),
  "Debug Basic Squares": (p) => new DebugBasicSquares(p, terrain)
}

const sketch = (p: p5) => {
  let views: ViewManager

  p.setup = () => {
    p.createCanvas(p.windowWidth - WINDOW_PADDING, p.windowHeight - WINDOW_PADDING)
    views = new ViewManager(p, new Pane(), VIEWS)
  }

  p.draw = () => {
    views.draw()
  }
}

new p5(sketch)
