import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AccountDetailsComponent} from "./account-details/account-details.component";
import {AccountRoutingModule} from "./account-routing.module";
import { AccountComponent } from './account.component';
import {PublicHeaderComponent} from "../../../core/layout/public/header/public-header.component";
import { CardDetailComponent } from './card/card-detail.component';
import {CardComponent} from "../../../shared/components/account/card/card.component";
import { AccountTransactionsComponent } from './account-transactions/account-transactions.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    PublicHeaderComponent,
    CardComponent,
  ],
  declarations: [
    AccountDetailsComponent,
    AccountComponent,
    CardDetailComponent,
    AccountTransactionsComponent,
  ]
})
export class AccountModule { }
