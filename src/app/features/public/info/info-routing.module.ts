import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import {InfoComponent} from "./info/info.component";
import {InfoLidComponent} from "./lid-info/info-lid.component";


const routes: Routes = [
  {path: '', component: InfoComponent },
  {path: 'lid', component: InfoLidComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
