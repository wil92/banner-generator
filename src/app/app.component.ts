import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {TextObject} from './draw-objects/text-object';
import {drawText} from './draw-text';
import {Background} from './backgrounds/background';
import {MatrixBackground} from './backgrounds/matrix';
import {Shape} from './draw-objects/shape';
import {timer} from 'rxjs';

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

  objects: Shape[] = [];

  isTextDrag = false;
  mousePrevPosX = null;
  mousePrevPosY = null;
  objectSelected = 0;

  currentBackground: Background;

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

    this.currentBackground = new MatrixBackground(this.DEFAULT_WIDTH, this.DEFAULT_HEIGHT);

    this.objects.push(new TextObject(
      this.DEFAULT_TITLE, this.DEFAULT_WIDTH / 2, this.DEFAULT_HEIGHT / 2, 30, '#000',
      '#f00', this.TITLE_PADDING, this.TITLE_RANDOM_PADDING));
  }

  ngAfterViewInit(): void {
    // Load canvas context
    this.context = this.bannerCanvas.nativeElement.getContext('2d');

    // first render
    this.render();
  }

  updateParametersValues(): void {
    this.widthValue = this.toIntWithDefault(this.form.controls.width.value, this.DEFAULT_WIDTH);
    this.heightValue = this.toIntWithDefault(this.form.controls.height.value, this.DEFAULT_HEIGHT);

    this.currentBackground.width = this.widthValue;
    this.currentBackground.height = this.heightValue;

    timer(0).subscribe(() => {
      this.currentBackground.render(this.context, true);
      this.render();
    });
  }

  toIntWithDefault(value: string, defaultValue: number): number {
    try {
      return Number.parseInt(value, 10);
    } catch (ignore) {
    }
    return defaultValue;
  }

  render(): void {
    this.currentBackground.render(this.context);
    this.updateTextValue();

    for (const textObj of this.objects) {
      textObj.render(this.context);
    }
  }

  updateTextValue(): void {
    // toDo 02.05.21: at the moment is only one text
    (this.objects[0] as TextObject).text = this.form.controls.title.value;
    (this.objects[0] as TextObject).color = this.form.controls.titleTextColor.value;
    (this.objects[0] as TextObject).background = this.form.controls.titleBackgroundColor.value;
  }

  cleanUpBoard(): void {
    this.context.clearRect(0, 0, this.widthValue, this.heightValue);
  }

  onClickDown(event): void {
    const positionX = event.offsetX;
    const positionY = event.offsetY;
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i].insidePoint(positionX, positionY)) {
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

      this.objects[this.objectSelected].x += positionX - this.mousePrevPosX;
      this.objects[this.objectSelected].y += positionY - this.mousePrevPosY;

      this.updatePrevPos(event);
      this.render();
    }
  }

  updatePrevPos(event): void {
    this.mousePrevPosX = event.offsetX;
    this.mousePrevPosY = event.offsetY;
  }
}
