import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from "./event-routing.module";
import {EventsComponent} from "./events/events.component";
import {EventDetailComponent} from "./event/event-detail.component";
import {ProductComponent} from "../../../shared/components/items/products/product/product.component";
import {PublicHeaderComponent} from "../../../core/layout/public/header/public-header.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EventRoutingModule,
        ProductComponent,
        PublicHeaderComponent,
    ],
  declarations: [
    EventsComponent,
    EventDetailComponent,
  ]
})
export class EventModule { }
