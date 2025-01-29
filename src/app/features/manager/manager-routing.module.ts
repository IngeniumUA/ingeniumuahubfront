import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerHomeComponent} from './managerhome/manager-home/manager-home.component';
import {ManagerComponent} from './manager.component';
import {FlagTableComponent} from './flag-table/flag-table.component';
import {
  InteractionsPageComponent
} from "@ingenium/app/features/webmaster/interactions-page/interactions-page.component";
import {KeycloakPageComponent} from "@ingenium/app/features/manager/keycloak-page/keycloak-page.component";


const routes: Routes = [
  {path: '',
    component: ManagerComponent,
    children: [
      {path: '', component: ManagerHomeComponent },
      {path: 'flag', component: FlagTableComponent},
      {path: 'items', loadChildren: () => import('./items/manager-items.module').then(x => x.ManagerItemsModule)},
      {path: 'interaction', component: InteractionsPageComponent},
      {path: 'keycloak', component: KeycloakPageComponent},
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
