import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {WebmasterComponent} from "./webmaster.component";
import {GroupListComponent} from "./user/group-list/group-list.component";
import {UsersListComponent} from "./user/users-list/users-list.component";
import {ItemDashboardComponent} from "./item/item-dashboard/item-dashboard.component";
import {ItemDetailDashboardComponent} from "./item/item-detail-dashboard/item-detail-dashboard.component";
import {UserDetailComponent} from "./user/user-detail/user-detail.component";
import {CardDashboardComponent} from "./item/card-dashboard/card-dashboard.component";
import {AccessPolicyDashboardComponent} from "./access/access-policy-dashboard/access-policy-dashboard.component";


const routes: Routes = [
  {path: '',
    component: WebmasterComponent,
    children: [
      {path: 'user', component: UsersListComponent},
      {path: 'user/:id', component: UserDetailComponent},
      {path: 'group', component: GroupListComponent},
      {path: 'item', component: ItemDashboardComponent},
      {path: 'item/:id', component: ItemDetailDashboardComponent},
      {path: 'card', component: CardDashboardComponent},
      {path: 'access_policy', component: AccessPolicyDashboardComponent}
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebmasterRoutingModule { }
