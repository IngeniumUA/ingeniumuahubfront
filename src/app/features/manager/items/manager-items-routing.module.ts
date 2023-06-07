import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {ManagerItemsDashboardComponent} from "./items-dashboard/manager-items-dashboard.component";
import {ItemtableComponent} from "../../../shared/components/items/item/itemtable/itemtable.component";
import {ItemlogComponent} from "../../../shared/components/logs/itemlogs/itemlog.component";


const routes: Routes = [
  {path: '', component: ManagerItemsDashboardComponent},
  {path: 'list', component: ItemtableComponent},
  {path: 'log', component: ItemlogComponent},
  // logs
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerItemsRoutingModule { }
