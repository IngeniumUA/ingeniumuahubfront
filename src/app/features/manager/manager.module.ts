import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerHomeComponent } from './managerhome/manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import {ManagerRoutingModule} from './manager-routing.module';

import { SidenavComponent} from '@ingenium/app/core/layout/behind/sidenav/sidenav.component';
import {PublicHeaderComponent} from '@ingenium/app/core/layout/public/header/public-header.component';
import { FlagTableComponent } from './flag-table/flag-table.component';

@NgModule({
  imports: [
    CommonModule,
    ManagerRoutingModule,
    SidenavComponent,
    PublicHeaderComponent,
  ],
  declarations: [
    ManagerHomeComponent,
    ManagerComponent,
    FlagTableComponent,
  ]
})
export class ManagerModule {}
