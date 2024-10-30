import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StaffComponent} from './staff.component';
import {StaffEventsListPageComponent} from './events/staff-event-list/staff-events-list-page.component';
import {StaffEventPageComponent} from './events/staff-event-detail/staff-event-page.component';
import {FunctionsComponent} from './functions/functions.component';
import {StaffUseFullQRComponent} from './payment-code/staff-usefull-q-r.component';
import {FoodOrdersComponent} from "@ingenium/app/features/staff/popupz/food-orders/food-orders.component";
import {DrinkOrdersComponent} from "@ingenium/app/features/staff/popupz/drink-orders/drink-orders.component";


const routes: Routes = [
  {path: '',
    component: StaffComponent,
    children: [
      {path: 'event', component: StaffEventsListPageComponent},
      {path: 'event/:id', component: StaffEventPageComponent},
      {path: 'functions', component: FunctionsComponent},
      {path: 'qr', component: StaffUseFullQRComponent},
    ]
  },
  {path: 'old/food', component: FoodOrdersComponent},
  {path: 'old/drinks', component: DrinkOrdersComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
