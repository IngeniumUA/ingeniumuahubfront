import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecSysFormComponent } from './rec-sys-form.component';

describe('RecsysComponent', () => {
  let component: RecSysFormComponent;
  let fixture: ComponentFixture<RecSysFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecSysFormComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecSysFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
