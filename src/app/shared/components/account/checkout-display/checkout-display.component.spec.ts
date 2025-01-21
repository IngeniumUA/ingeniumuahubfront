import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutDisplayComponent } from './checkout-display.component';

describe('TransactionDisplayComponent', () => {
  let component: CheckoutDisplayComponent;
  let fixture: ComponentFixture<CheckoutDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [CheckoutDisplayComponent]
})
      .compileComponents();

    fixture = TestBed.createComponent(CheckoutDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
