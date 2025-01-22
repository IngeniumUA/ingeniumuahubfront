import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AccountDetailsComponent} from './account-details/account-details.component';
import {AccountRoutingModule} from './account-routing.module';
import { AccountComponent } from './account.component';
import {PublicHeaderComponent} from '../../../core/layout/public/header/public-header.component';
import {CardComponent} from '../../../shared/components/account/card/card.component';
import { AccountTransactionsComponent } from './account-transactions/account-transactions.component';
import {UnderConstructionComponent} from '../../../shared/components/under-construction/under-construction.component';
import {
  CheckoutDisplayComponent
} from '../../../shared/components/account/checkout-display/checkout-display.component';
import {
  TransactionDisplayComponent
} from '../../../shared/components/account/transaction-display/transaction-display.component';
import {AccountInfoComponent} from '../../../shared/components/account/account-details/account-info.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    PublicHeaderComponent,
    CardComponent,
    UnderConstructionComponent,
    CheckoutDisplayComponent,
    TransactionDisplayComponent,
    AccountInfoComponent,
  ],
  declarations: [
    AccountDetailsComponent,
    AccountComponent,
    AccountTransactionsComponent,
  ]
})
export class AccountModule { }
