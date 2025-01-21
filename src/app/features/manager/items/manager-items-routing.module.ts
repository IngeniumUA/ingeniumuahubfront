import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ManagerItemsDashboardComponent} from './items-dashboard/manager-items-dashboard.component';
import {ItemTableComponent} from '../../../shared/components/items/item/itemtable/item-table.component';
import {ItemlogComponent} from '../../../shared/components/logs/itemlogs/itemlog.component';
import {ManagerItemDetailComponent} from '../../../shared/components/items/item/itemdetail/manager-item-detail.component';


const routes: Routes = [
  {path: '', component: ManagerItemsDashboardComponent},
  {path: 'list', component: ItemTableComponent},
  {path: 'log', component: ItemlogComponent},
  {path: ':id', component: ManagerItemDetailComponent}
  // logs
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerItemsRoutingModule { }
