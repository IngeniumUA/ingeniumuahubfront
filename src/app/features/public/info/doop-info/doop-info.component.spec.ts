import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoopInfoComponent } from './doop-info.component';

describe('DoopInfoComponent', () => {
  let component: DoopInfoComponent;
  let fixture: ComponentFixture<DoopInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoopInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoopInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
