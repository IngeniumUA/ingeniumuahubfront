import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricesPage } from './prices.page';
import {staffGuard} from '@ingenium/app/core/guards/staff.guard';

const routes: Routes = [
  {
    path: '',
    component: PricesPage,
    canActivate: [staffGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricesPageRoutingModule {}
