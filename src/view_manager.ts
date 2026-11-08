import p5 from "p5"
import { Pane } from "tweakpane"
import type { View3D } from "./model/view/view3d"
import type { View2D } from "./model/view/view2d"
import { ZOOM_SENSITIVITY } from "./model/camera/camera2d"
import vector2 from "./lib/vector2"
import { TweakManager } from "./model/tweak_managers"

export type ViewFactory = (p: p5) => View2D | View3D

export let WINDOW_WIDTH: number
export let WINDOW_HEIGHT: number

const FPS_BUFFER_SIZE = 60

export class ViewManager {
  private p: p5
  private factories: Record<string, ViewFactory>
  private selection: { view: string }
  private active!: View2D | View3D
  private showFps: { show: boolean }
  private fpsBuffer: number[] = []

  public constructor(p: p5, pane: Pane, factories: Record<string, ViewFactory>) {
    const names = Object.keys(factories)
    this.p = p
    this.factories = factories
    this.selection = { view: names[0] }
    this.showFps = { show: true }
    this.activate(names[0])
    pane
      .addBinding(this.selection, "view", { options: Object.fromEntries(names.map((name) => [name, name])) })
      .on("change", (event) => this.activate(event.value))
    pane.addBinding(this.showFps, "show", { label: "showFps" })

    this.p.mouseDragged = (event) => onMouseDragged(event, this, this.p)
    this.p.mouseWheel = (event) => onMouseWheel(event, this, this.p)
    this.p.windowResized = (event) => onWindowResized(event, this.p)
    WINDOW_WIDTH = this.p.windowWidth
    WINDOW_HEIGHT = this.p.windowHeight
  }

  public render(): void {
    this.active.render()
    this.drawFps()
  }

  public getActive(): View2D | View3D {
    return this.active
  }

  private activate(name: string): void {
    TweakManager.instance.destroyAll()
    this.active = this.factories[name](this.p)
  }

  private drawFps() {
    if (this.showFps.show) {
      const sample = this.p.frameRate()
      this.fpsBuffer.push(sample)
      if (this.fpsBuffer.length > FPS_BUFFER_SIZE) {
        this.fpsBuffer = this.fpsBuffer.slice(this.fpsBuffer.length - FPS_BUFFER_SIZE)
      }
      let fps = 0
      for (const s of this.fpsBuffer)
        fps += s
      fps /= this.fpsBuffer.length
      this.p.stroke(0)
      this.p.fill(this.p.color("green"))
      const prevTextSize = this.p.textSize()
      this.p.textSize(32)
      this.p.text("FPS: " + fps.toFixed(2), 96, 32)
      this.p.textSize(prevTextSize)
    }
  }
}

function onMouseDragged(event: MouseEvent | undefined, viewManager: ViewManager, p: p5) {
  if (event === undefined)
    return
  const maxSize = Math.max(p.width, p.height)
  const delta = vector2.make(event.movementX, event.movementY)
  const deltaNormalized = vector2.scale(delta, 1 / maxSize)
  viewManager.getActive().getCamera().pan(deltaNormalized)
}

function onMouseWheel(event: WheelEvent | undefined, viewManager: ViewManager, p: p5) {
  if (event === undefined)
    return

  event.preventDefault()
  const maxSize = Math.max(p.width, p.height)
  const delta = vector2.make(event.movementX, event.movementY)
  const deltaNormalized = vector2.scale(delta, 1 / maxSize)
  viewManager.getActive().getCamera().zoom(deltaNormalized, Math.exp(-event.deltaY * ZOOM_SENSITIVITY))
}

function onWindowResized(event: Event | undefined, p: p5) {
  WINDOW_WIDTH = p.windowWidth
  WINDOW_HEIGHT = p.windowHeight
}
