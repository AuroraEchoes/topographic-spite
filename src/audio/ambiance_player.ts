import type { FolderApi } from "tweakpane";
import { clamp, lerp, remap } from "../lib/math";
import type { ITweakDrawer } from "../model/tweak_drawer";
import type { AmbianceContext } from "./ambiance_context";
import type { AmbianceProfile } from "./ambiance_profile";
import { TweakManager } from "../model/tweak_managers";

export class AmbiancePlayer implements ITweakDrawer {
  private profiles: AmbianceProfile[]
  private context: AmbianceContext
  private pipelines: Map<string, AmbianceProfilePipeline> = new Map<string, AmbianceProfilePipeline>()
  private bindables: Record<string, number> = {}
  private audioContext: AudioContext
  public folderName = "Ambiance Player";

  public constructor(profiles: AmbianceProfile[], context: AmbianceContext) {
    this.profiles = profiles
    this.context = context
    this.audioContext = new AudioContext()
    this.initializeAudio()
    TweakManager.instance.register(this)
  }

  public registerTweakProperties(folder: FolderApi): void {
    for (const profile of this.profiles) {
      this.bindables[profile.name] ??= 0
      folder.addBinding(this.bindables, profile.name, {
        readonly: true,
        view: "graph",
        min: 0,
        max: 1,
        interval: 200,
        label: profile.name
      })
    }
  }

  public update() {
    this.startAudioIfPaused()

    for (const profile of this.profiles) {
      const value = clamp(profile.getValue(this.context), 0, 1)
      let fadeVal = 1
      if (profile.startFadeInVal !== undefined && profile.endFadeInVal !== undefined) {
        const val = clamp(remap(profile.startFadeInVal, profile.endFadeInVal, 0, 1, value), 0, 1)
        fadeVal *= val
      }

      if (profile.startFadeOutVal !== undefined && profile.endFadeOutVal !== undefined) {
        const val = 1 - clamp(remap(profile.startFadeOutVal, profile.endFadeOutVal, 0, 1, value), 0, 1)
        fadeVal *= val
      }

      const gain = lerp(profile.minGain, profile.maxGain, fadeVal)
      const pipeline = this.pipelines.get(profile.name)
      if (pipeline !== undefined) {
        pipeline.gain.gain.value = gain
      }
      this.bindables[profile.name] = fadeVal
    }
  }

  private async initializeAudio() {
    for (const profile of this.profiles) {
      const response = await fetch(profile.path)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      const source = this.audioContext.createBufferSource()
      source.loop = true

      const gain = this.audioContext.createGain()
      gain.gain.value = 0.0
      source.buffer = audioBuffer
      source.connect(gain)
      gain.connect(this.audioContext.destination)
      source.start()

      this.pipelines.set(profile.name, { source: source, gain: gain })
      this.bindables[profile.name] = 0
    }
  }

  private async startAudioIfPaused() {
    if (this.audioContext.state === "running")
      return
    await this.audioContext.resume()
  }
}

type AmbianceProfilePipeline = {
  source: AudioBufferSourceNode,
  gain: GainNode
}
