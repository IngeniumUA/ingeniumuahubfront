import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { InfoLidComponent } from './lid-info/info-lid.component';
import { PraesidiumInfoComponent } from './praesidium-info/praesidium-info.component';
import { ClubliedComponent } from './clublied/clublied.component';
import { StartweekComponent } from './startweek/startweek.component';
import { RelationsComponent } from './relations/relations.component';
import {ContactComponent} from './contact/contact.component';
import {CreditsComponent} from './credits/credits.component';
import {EducationInfoComponent} from './education-info/education-info.component';
import {DoopInfoComponent} from './doop-info/doop-info.component';
import {CantusInfoComponent} from './cantus-info/cantus-info.component';
import {SportInfoComponent} from './sport-info/sport-info.component';
import {PartnersInfoComponent} from './partners/partners-info.component';



const routes: Routes = [
  { path: '', component: InfoComponent },
  { path: 'partners', component: PartnersInfoComponent},
  { path: 'lid', component: InfoLidComponent },
  { path: 'praesidium/:year', component: PraesidiumInfoComponent },
  { path: 'praesidium', component: PraesidiumInfoComponent},
  { path: 'clublied', component: ClubliedComponent },
  { path: 'startweek', component: StartweekComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'relations', component: RelationsComponent },
  { path: 'education', component: EducationInfoComponent},
  { path: 'doop', component: DoopInfoComponent},
  { path: 'cantus', component: CantusInfoComponent},
  { path: 'sport', component: SportInfoComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
