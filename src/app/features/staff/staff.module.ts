import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff.component';
import {SidenavComponent} from '@ingenium/app/core/layout/behind/sidenav/sidenav.component';
import {StaffRoutingModule} from './staff-routing.module';
import { StaffEventListComponent } from './events/staff-event-list/staff-event-list.component';
import { StaffEventDetailComponent } from './events/staff-event-detail/staff-event-detail.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { StaffEventEditComponent } from './events/staff-event-edit/staff-event-edit.component';
import { FunctionsComponent } from './functions/functions.component';
import { DrinkOrdersComponent } from './popupz/drink-orders/drink-orders.component';
import { FoodOrdersComponent } from './popupz/food-orders/food-orders.component';
import {PublicHeaderComponent} from '@ingenium/app/core/layout/public/header/public-header.component';
import { StaffUseFullQRComponent } from './payment-code/staff-usefull-q-r.component';



@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
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
    StaffUseFullQRComponent
  ],
})
export class StaffModule { }
