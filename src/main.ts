import p5 from "p5"
import type { View } from "./view"
import { Terrain } from "./model/terrain.ts"
import { DebugNoiseView } from "./views/debug/debug_noise_view.ts"
import { DebugCoordinateView } from "./views/debug/debug_coordinate_view.ts"

const WINDOW_PADDING = 64

const terrain = new Terrain({
  seed: 124,
  scale: 1,
  persistance: 0.8,
  lacunarity: 3,
  octaves: 6,
  redistribution: 1.0
})

const sketch = (p: p5) => {
  var currentView: View

  p.setup = () => {
    p.createCanvas(p.windowWidth - WINDOW_PADDING, p.windowHeight - WINDOW_PADDING)
    currentView = new DebugCoordinateView(p)
  }

  p.draw = () => {
    currentView.draw()
  }
}

new p5(sketch)
