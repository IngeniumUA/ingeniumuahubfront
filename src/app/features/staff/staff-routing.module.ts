import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {StaffComponent} from "./staff.component";


const routes: Routes = [
  {path: '',
    component: StaffComponent,
    children: [

    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
