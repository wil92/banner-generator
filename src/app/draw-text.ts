export function drawText(context: CanvasRenderingContext2D, text: string, color: string, x: number, y: number, textSize: number): void {
  context.font = `${textSize}px Arial`;
  context.fillStyle = color;
  context.fillText(text, x, y);
}
