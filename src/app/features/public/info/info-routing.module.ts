import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { InfoComponent } from "./info/info.component";
import { InfoLidComponent } from "./lid-info/info-lid.component";
import { PraesidiumInfoComponent } from "./praesidium-info/praesidium-info.component";
import { ClubliedComponent } from './clublied/clublied.component';
import { StartweekComponent } from "./startweek/startweek.component";
import { RelationsComponent } from "./relations/relations.component";
import {ContactComponent} from "./contact/contact.component";
import {CreditsComponent} from "../credits/credits.component";



const routes: Routes = [
  { path: '', component: InfoComponent },
  { path: 'lid', component: InfoLidComponent },
  { path: 'praesidium/:year', component: PraesidiumInfoComponent },
  { path: 'clublied', component: ClubliedComponent },
  { path: 'startweek', component: StartweekComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'relations', component: RelationsComponent },
  // {path: 'doop', component: },
  // {path: 'cantus', component: },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
