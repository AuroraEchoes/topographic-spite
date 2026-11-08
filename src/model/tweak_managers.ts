import type { FolderApi, Pane } from "tweakpane"
import type { ITweakDrawer } from "./tweak_drawer"

export class TweakManager {
  public static instance: TweakManager
  private pane: Pane
  private folders: FolderApi[]

  public constructor(pane: Pane) {
    this.pane = pane
    this.folders = []
    TweakManager.instance = this
  }

  public register(drawer: ITweakDrawer) {
    const folder = this.pane.addFolder({ title: drawer.folderName })
    drawer.registerTweakProperties(folder)
    this.folders.push(folder)
  }

  public destroyAll() {
    for (const folder of this.folders) {
      this.pane.remove(folder)
    }
    this.folders = []
  }
}
