import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { InfoComponent } from "./info/info.component";
import { InfoLidComponent } from "./lid-info/info-lid.component";
import { PraesidiumInfoComponent } from "./praesidium-info/praesidium-info.component";
import { ClubliedComponent } from './clublied/clublied.component';
import { StartweekComponent } from "./startweek/startweek.component";
import { RelationsComponent } from "./relations/relations.component";



const routes: Routes = [
  { path: '', component: InfoComponent },
  { path: 'lid', component: InfoLidComponent },
  { path: 'praesidium', component: PraesidiumInfoComponent },
  { path: 'clublied', component: ClubliedComponent },
  { path: 'startweek', component: StartweekComponent },
  // {path: 'contributors', component: },
  { path: 'relations', component: RelationsComponent },
  // {path: 'dopen', component: },
  // {path: 'cantus', component: },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
