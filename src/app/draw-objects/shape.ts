export interface Shape {
  insidePoint(x: number, y: number): boolean;
  render(context: CanvasRenderingContext2D): void;
}
