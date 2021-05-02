import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {

  @Input() defaultColor = '#f00';
  @Input() titleText = 'color';
  @Output() colorChange = new EventEmitter<void>();

  color: string;

  onChange = (ignore: string) => {};

  constructor() {
  }

  ngOnInit(): void {
    this.color = this.defaultColor;
  }

  onColorChange(): void {
    this.onChange(this.color);
    this.colorChange.emit();
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(fn: any): void {
    // toDo 02.05.21: check this in the future
  }

  writeValue(color: string): void {
    this.color = color;
  }

}
