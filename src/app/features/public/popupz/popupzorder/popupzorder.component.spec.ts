import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupzorderComponent } from './popupzorder.component';

describe('PopupzorderComponent', () => {
  let component: PopupzorderComponent;
  let fixture: ComponentFixture<PopupzorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupzorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupzorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
