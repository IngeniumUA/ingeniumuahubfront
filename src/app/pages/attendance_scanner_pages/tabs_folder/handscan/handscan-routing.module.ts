import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandscanPage } from './handscan.page';

const routes: Routes = [
  {
    path: '',
    component: HandscanPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HandscanPageRoutingModule {}
