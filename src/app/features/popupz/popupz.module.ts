import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PopupzRoutingModule } from './popupz-routing.module';
import {PopupzTemplateComponent} from "@ingenium/app/features/popupz/popupz-template.component";
import {PublicFooterComponent} from "@ingenium/app/core/layout/public/footer/public-footer.component";
import {PublicHeaderComponent} from "@ingenium/app/core/layout/public/header/public-header.component";


@NgModule({
  declarations: [
    PopupzTemplateComponent,
  ],
  imports: [
    CommonModule,
    PopupzRoutingModule,
    PublicFooterComponent,
    PublicHeaderComponent,
  ]
})
export class PopupzModule { }
