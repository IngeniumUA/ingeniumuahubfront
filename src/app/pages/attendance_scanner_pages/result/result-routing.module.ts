import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultPage } from './result.page';
import {staffGuard} from '@ingenium/app/core/guards/staff.guard';

const routes: Routes = [
  {
    path: '',
    component: ResultPage,
    canActivate: [staffGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultPageRoutingModule {}
