import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InputElementComponent} from './input-element.component';

describe('InputValueComponent', () => {
  let component: InputElementComponent;
  let fixture: ComponentFixture<InputElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputElementComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
