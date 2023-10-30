import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff.component';
import {BehindheaderComponent} from "../../core/layout/behind/behindheader/behindheader.component";
import {SidenavComponent} from "../../core/layout/behind/sidenav/sidenav.component";
import {StaffRoutingModule} from "./staff-routing.module";
import { StaffEventListComponent } from './events/staff-event-list/staff-event-list.component';
import { StaffEventDetailComponent } from './events/staff-event-detail/staff-event-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { StaffEventEditComponent } from './events/staff-event-edit/staff-event-edit.component';
import { FunctionsComponent } from './functions/functions.component';
import { DrinkOrdersComponent } from './popupz/drink-orders/drink-orders.component';
import { FoodOrdersComponent } from './popupz/food-orders/food-orders.component';
import {PublicHeaderComponent} from "../../core/layout/public/header/public-header.component";
import { StaffUsefullQR } from './payment-code/staff-usefull-q-r.component';



@NgModule({
    imports: [
        CommonModule,
        StaffRoutingModule,
        BehindheaderComponent,
        SidenavComponent,
        FormsModule,
        ReactiveFormsModule,
        StaffEventEditComponent,
        PublicHeaderComponent
    ],
  declarations: [
    StaffComponent,
    StaffEventListComponent,
    StaffEventDetailComponent,
    FunctionsComponent,
    DrinkOrdersComponent,
    FoodOrdersComponent,
    StaffUsefullQR
  ],
})
export class StaffModule { }
