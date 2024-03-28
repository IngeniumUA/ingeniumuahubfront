import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerHomeComponent} from './managerhome/manager-home/manager-home.component';
import {ManagerComponent} from './manager.component';
import {FlagTableComponent} from './flag-table/flag-table.component';


const routes: Routes = [
  {path: '',
    component: ManagerComponent,
    children: [
      {path: '', component: ManagerHomeComponent },
      {path: 'flag', component: FlagTableComponent},
      {path: 'items', loadChildren: () => import('./items/manager-items.module').then(x => x.ManagerItemsModule)},
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
