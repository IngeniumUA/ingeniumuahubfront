import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupzAllergiesComponent } from './popupz-allergies.component';

describe('PopupzAllergiesComponent', () => {
  let component: PopupzAllergiesComponent;
  let fixture: ComponentFixture<PopupzAllergiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupzAllergiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupzAllergiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
