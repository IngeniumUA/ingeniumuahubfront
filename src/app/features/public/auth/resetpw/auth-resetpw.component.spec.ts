import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthResetpwComponent } from './auth-resetpw.component';

describe('AuthResetpwComponent', () => {
  let component: AuthResetpwComponent;
  let fixture: ComponentFixture<AuthResetpwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthResetpwComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthResetpwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
