import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemlogComponent } from './itemlog.component';

describe('ItemlogsComponent', () => {
  let component: ItemlogComponent;
  let fixture: ComponentFixture<ItemlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemlogComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
