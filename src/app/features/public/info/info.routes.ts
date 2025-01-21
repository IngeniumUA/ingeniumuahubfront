import { Routes } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { PraesidiumInfoComponent } from './praesidium-info/praesidium-info.component';
import { ClubliedComponent } from './clublied/clublied.component';
import { RelationsComponent } from './relations/relations.component';
import {ContactComponent} from './contact/contact.component';
import {CreditsComponent} from './credits/credits.component';
import {PartnersInfoComponent} from './partners/partners-info.component';


export const routes: Routes = [
  { path: '', title: 'Over ons', component: InfoComponent },
  { path: 'partners', title: 'Onze partners', component: PartnersInfoComponent},
  { path: 'praesidium/:year', component: PraesidiumInfoComponent },
  { path: 'praesidium', title: 'Praesidium', component: PraesidiumInfoComponent},
  { path: 'clublied', title: 'Ons clublied', component: ClubliedComponent },
  { path: 'contact', title: 'Contacteer ons', component: ContactComponent },
  { path: 'credits', title: 'Credits', component: CreditsComponent },
  { path: 'relations', title: 'Relations', component: RelationsComponent },
];
