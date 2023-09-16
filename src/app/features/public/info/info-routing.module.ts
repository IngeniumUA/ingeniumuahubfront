import { NgModule } from '@angular/core';
import { RouterModule, Routes} from "@angular/router";
import {InfoComponent} from "./info/info.component";
import {InfoLidComponent} from "./lid-info/info-lid.component";
import {PraesidiumInfoComponent} from "./praesidium-info/praesidium-info.component";


const routes: Routes = [
  {path: '', component: InfoComponent },
  {path: 'lid', component: InfoLidComponent},
  {path: 'praesidium', component: PraesidiumInfoComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
