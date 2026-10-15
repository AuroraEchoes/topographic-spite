import p5 from "p5"
import { Pane } from "tweakpane"
import { View } from "./view"

export type ViewFactory = (p: p5) => View

export class ViewManager {
  private p: p5
  private factories: Record<string, ViewFactory>
  private selection: { view: string }
  private active: View

  public constructor(p: p5, pane: Pane, factories: Record<string, ViewFactory>) {
    const names = Object.keys(factories)
    this.p = p
    this.factories = factories
    this.selection = { view: names[0] }
    this.active = factories[names[0]](p)

    pane
      .addBinding(this.selection, "view", { options: Object.fromEntries(names.map((name) => [name, name])) })
      .on("change", (event) => this.activate(event.value))
  }

  public draw(): void {
    this.active.draw()
  }

  private activate(name: string): void {
    this.active = this.factories[name](this.p)
  }
}
