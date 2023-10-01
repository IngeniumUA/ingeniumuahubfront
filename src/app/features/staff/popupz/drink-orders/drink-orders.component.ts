import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/core/services/user/account/account.service';
import { CheckoutI } from 'src/app/shared/components/items/interactions/checkout';

@Component({
  selector: 'app-page',
  templateUrl: './drink-orders.component.html',
  styleUrls: ['./drink-orders.component.css']
})
export class DrinkOrdersComponent {
  constructor(private accountService: AccountService) {}
  orders$: Observable<CheckoutI[]> = this.accountService.getTransactions();

  public removeOrder(product: any): void {
    // TODO: remove order
  }
}
