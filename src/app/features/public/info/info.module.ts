import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import {PublicHeaderComponent} from "../../../core/layout/public/header/public-header.component";
import { InfoLidComponent } from './lid-info/info-lid.component';
import {InfoRoutingModule} from "./info-routing.module";



@NgModule({
  declarations: [
    InfoComponent,
    InfoLidComponent,
  ],
    imports: [
        CommonModule,
        PublicHeaderComponent,
        InfoRoutingModule
    ]
})
export class InfoModule { }
