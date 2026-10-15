import p5 from "p5"
import type { View } from "./view"
import { Terrain } from "./model/terrain.ts"
import { DebugBasicSquares } from "./views/debug/debug_basic_squares.ts"

const WINDOW_PADDING = 64

const terrain = new Terrain({
  seed: 124816,
  scale: 0.05,
  persistance: 0.1,
  lacunarity: 0.1,
  octaves: 6,
  redistribution: 1.0
})

const sketch = (p: p5) => {
  var currentView: View

  p.setup = () => {
    p.createCanvas(p.windowWidth - WINDOW_PADDING, p.windowHeight - WINDOW_PADDING)
    currentView = new DebugBasicSquares(p, terrain)
  }

  p.draw = () => {
    currentView.draw()
  }
}

new p5(sketch)
