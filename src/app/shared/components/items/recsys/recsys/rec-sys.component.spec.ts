import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecSysComponent } from './rec-sys.component';

describe('RecsysComponent', () => {
  let component: RecSysComponent;
  let fixture: ComponentFixture<RecSysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecSysComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecSysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
