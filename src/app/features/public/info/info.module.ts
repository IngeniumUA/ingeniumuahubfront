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
import { DoopInfoComponent } from './doop-info/doop-info.component';
import { CantusInfoComponent } from './cantus-info/cantus-info.component';
import { EducationInfoComponent } from './education-info/education-info.component';
import { SportInfoComponent } from './sport-info/sport-info.component';
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { PartnersInfoComponent } from './partners/partners-info.component';
import {PartnerDumpComponent} from "../../../shared/components/partners/partner-dump/partner-dump.component";



@NgModule({
  declarations: [
    InfoComponent,
    InfoLidComponent,
    PraesidiumInfoComponent,
    StartweekComponent,
    RelationsComponent,
    ClubliedComponent,
    DoopInfoComponent,
    CantusInfoComponent,
    EducationInfoComponent,
    SportInfoComponent,
    PartnersInfoComponent,
  ],
  imports: [
    CommonModule,
    PublicHeaderComponent,
    InfoRoutingModule,
    UnderConstructionComponent,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    PartnerDumpComponent
  ]
})
export class InfoModule { }
