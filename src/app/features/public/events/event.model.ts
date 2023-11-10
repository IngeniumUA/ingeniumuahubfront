import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from "./event-routing.module";
import {EventsComponent} from "./events/events.component";
import {EventDetailComponent} from "./event/event-detail.component";
import {ProductComponent} from "../../../shared/components/items/products/product/product.component";
import {PublicHeaderComponent} from "../../../core/layout/public/header/public-header.component";
import {ColordbrgbaPipe} from "../../../shared/pipes/item/colorpipe.pipe";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EventRoutingModule,
    ProductComponent,
    PublicHeaderComponent,
    ColordbrgbaPipe
  ],
  declarations: [
    EventsComponent,
    EventDetailComponent,
  ]
})
export class EventModule { }
