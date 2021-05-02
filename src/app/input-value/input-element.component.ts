import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

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
export class InputElementComponent implements OnInit, ControlValueAccessor {

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

  valueChange(): void {
    this.onChange(this.value);
    this.inputValue.emit();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
    this.onChange(value);
  }

}
