import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  DEFAULT_WIDTH = 600;
  DEFAULT_HEIGHT = 275;

  form = new FormGroup({
    width: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required]),
  });

  widthValue = this.DEFAULT_WIDTH;
  heightValue = this.DEFAULT_HEIGHT;

  constructor() {
  }

  ngOnInit(): void {
    this.form.controls.width.setValue(this.DEFAULT_WIDTH);
    this.form.controls.height.setValue(this.DEFAULT_HEIGHT);
  }

  updateParametersValues(): void {
    this.widthValue = this.form.controls.width.value || this.DEFAULT_WIDTH;
    this.heightValue = this.form.controls.height.value || this.DEFAULT_HEIGHT;
  }

}
