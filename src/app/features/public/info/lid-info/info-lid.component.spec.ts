import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLidComponent } from './info-lid.component';

describe('InfoLidComponent', () => {
  let component: InfoLidComponent;
  let fixture: ComponentFixture<InfoLidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [InfoLidComponent]
})
      .compileComponents();

    fixture = TestBed.createComponent(InfoLidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
