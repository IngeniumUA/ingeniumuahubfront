import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import {AccountDetailsComponent} from "./account-details/account-details.component";
import {AccountComponent} from "./account.component";
import {CardDetailComponent} from "./card/card-detail.component";

const routes: Routes = [
  {path: '',
    component: AccountComponent,
    children: [
      {path: '', component: AccountDetailsComponent },
      {path: 'details', component: AccountDetailsComponent},
      {path: 'card', component: CardDetailComponent}
      //{path: 'purchases'},
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
