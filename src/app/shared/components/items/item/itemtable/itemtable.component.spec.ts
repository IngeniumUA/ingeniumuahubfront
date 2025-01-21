import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemtableComponent } from './itemtable.component';

describe('ItemtableComponent', () => {
  let component: ItemtableComponent;
  let fixture: ComponentFixture<ItemtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ItemtableComponent]
})
      .compileComponents();

    fixture = TestBed.createComponent(ItemtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
