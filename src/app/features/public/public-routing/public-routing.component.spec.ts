import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRoutingComponent } from './public-routing.component';

describe('PublicRoutingComponent', () => {
  let component: PublicRoutingComponent;
  let fixture: ComponentFixture<PublicRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicRoutingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
