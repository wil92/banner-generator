import {Shape} from './shape';
import {drawText} from '../draw-text';

export class TextObject implements Shape {

  shapePoints: Array<any> = [];

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
    initX -= this.padding;
    initY += this.padding;

    const dx00 = Math.random() * this.randomPadding, dx01 = Math.random() * this.randomPadding,
      dx02 = Math.random() * this.randomPadding, dx03 = Math.random() * this.randomPadding;
    const dy00 = Math.random() * this.randomPadding, dy01 = Math.random() * this.randomPadding,
      dy02 = Math.random() * this.randomPadding, dy03 = Math.random() * this.randomPadding;

    this.shapePoints = [];

    context.beginPath();
    context.moveTo(initX - dx00, initY + dy00);
    context.lineTo(initX + width + this.padding * 2 + dx01, initY + dy01);
    this.shapePoints.push({x: initX + width + this.padding * 2 + dx01, y: initY + dy01});
    context.lineTo(initX + width + this.padding * 2 + dx02, initY - height - this.padding * 2 - dy02);
    this.shapePoints.push({x: initX + width + this.padding * 2 + dx02, y: initY - height - this.padding * 2 - dy02});
    context.lineTo(initX - dx03, initY - height - this.padding * 2 - dy03);
    this.shapePoints.push({x: initX - dx03, y: initY - height - this.padding * 2 - dy03});
    context.lineTo(initX - dx00, initY + dy00);
    this.shapePoints.push({x: initX - dx00, y: initY + dy00});
    context.closePath();
    context.fillStyle = this.background;
    context.fill();
  }
}