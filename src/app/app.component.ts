import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {timer} from 'rxjs';

import {TextObject} from './draw-objects/text-object';
import {Background} from './backgrounds/background';
import {MatrixBackground} from './backgrounds/matrix';
import {Shape} from './draw-objects/shape';

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
    texts: new FormArray([])
  });
  texts: FormArray = this.form.get('texts') as FormArray;

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

    this.currentBackground = new MatrixBackground(this.DEFAULT_WIDTH, this.DEFAULT_HEIGHT);
  }

  createText(): void {
    const group = new FormGroup({
      title: new FormControl(''),
      titleBackgroundColor: new FormControl(''),
      titleTextColor: new FormControl(''),
      id: new FormControl('')
    });

    const id = this.randomId();

    const INITIAL_TEXT_COLOR = '#fff';
    const INITIAL_TEXT_BACKGROUND_COLOR = '#ff000000';

    group.get('title').setValue(this.DEFAULT_TITLE);
    group.get('titleBackgroundColor').setValue(INITIAL_TEXT_BACKGROUND_COLOR);
    group.get('titleTextColor').setValue(INITIAL_TEXT_COLOR);
    group.get('id').setValue(id);

    this.texts.push(group);
    this.objects.push(new TextObject(
      this.DEFAULT_TITLE, id, this.DEFAULT_WIDTH / 2, this.DEFAULT_HEIGHT / 2, 30, INITIAL_TEXT_COLOR,
      INITIAL_TEXT_BACKGROUND_COLOR, this.TITLE_PADDING, this.TITLE_RANDOM_PADDING));

    this.render();
  }

  refreshBackground(): void {
    this.render(true);
  }

  removeText(id: string): void {
    const index = this.texts.getRawValue().findIndex(v => v.id === id);
    this.texts.removeAt(index);
    this.objects = this.objects.filter(obj => obj.id !== id);

    this.render();
  }

  randomId(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
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

  renderText(index: number): void {
    this.updateTextValue(index);
    this.render();
  }

  updateTextValue(index: number): void {
    (this.objects[index] as TextObject).text = this.texts.controls[index].get('title').value;
    (this.objects[index] as TextObject).color = this.texts.controls[index].get('titleTextColor').value;
    (this.objects[index] as TextObject).background =
      this.texts.controls[index].get('titleBackgroundColor').value;
  }

  render(force = false): void {
    this.currentBackground.render(this.context, force);

    for (const textObj of this.objects) {
      textObj.render(this.context);
    }
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
