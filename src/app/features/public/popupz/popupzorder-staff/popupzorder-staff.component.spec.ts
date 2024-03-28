import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupzorderStaffComponent } from './popupzorder-staff.component';

describe('PopupzorderStaffComponent', () => {
  let component: PopupzorderStaffComponent;
  let fixture: ComponentFixture<PopupzorderStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupzorderStaffComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PopupzorderStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
