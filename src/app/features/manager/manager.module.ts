import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerHomeComponent } from './managerhome/manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import {ManagerRoutingModule} from "./manager-routing.module";

import { SidenavComponent} from "../../core/layout/behind/sidenav/sidenav.component";
import {BehindheaderComponent} from "../../core/layout/behind/behindheader/behindheader.component";
import { ManagerItemsComponent } from './items/manager-items.component';
import {ItemtableComponent} from "../../shared/components/items/item/itemtable/itemtable.component";

@NgModule({
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SidenavComponent,
    BehindheaderComponent,
    ItemtableComponent,
  ],
  declarations: [
    ManagerHomeComponent,
    ManagerComponent,
    ManagerItemsComponent,
  ]
})
export class ManagerModule {}
