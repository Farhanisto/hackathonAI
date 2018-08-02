export interface IRect {
  x: number
  y: number
  width: number
  height: number
}

export class Rect implements IRect {
  public x: number
  public y: number
  public width: number
  public height: number

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  public toSquare(): Rect {
    let { x, y, width, height } = this
    const diff = Math.abs(width - height)
    if (width < height) {
      x -= (diff / 2)
      width += diff
    }
    if (height < width) {
      y -= (diff / 2)
      height += diff
    }
    return new Rect(x, y, width, height)
  }

  public pad(padX: number, padY: number): Rect {
    let { x, y, width, height } = this
    return new Rect(x - (padX / 2), y - (padY / 2), width + padX, height + padY)
  }

  public floor(): Rect {
    return new Rect(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.width),
      Math.floor(this.height)
    )
  }
}