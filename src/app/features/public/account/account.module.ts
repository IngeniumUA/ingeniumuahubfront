import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AccountDetailsComponent} from "./account-details/account-details.component";
import {AccountRoutingModule} from "./account-routing.module";
import { AccountComponent } from './account.component';
import {AccountNavbarComponent} from "../../../shared/components/account/account-navbar/account-navbar.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    AccountNavbarComponent,
  ],
  declarations: [
    AccountDetailsComponent,
    AccountComponent,
  ]
})
export class AccountModule { }
