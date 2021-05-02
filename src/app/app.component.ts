import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {init} from 'protractor/built/launcher';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  DEFAULT_WIDTH = 600;
  DEFAULT_HEIGHT = 275;

  TITLE_PADDING = 10;
  TITLE_RANDOM_PADDING = 20;
  DEFAULT_TITLE = 'Initial title';

  form = new FormGroup({
    width: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    titleBackgroundColor: new FormControl('', [Validators.required]),
    titleTextColor: new FormControl('', [Validators.required]),
  });

  widthValue = this.DEFAULT_WIDTH;
  heightValue = this.DEFAULT_HEIGHT;

  @ViewChild('bannerCanvas')
  bannerCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  constructor() {
  }

  ngAfterViewInit(): void {
    // Load canvas context
    this.context = this.bannerCanvas.nativeElement.getContext('2d');

    this.render();
  }

  ngOnInit(): void {
    this.form.controls.width.setValue(this.DEFAULT_WIDTH);
    this.form.controls.height.setValue(this.DEFAULT_HEIGHT);
    this.form.controls.title.setValue(this.DEFAULT_TITLE);
    this.form.controls.titleBackgroundColor.setValue('#f00');
    this.form.controls.titleTextColor.setValue('#000');
  }

  updateParametersValues(): void {
    this.widthValue = this.form.controls.width.value || this.DEFAULT_WIDTH;
    this.heightValue = this.form.controls.height.value || this.DEFAULT_HEIGHT;

    this.render();
  }

  render(): void {
    this.cleanUpBoard();
    this.drawBackground();
    this.renderTitle();
  }

  renderTitle(): void {
    const title = this.form.controls.title.value;
    // toDo 02.05.21: research about this
    const textSize = 30;

    this.context.font = `${textSize}px Arial`;
    const titleWidth = this.context.measureText(title).width;
    const titleHeight = textSize;
    const newTextPositionX = this.widthValue / 2 - titleWidth / 2;
    const newTextPositionY = this.heightValue / 2;

    const titleBackgroundColor = this.form.controls.titleBackgroundColor.value;
    this.drawTitleContainer(newTextPositionX, newTextPositionY, titleWidth, titleHeight, titleBackgroundColor);

    const titleTextColor = this.form.controls.titleTextColor.value;
    this.drawText(this.form.controls.title.value, titleTextColor, newTextPositionX, newTextPositionY, textSize);
  }

  drawTitleContainer(initX: number, initY: number, width: number, height: number, color: string): void {
    initX -= this.TITLE_PADDING;
    initY += this.TITLE_PADDING;

    const dx00 = Math.random() * this.TITLE_RANDOM_PADDING, dx01 = Math.random() * this.TITLE_RANDOM_PADDING,
      dx02 = Math.random() * this.TITLE_RANDOM_PADDING, dx03 = Math.random() * this.TITLE_RANDOM_PADDING;
    const dy00 = Math.random() * this.TITLE_RANDOM_PADDING, dy01 = Math.random() * this.TITLE_RANDOM_PADDING,
      dy02 = Math.random() * this.TITLE_RANDOM_PADDING, dy03 = Math.random() * this.TITLE_RANDOM_PADDING;

    this.context.beginPath();
    this.context.moveTo(initX - dx00, initY + dy00);
    this.context.lineTo(initX + width + this.TITLE_PADDING * 2 + dx01, initY + dy01);
    this.context.lineTo(initX + width + this.TITLE_PADDING * 2 + dx02, initY - height - this.TITLE_PADDING * 2 - dy02);
    this.context.lineTo(initX - dx03, initY - height  - this.TITLE_PADDING * 2 - dy03);
    this.context.lineTo(initX - dx00, initY + dy00);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill();
  }

  cleanUpBoard(): void {
    this.context.clearRect(0, 0, this.widthValue, this.heightValue);
  }

  drawBackground(): void {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.widthValue, this.heightValue);

    const textColor = '#45ba49';
    const textMainColor = '#85d98f';

    const textSize = 8;
    this.context.font = `${textSize}px Arial`;
    const letterWidth = this.context.measureText('M').width;
    const columnsPadding = 1;

    const numberOfColumns = this.widthValue / (letterWidth + columnsPadding);
    const maxNumberOfLetters = this.heightValue / textSize;
    for (let i = 0; i < numberOfColumns; i++) {
      // toDo 02.05.21: randomize this

      const numberOfLetters = Math.ceil(Math.random() * maxNumberOfLetters);
      for (let j = 0; j < numberOfLetters; j++) {
        if (j + 1 < numberOfLetters) {
          // this.drawText(this.getRandomLetter(), textColor, (letterWidth + columnsPadding) * i, textSize * (j + 1), textSize);
          this.blurLetter((letterWidth + columnsPadding) * i, textSize * (j + 1), textColor, textSize, 2);
        } else {
          this.blurLetter((letterWidth + columnsPadding) * i, textSize * (j + 1), textMainColor, textSize, 4);
        }
      }
    }

    // random strings
    for (let i = 0; i < 20; i++) {
      const xPosition = Math.floor(Math.random() * numberOfColumns);
      const yPosition = maxNumberOfLetters - Math.floor(Math.random() * 15);

      for (let j = yPosition; j <= maxNumberOfLetters; j++) {
        this.blurLetter((letterWidth + columnsPadding) * xPosition, textSize * (j + 1), textColor, textSize, 3);
      }
    }
  }

  blurLetter(x, y, color, size, intensity): void {
    this.context.globalAlpha = 0.1;
    const offset = 1;
    for (let i = 0; i < intensity; i++) {
      this.drawText(this.getRandomLetter(), color, x - offset, y - offset, size);
      this.drawText(this.getRandomLetter(), color, x - offset, y + offset, size);
      this.drawText(this.getRandomLetter(), color, x + offset, y - offset, size);
      this.drawText(this.getRandomLetter(), color, x + offset, y + offset, size);
    }
    this.context.globalAlpha = 1;
    this.drawText(this.getRandomLetter(), color, x, y, size);
  }

  getRandomLetter(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return characters[Math.floor(Math.random() * characters.length)];
  }

  drawText(text: string, color: string, x: number, y: number, textSize: number): void {
    this.context.font = `${textSize}px Arial`;
    this.context.fillStyle = color;
    this.context.fillText(text, x, y);
  }

}
