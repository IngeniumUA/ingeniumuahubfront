import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebmasterComponent } from './webmaster.component';
import {WebmasterRoutingModule} from "./webmaster-routing.module";
import {BehindheaderComponent} from "../../core/layout/behind/behindheader/behindheader.component";
import {SidenavComponent} from "../../core/layout/behind/sidenav/sidenav.component";



@NgModule({
  declarations: [
    WebmasterComponent,
  ],
  imports: [
    CommonModule,
    WebmasterRoutingModule,
    BehindheaderComponent,
    SidenavComponent,
  ]
})
export class WebmasterModule { }
