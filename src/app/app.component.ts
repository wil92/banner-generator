import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {TextObject} from './draw-objects/text-object';
import {drawText} from './draw-text';

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
  textList: TextObject[] = [];

  isTextDrag = false;
  mousePrevPosX = null;
  mousePrevPosY = null;
  objectSelected = 0;

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

  ngOnInit(): void {
    this.form.controls.width.setValue(this.DEFAULT_WIDTH);
    this.form.controls.height.setValue(this.DEFAULT_HEIGHT);
    this.form.controls.title.setValue(this.DEFAULT_TITLE);
    this.form.controls.titleBackgroundColor.setValue('#f00');
    this.form.controls.titleTextColor.setValue('#000');

    this.textList.push(new TextObject(
      this.DEFAULT_TITLE, 0, this.DEFAULT_HEIGHT, 30, '#000',
      '#f00', this.TITLE_PADDING, this.TITLE_RANDOM_PADDING));
  }

  ngAfterViewInit(): void {
    // Load canvas context
    this.context = this.bannerCanvas.nativeElement.getContext('2d');

    // first render
    this.render();
  }

  updateParametersValues(): void {
    this.widthValue = this.form.controls.width.value || this.DEFAULT_WIDTH;
    this.heightValue = this.form.controls.height.value || this.DEFAULT_HEIGHT;

    this.render();
  }

  render(): void {
    this.cleanUpBoard();
    this.drawBackground();

    this.updateTextValue();

    for (const textObj of this.textList) {
      textObj.render(this.context);
    }
  }

  updateTextValue(): void {
    // toDo 02.05.21: at the moment is only one text
    this.textList[0].text = this.form.controls.title.value;
    this.textList[0].color = this.form.controls.titleTextColor.value;
    this.textList[0].background = this.form.controls.titleBackgroundColor.value;
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
      drawText(this.context, this.getRandomLetter(), color, x - offset, y - offset, size);
      drawText(this.context, this.getRandomLetter(), color, x - offset, y + offset, size);
      drawText(this.context, this.getRandomLetter(), color, x + offset, y - offset, size);
      drawText(this.context, this.getRandomLetter(), color, x + offset, y + offset, size);
    }
    this.context.globalAlpha = 1;
    drawText(this.context, this.getRandomLetter(), color, x, y, size);
  }

  getRandomLetter(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return characters[Math.floor(Math.random() * characters.length)];
  }

  onClickDown(event): void {
    const positionX = event.offsetX;
    const positionY = event.offsetY;
    for (let i = 0; i < this.textList.length; i++) {
      if (this.textList[i].insidePoint(positionX, positionY)) {
        this.objectSelected = i;
        this.updatePrevPos(event);
        this.isTextDrag = true;
        break;
      }
    }
  }

  onClickUp(event): void {
    this.isTextDrag = false;
  }

  onMouseMove(event): void {
    if (this.isTextDrag) {
      const positionX = event.offsetX;
      const positionY = event.offsetY;

      this.textList[this.objectSelected].x += positionX - this.mousePrevPosX;
      this.textList[this.objectSelected].y += positionY - this.mousePrevPosY;

      this.updatePrevPos(event);
      this.render();
    }
  }

  updatePrevPos(event): void {
    this.mousePrevPosX = event.offsetX;
    this.mousePrevPosY = event.offsetY;
  }
}
