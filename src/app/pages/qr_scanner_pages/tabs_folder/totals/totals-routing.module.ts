import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TotalsPage } from './totals.page';
import {staffGuard} from "@ingenium/app/core/guards/staff.guard";

const routes: Routes = [
  {
    path: '',
    component: TotalsPage,
    canActivate: [staffGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalsPageRoutingModule {}
