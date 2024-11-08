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
import {LicencesComponent} from "@ingenium/app/features/public/info/licences/licences.component";



const routes: Routes = [
  { path: '', title: 'Over ons', component: InfoComponent },
  { path: 'partners', title: 'Onze partners', component: PartnersInfoComponent},
  { path: 'lid', title: 'Lid worden', component: InfoLidComponent },
  { path: 'praesidium/:year', component: PraesidiumInfoComponent },
  { path: 'praesidium', title: 'Praesidium', component: PraesidiumInfoComponent},
  { path: 'clublied', title: 'Ons clublied', component: ClubliedComponent },
  { path: 'startweek', title: 'Start week', component: StartweekComponent },
  { path: 'contact', title: 'Contacteer ons', component: ContactComponent },
  { path: 'credits', title: 'Credits', component: CreditsComponent },
  { path: 'licences', title: 'Licences', component: LicencesComponent },
  { path: 'relations', title: 'Relations', component: RelationsComponent },
  { path: 'education', title: 'Education', component: EducationInfoComponent},
  { path: 'doop', title: 'Doop', component: DoopInfoComponent},
  { path: 'cantus', title: 'Cantus', component: CantusInfoComponent},
  { path: 'sport', title: 'Sport', component: SportInfoComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
