import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetpwComponent } from './setpw.component';

describe('SetpwComponent', () => {
  let component: SetpwComponent;
  let fixture: ComponentFixture<SetpwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetpwComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SetpwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
