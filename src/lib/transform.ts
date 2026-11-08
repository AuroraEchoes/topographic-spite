import type { Vec3 } from "./vector3";
import vector3 from "./vector3";

export type Basis = {
  ihat: Vec3,
  jhat: Vec3,
  khat: Vec3
}

export class Transform {
  private position: Vec3
  private rotation: Vec3
  private basis: Basis
  private inverse: Basis

  public constructor(position: Vec3, rotation: Vec3) {
    this.position = position
    this.rotation = rotation
    this.updateBasisVectors()
    this.basis = this.getBasis()
    this.inverse = this.getInverse()
  }

  public getPosition(): Vec3 {
    return this.position
  }

  public getX(): number {
    return this.position.x
  }

  public setX(x: number) {
    this.position.x = x
  }

  public getY(): number {
    return this.position.y
  }

  public setY(y: number) {
    this.position.y = y
  }

  public getZ(): number {
    return this.position.z
  }

  public setZ(z: number) {
    this.position.z = z
  }

  public setPosition(position: Vec3) {
    this.position = position
  }

  public getRotation(): Vec3 {
    return this.rotation
  }

  public setRotation(rotation: Vec3) {
    this.rotation = rotation
    this.updateBasisVectors()
  }

  public getPitch(): number {
    return this.rotation.x
  }

  public setPitch(pitch: number) {
    this.rotation.x = pitch
    this.updateBasisVectors()
  }

  public getYaw() {
    return this.rotation.y
  }

  public setYaw(yaw: number) {
    this.rotation.y = yaw
    this.updateBasisVectors()
  }

  public getRoll(): number {
    return this.rotation.z
  }

  public setRoll(roll: number) {
    this.rotation.z = roll
    this.updateBasisVectors()
  }

  public static transformPoint(point: Vec3, ihat: Vec3, jhat: Vec3, khat: Vec3): Vec3 {
    const i = vector3.scale(ihat, point.x)
    const j = vector3.scale(jhat, point.y)
    const k = vector3.scale(khat, point.z)

    return vector3.add(i, vector3.add(j, k))
  }

  // Local -> World
  public transform(local: Vec3) {
    const rot = Transform.transformPoint(local, this.basis.ihat, this.basis.jhat, this.basis.khat)
    return vector3.add(rot, this.position)
  }

  // World -> Local
  public transformInverse(point: Vec3) {
    const p = vector3.sub(point, this.position)
    return Transform.transformPoint(p, this.inverse.ihat, this.inverse.jhat, this.inverse.khat)
  }

  public getBasis(): Basis {
    return this.basis
  }

  public getInverse(): Basis {
    return this.inverse
  }

  private updateBasisVectors() {
    const yaw = this.getYaw()
    const pitch = this.getPitch()
    const roll = this.getRoll()

    const iYaw = vector3.make(Math.cos(yaw), 0, Math.sin(yaw))
    const jYaw = vector3.make(0, 1, 0)
    const kYaw = vector3.make(-Math.sin(yaw), 0, Math.cos(yaw))

    const iPitch = vector3.make(1, 0, 0)
    const jPitch = vector3.make(0, Math.cos(pitch), -Math.sin(pitch))
    const kPitch = vector3.make(0, Math.sin(pitch), Math.cos(pitch))

    const iRoll = vector3.make(Math.cos(roll), Math.sin(roll), 0)
    const jRoll = vector3.make(-Math.sin(roll), Math.cos(roll), 0)
    const kRoll = vector3.make(0, 0, 1)

    const iPitchYaw = Transform.transformPoint(iPitch, iYaw, jYaw, kYaw)
    const jPitchYaw = Transform.transformPoint(jPitch, iYaw, jYaw, kYaw)
    const kPitchYaw = Transform.transformPoint(kPitch, iYaw, jYaw, kYaw)

    const i = Transform.transformPoint(iRoll, iPitchYaw, jPitchYaw, kPitchYaw)
    const j = Transform.transformPoint(jRoll, iPitchYaw, jPitchYaw, kPitchYaw)
    const k = Transform.transformPoint(kRoll, iPitchYaw, jPitchYaw, kPitchYaw)

    this.basis = { ihat: i, jhat: j, khat: k }

    const iInv = vector3.make(i.x, j.x, k.x)
    const jInv = vector3.make(i.y, j.y, k.y)
    const kInv = vector3.make(i.z, j.z, k.z)

    this.inverse = { ihat: iInv, jhat: jInv, khat: kInv }
  }
}
