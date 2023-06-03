import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {WebmasterComponent} from "./webmaster.component";


const routes: Routes = [
  {path: '',
    component: WebmasterComponent,
    children: [

    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebmasterRoutingModule { }
