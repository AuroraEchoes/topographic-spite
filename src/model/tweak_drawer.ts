import type { FolderApi } from "tweakpane"

export interface ITweakDrawer {
  folderName: string
  registerTweakProperties(folder: FolderApi): void
}
