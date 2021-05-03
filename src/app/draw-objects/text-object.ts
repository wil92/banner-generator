import {Shape} from './shape';
import {drawText} from '../draw-text';

export class TextObject extends Shape {

  shapePoints: Array<any> = [];

  dx00: number;
  dy00: number;
  dx01: number;
  dy01: number;
  dx02: number;
  dy02: number;
  dx03: number;
  dy03: number;

  constructor(
    public text: string,
    public x: number,
    public y: number,
    public size: number,
    public color: string,
    public background: string,
    public padding: number,
    public randomPadding: number
  ) {
    super(x, y);
    this.calculateOffset();
  }

  calculateOffset() {
    this.dx00 = Math.random() * this.randomPadding;
    this.dx01 = Math.random() * this.randomPadding;
    this.dx02 = Math.random() * this.randomPadding;
    this.dx03 = Math.random() * this.randomPadding;
    this.dy00 = Math.random() * this.randomPadding;
    this.dy01 = Math.random() * this.randomPadding;
    this.dy02 = Math.random() * this.randomPadding;
    this.dy03 = Math.random() * this.randomPadding;
  }

  insidePoint(x: number, y: number): boolean {
    if (this.shapePoints.length > 0) {
      let minX = this.shapePoints[0].x, minY = this.shapePoints[0].y, maxX = this.shapePoints[0].x, maxY = this.shapePoints[0].y;
      for (const point of this.shapePoints) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      }
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    return false;
  }

  render(context: CanvasRenderingContext2D): void {
    const title = this.text;
    const textSize = this.size;

    context.font = `${textSize}px Arial`;
    const titleWidth = context.measureText(title).width;
    const titleHeight = textSize;

    const newTextPositionX = this.x;
    const newTextPositionY = this.y;

    this.drawTextContainer(context, newTextPositionX, newTextPositionY, titleWidth, titleHeight);
    drawText(context, this.text, this.color, newTextPositionX, newTextPositionY, textSize);
  }

  drawTextContainer(context: CanvasRenderingContext2D, initX: number, initY: number, width: number, height: number): void {
    if (!this.background) {
      return;
    }

    initX -= this.padding;
    initY += this.padding;

    this.shapePoints = [];

    context.beginPath();
    context.moveTo(initX - this.dx00, initY + this.dy00);
    context.lineTo(initX + width + this.padding * 2 + this.dx01, initY + this.dy01);
    this.shapePoints.push({x: initX + width + this.padding * 2 + this.dx01, y: initY + this.dy01});
    context.lineTo(initX + width + this.padding * 2 + this.dx02, initY - height - this.padding * 2 - this.dy02);
    this.shapePoints.push({x: initX + width + this.padding * 2 + this.dx02, y: initY - height - this.padding * 2 - this.dy02});
    context.lineTo(initX - this.dx03, initY - height - this.padding * 2 - this.dy03);
    this.shapePoints.push({x: initX - this.dx03, y: initY - height - this.padding * 2 - this.dy03});
    context.lineTo(initX - this.dx00, initY + this.dy00);
    this.shapePoints.push({x: initX - this.dx00, y: initY + this.dy00});
    context.closePath();
    context.fillStyle = this.background;
    context.fill();
  }
}
