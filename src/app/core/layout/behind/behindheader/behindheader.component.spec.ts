import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindheaderComponent } from './behindheader.component';

describe('BehindheaderComponent', () => {
  let component: BehindheaderComponent;
  let fixture: ComponentFixture<BehindheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehindheaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BehindheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
