import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartweekComponent } from './startweek.component';

describe('StartweekComponent', () => {
  let component: StartweekComponent;
  let fixture: ComponentFixture<StartweekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartweekComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StartweekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
