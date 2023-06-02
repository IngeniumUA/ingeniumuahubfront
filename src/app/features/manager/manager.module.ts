import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerHomeComponent } from './managerhome/manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import {ManagerRoutingModule} from "./manager-routing.module";



@NgModule({
  imports: [
    CommonModule,
    ManagerRoutingModule,
  ],
  declarations: [
    ManagerHomeComponent,
    ManagerComponent
  ]
})
export class ManagerModule { }
