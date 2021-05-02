export abstract class Shape {
  protected constructor(public x: number, public y: number) {
  }

  abstract insidePoint(x: number, y: number): boolean;

  abstract render(context: CanvasRenderingContext2D): void;
}
