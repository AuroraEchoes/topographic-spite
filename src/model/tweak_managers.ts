import type { Pane } from "tweakpane"
import type { ITweakDrawer } from "./tweak_drawer"

export class TweakManager {
  public static instance: TweakManager
  private pane: Pane

  public constructor(pane: Pane) {
    this.pane = pane
    TweakManager.instance = this
  }

  public register(drawer: ITweakDrawer) {
    const folder = this.pane.addFolder({ title: drawer.folderName })
    drawer.registerTweakProperties(folder)
  }
}
