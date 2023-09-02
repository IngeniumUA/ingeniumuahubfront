import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import {PublicHeaderComponent} from "../../../core/layout/public/header/public-header.component";



@NgModule({
  declarations: [
    InfoComponent
  ],
    imports: [
        CommonModule,
        PublicHeaderComponent
    ]
})
export class InfoModule { }
