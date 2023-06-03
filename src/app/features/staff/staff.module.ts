import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff.component';
import {BehindheaderComponent} from "../../core/layout/behind/behindheader/behindheader.component";
import {SidenavComponent} from "../../core/layout/behind/sidenav/sidenav.component";
import {StaffRoutingModule} from "./staff-routing.module";



@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    BehindheaderComponent,
    SidenavComponent
  ],
  declarations: [
    StaffComponent
  ],
})
export class StaffModule { }
