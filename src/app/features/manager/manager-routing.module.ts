import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ManagerHomeComponent} from "./managerhome/manager-home/manager-home.component";
import {ManagerComponent} from "./manager.component";


const routes: Routes = [
  {path: '',
    component: ManagerComponent,
    children: [
      {path: '', component: ManagerHomeComponent },
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
