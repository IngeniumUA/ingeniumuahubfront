import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlueprintsPage } from './blueprints.page';
import {staffGuard} from '@ingenium/app/core/guards/staff.guard';

const routes: Routes = [
  {
    path: '',
    component: BlueprintsPage,
    canActivate: [staffGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlueprintsPageRoutingModule {}
