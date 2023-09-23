import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffComponent } from './staff.component';
import {BehindheaderComponent} from "../../core/layout/behind/behindheader/behindheader.component";
import {SidenavComponent} from "../../core/layout/behind/sidenav/sidenav.component";
import {StaffRoutingModule} from "./staff-routing.module";
import { StaffEventListComponent } from './events/staff-event-list/staff-event-list.component';
import { StaffEventDetailComponent } from './events/staff-event-detail/staff-event-detail.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { StaffEventEditComponent } from './events/staff-event-edit/staff-event-edit.component';
import { FunctionsComponent } from './functions/functions.component';



@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    BehindheaderComponent,
    SidenavComponent,
    FormsModule,
    ReactiveFormsModule,
    StaffEventEditComponent
  ],
  declarations: [
    StaffComponent,
    StaffEventListComponent,
    StaffEventDetailComponent,
    FunctionsComponent
  ],
})
export class StaffModule { }
