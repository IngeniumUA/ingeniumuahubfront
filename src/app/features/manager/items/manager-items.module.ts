import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemTableComponent} from '../../../shared/components/items/item/itemtable/item-table.component';
import {ManagerItemsDashboardComponent} from './items-dashboard/manager-items-dashboard.component';
import {ManagerItemsRoutingModule} from './manager-items-routing.module';
import {ItemlogComponent} from '../../../shared/components/logs/itemlogs/itemlog.component';
import {ManagerItemDetailComponent} from '../../../shared/components/items/item/itemdetail/manager-item-detail.component';

@NgModule({
    imports: [
        CommonModule,
        ManagerItemsRoutingModule,
        ItemTableComponent,
        ManagerItemDetailComponent,
        ItemlogComponent,
        ManagerItemsDashboardComponent,
    ]
})
export class ManagerItemsModule {}
