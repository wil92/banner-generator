import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {ColorPickerModule} from 'ngx-color-picker';

import {AppComponent} from './app.component';
import {InputElementComponent} from './input-value/input-element.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ColorPickerModule
  ],
  declarations: [
    AppComponent,
    InputElementComponent,
    ColorPickerComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
