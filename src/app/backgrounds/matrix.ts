import {drawText} from '../draw-text';
import {Background} from './background';

export class MatrixBackground implements Background {

  savedImage: ImageData = null;

  constructor(public width: number, public height: number) {
  }

  render(context: CanvasRenderingContext2D, force?: boolean): void {
    if (!!this.savedImage) {
      context.putImageData(this.savedImage, 0, 0);
      return;
    }

    context.fillStyle = '#000';
    context.fillRect(0, 0, this.width, this.height);

    const textColor = '#45ba49';
    const textMainColor = '#85d98f';

    const textSize = 8;
    context.font = `${textSize}px Arial`;
    const letterWidth = context.measureText('M').width;
    const columnsPadding = 1;

    const numberOfColumns = this.width / (letterWidth + columnsPadding);
    const maxNumberOfLetters = this.height / textSize;
    for (let i = 0; i < numberOfColumns; i++) {
      // toDo 02.05.21: randomize this

      const numberOfLetters = Math.ceil(Math.random() * maxNumberOfLetters);
      for (let j = 0; j < numberOfLetters; j++) {
        if (j + 1 < numberOfLetters) {
          this.blurLetter(context, (letterWidth + columnsPadding) * i, textSize * (j + 1), textColor, textSize, 2);
        } else {
          this.blurLetter(context, (letterWidth + columnsPadding) * i, textSize * (j + 1), textMainColor, textSize, 4);
        }
      }
    }

    // random strings
    for (let i = 0; i < 20; i++) {
      const xPosition = Math.floor(Math.random() * numberOfColumns);
      const yPosition = maxNumberOfLetters - Math.floor(Math.random() * 15);

      for (let j = yPosition; j <= maxNumberOfLetters; j++) {
        this.blurLetter(context, (letterWidth + columnsPadding) * xPosition, textSize * (j + 1), textColor, textSize, 3);
      }
    }

    this.savedImage = context.getImageData(0, 0, this.width, this.height);
  }

  blurLetter(context: CanvasRenderingContext2D, x, y, color, size, intensity): void {
    context.globalAlpha = 0.1;
    const offset = 1;
    for (let i = 0; i < intensity; i++) {
      drawText(context, this.getRandomLetter(), color, x - offset, y - offset, size);
      drawText(context, this.getRandomLetter(), color, x - offset, y + offset, size);
      drawText(context, this.getRandomLetter(), color, x + offset, y - offset, size);
      drawText(context, this.getRandomLetter(), color, x + offset, y + offset, size);
    }
    context.globalAlpha = 1;
    drawText(context, this.getRandomLetter(), color, x, y, size);
  }

  getRandomLetter(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return characters[Math.floor(Math.random() * characters.length)];
  }
}
