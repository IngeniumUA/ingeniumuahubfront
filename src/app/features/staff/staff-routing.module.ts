import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StaffComponent} from './staff.component';
import {StaffEventsListPageComponent} from './events/staff-event-list/staff-events-list-page.component';
import {StaffEventPageComponent} from './events/staff-event-detail/staff-event-page.component';
import {StaffUseFullQRComponent} from './payment-code/staff-usefull-q-r.component';
import {FoodOrdersComponent} from "@ingenium/app/features/staff/popupz/food-orders/food-orders.component";
import {DrinkOrdersComponent} from "@ingenium/app/features/staff/popupz/drink-orders/drink-orders.component";
import {FinancialPageComponent} from "@ingenium/app/features/staff/financial-page/financial-page.component";
import {SettingsComponent} from "@ingenium/app/features/staff/financial-page/settings/settings.component";
import {FillPDFComponent} from "@ingenium/app/features/staff/financial-page/fill-pdf/fill-pdf.component";
import {
  FacturationDataComponent
} from "@ingenium/app/features/staff/financial-page/facturation-data/facturation-data.component";
import {
  PartnershipPackageComponent
} from "@ingenium/app/features/staff/financial-page/partnership-package/partnership-package.component";


const routes: Routes = [
  {path: '',
    component: StaffComponent,
    children: [
      {path: 'event', component: StaffEventsListPageComponent},
      {path: 'event/:id', component: StaffEventPageComponent},
      {path: 'qr', component: StaffUseFullQRComponent},
      {path: 'financial', component: FinancialPageComponent},
      {path: 'financial/settings', component: SettingsComponent},
      {path: 'financial/fill', component: FillPDFComponent},
      {path: 'financial/company/facturation_data', component: FacturationDataComponent},
      {path: 'financial/br/partnership_package', component: PartnershipPackageComponent},
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
