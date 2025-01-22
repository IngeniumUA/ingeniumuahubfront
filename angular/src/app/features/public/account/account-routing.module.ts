import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {AccountDetailsComponent} from './account-details/account-details.component';
import {AccountComponent} from './account.component';
import {AccountTransactionsComponent} from './account-transactions/account-transactions.component';

const routes: Routes = [
  {path: '',
    component: AccountComponent,
    children: [
      {path: '', title: 'Account', component: AccountDetailsComponent },
      {path: 'details', redirectTo: '', pathMatch: 'full'},
      {path: 'transactions', title: 'Jouw aankopen', component: AccountTransactionsComponent}
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
