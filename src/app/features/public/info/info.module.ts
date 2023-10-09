import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import {PublicHeaderComponent} from "../../../core/layout/public/header/public-header.component";
import { InfoLidComponent } from './lid-info/info-lid.component';
import {InfoRoutingModule} from "./info-routing.module";
import { PraesidiumInfoComponent } from './praesidium-info/praesidium-info.component';
import {UnderConstructionComponent} from "../../../shared/components/under-construction/under-construction.component";
import { StartweekComponent } from './startweek/startweek.component';
import { RelationsComponent } from './relations/relations.component';
import { ClubliedComponent } from './clublied/clublied.component';



@NgModule({
  declarations: [
    InfoComponent,
    InfoLidComponent,
    PraesidiumInfoComponent,
    StartweekComponent,
    RelationsComponent,
    ClubliedComponent,
  ],
    imports: [
        CommonModule,
        PublicHeaderComponent,
        InfoRoutingModule,
        UnderConstructionComponent
    ]
})
export class InfoModule { }
