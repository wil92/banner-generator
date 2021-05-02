import {Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-input-element',
  templateUrl: './input-element.component.html',
  styleUrls: ['./input-element.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputElementComponent),
      multi: true
    }
  ]
})
export class InputElementComponent implements OnInit, OnDestroy, ControlValueAccessor {

  INTERVAL_TO_UPDATE = 500;

  // tslint:disable-next-line:variable-name
  _unsubscribe = new Subject();
  valueChangeUnsubscribe = new Subject();

  @Output() inputValue = new EventEmitter<void>();
  @Input() label = '';
  @Input() placeholder = '';

  value = '';
  disabled = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
  }

  valueChange(): void {
    this.valueChangeUnsubscribe.next();
    console.log(this.value);
    this.onChange(this.value);
    timer(this.INTERVAL_TO_UPDATE)
      .pipe(
        takeUntil(this._unsubscribe),
        takeUntil(this.valueChangeUnsubscribe))
      .subscribe(() => this.inputValue.emit());
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
  }

}
