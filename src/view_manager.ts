import p5 from "p5"
import { Pane } from "tweakpane"
import { View } from "./view"

export type ViewFactory = (p: p5) => View

export class ViewManager {
  private p: p5
  private factories: Record<string, ViewFactory>
  private selection: { view: string }
  private active!: View
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
  }

  public draw(): void {
    this.active.draw()
    this.drawFps()
  }

  private activate(name: string): void {
    this.active = this.factories[name](this.p)
    this.active.activate()
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
