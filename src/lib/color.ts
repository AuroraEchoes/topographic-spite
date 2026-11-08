export class Color {
  private static cssCache: Map<number, string> = new Map<number, string>()
  public r: number
  public g: number
  public b: number

  public constructor(r: number, g: number, b: number) {
    this.r = r
    this.g = g
    this.b = b
  }

  public hash(): number {
    return this.r + this.g * 2 + this.b * 4
  }

  public toCssColor(): string {
    const hash = this.hash()
    if (Color.cssCache.has(hash)) {
      return Color.cssCache.get(hash)!
    }
    else {
      const str = `rgb(${this.r * 255} ${this.g * 255} ${this.b * 255})`
      Color.cssCache.set(hash, str)
      return str
    }
  }
}
