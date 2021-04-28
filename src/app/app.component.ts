import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  INTERVAL_TO_UPDATE = 500;
  DEFAULT_WIDTH = 500;
  DEFAULT_HEIGHT = 500;

  form = new FormGroup({
    width: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required]),
  });

  widthValue = this.DEFAULT_WIDTH;
  heightValue = this.DEFAULT_HEIGHT;

  // tslint:disable-next-line:variable-name
  _unsubscribe = new Subject();
  valueChangeUnsubscribe = new Subject();

  constructor() {
  }

  ngOnInit(): void {
    this.form.controls.width.setValue(this.DEFAULT_WIDTH);
    this.form.controls.height.setValue(this.DEFAULT_HEIGHT);
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
  }

  valueChange(): void {
    this.valueChangeUnsubscribe.next();
    timer(this.INTERVAL_TO_UPDATE)
      .pipe(
        takeUntil(this._unsubscribe),
        takeUntil(this.valueChangeUnsubscribe))
      .subscribe(() => this.updateParametersValues());
  }

  updateParametersValues(): void {
    this.widthValue = this.form.controls.width.value || this.DEFAULT_WIDTH;
    this.heightValue = this.form.controls.height.value || this.DEFAULT_HEIGHT;
  }

}
