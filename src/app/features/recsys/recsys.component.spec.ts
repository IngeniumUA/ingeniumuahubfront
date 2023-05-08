import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecsysComponent } from './recsys.component';

describe('RecsysComponent', () => {
  let component: RecsysComponent;
  let fixture: ComponentFixture<RecsysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecsysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecsysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
