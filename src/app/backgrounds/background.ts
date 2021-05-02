export abstract class Background {
  constructor(public width: number, public height: number) {
  }
  abstract render(context: CanvasRenderingContext2D, force?: boolean): void;
  abstract destroy(): void;
}
