import p5 from "p5"
import { Pane } from "tweakpane"
import type { View3D } from "./model/view/view3d"
import type { View2D } from "./model/view/view2d"
import { ZOOM_SENSITIVITY } from "./model/camera/camera2d"
import vector2 from "./lib/vector2"

export type ViewFactory = (p: p5) => View2D | View3D

export class ViewManager {
  private p: p5
  private factories: Record<string, ViewFactory>
  private selection: { view: string }
  private active!: View2D | View3D
  private showFps: { show: boolean }

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
  }

  public render(): void {
    this.active.render()
    this.drawFps()
  }

  public getActive(): View2D | View3D {
    return this.active
  }

  private activate(name: string): void {
    this.active = this.factories[name](this.p)
  }

  private drawFps() {
    if (this.showFps.show) {
      const fps = this.p.frameRate()
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
