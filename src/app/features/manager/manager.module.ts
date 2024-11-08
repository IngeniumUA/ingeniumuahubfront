import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerHomeComponent } from './managerhome/manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import {ManagerRoutingModule} from './manager-routing.module';

import { SidenavComponent} from '@ingenium/app/core/layout/behind/sidenav/sidenav.component';
import {PublicHeaderComponent} from '@ingenium/app/core/layout/public/header/public-header.component';
import { FlagTableComponent } from './flag-table/flag-table.component';
import {IonicModule} from "@ionic/angular";
import {
  CreateGroupComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/create/create-group/create-group.component";
import {ColordbrgbaPipe} from "@ingenium/app/shared/pipes/item/colorpipe.pipe";
import {ProductComponent} from "@ingenium/app/shared/components/items/products/product/product.component";

@NgModule({
    imports: [
        CommonModule,
        ManagerRoutingModule,
        SidenavComponent,
        PublicHeaderComponent,
        IonicModule,
        CreateGroupComponent,
        ColordbrgbaPipe,
        ProductComponent,
    ],
  declarations: [
    ManagerHomeComponent,
    ManagerComponent,
    FlagTableComponent,
  ]
})
export class ManagerModule {}
