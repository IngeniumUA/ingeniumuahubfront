import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantusInfoComponent } from './cantus-info.component';

describe('CantusInfoComponent', () => {
  let component: CantusInfoComponent;
  let fixture: ComponentFixture<CantusInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CantusInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantusInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
