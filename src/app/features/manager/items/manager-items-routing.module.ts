import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ManagerItemsDashboardComponent} from './items-dashboard/manager-items-dashboard.component';
import {ItemtableComponent} from '../../../shared/components/items/item/itemtable/itemtable.component';
import {ItemlogComponent} from '../../../shared/components/logs/itemlogs/itemlog.component';
import {ItemDetailComponent} from '../../../shared/components/items/item/itemdetail/item-detail.component';


const routes: Routes = [
  {path: '', component: ManagerItemsDashboardComponent},
  {path: 'list', component: ItemtableComponent},
  {path: 'log', component: ItemlogComponent},
  {path: ':id', component: ItemDetailComponent}
  // logs
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerItemsRoutingModule { }
