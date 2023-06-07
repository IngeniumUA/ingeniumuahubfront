import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerItemsDashboardComponent } from './manager-items-dashboard.component';

describe('ItemsComponent', () => {
  let component: ManagerItemsDashboardComponent;
  let fixture: ComponentFixture<ManagerItemsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerItemsDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerItemsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
