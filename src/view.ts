import p5 from "p5";
import vector, { type Vec2 } from "./lib/vector.ts"
import { Camera2D, ZOOM_SENSITIVITY } from "./camera.ts";

export abstract class View {
  protected p: p5
  protected camera: Camera2D
  protected center: Vec2

  public constructor(p: p5) {
    this.p = p;
    this.camera = new Camera2D(p)
    this.center = vector.make(0, 0)
  }

  public activate() {
    this.p.mouseDragged = (event) => onMouseDragged(event, this.camera)
    this.p.mouseWheel = (event) => onMouseWheel(event, this.camera, this.p)
  }

  public abstract draw(): void
}

function onMouseDragged(event: MouseEvent | undefined, camera: Camera2D) {
  console.log("Mouse dragged with", event === undefined)
  if (event === undefined)
    return
  camera.panByPx(vector.make(event.movementX, event.movementY))
}

function onMouseWheel(event: WheelEvent | undefined, camera: Camera2D, p: p5) {
  if (event === undefined)
    return

  event.preventDefault()
  camera.zoomAt(vector.make(p.mouseX, p.mouseY), Math.exp(-event.deltaY * ZOOM_SENSITIVITY))
}
