import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemtableComponent} from '../../../shared/components/items/item/itemtable/itemtable.component';
import {ManagerItemsDashboardComponent} from './items-dashboard/manager-items-dashboard.component';
import {ManagerItemsRoutingModule} from './manager-items-routing.module';
import {ItemlogComponent} from '../../../shared/components/logs/itemlogs/itemlog.component';
import {ItemdetailComponent} from '../../../shared/components/items/item/itemdetail/itemdetail.component';

@NgModule({
  imports: [
    CommonModule,
    ManagerItemsRoutingModule,
    ItemtableComponent,
    ItemdetailComponent,
    ItemlogComponent,
  ],
  declarations: [
    ManagerItemsDashboardComponent,
  ]
})
export class ManagerItemsModule {}
