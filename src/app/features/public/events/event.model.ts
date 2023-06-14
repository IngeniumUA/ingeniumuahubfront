import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from "./event-routing.module";
import {EventsComponent} from "./events/events.component";
import {EventDetailComponent} from "./event/event-detail.component";
import {ProductComponent} from "../../../shared/components/items/products/product/product.component";
import {EventpreviewComponent} from "../../../shared/components/items/event/eventpreview/eventpreview.component";
import {ProducttableComponent} from "../../../shared/components/items/products/producttable/producttable.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        EventRoutingModule,
        ProductComponent,
        EventpreviewComponent,
        ProducttableComponent,
    ],
  declarations: [
    EventsComponent,
    EventDetailComponent,
  ]
})
export class EventModule { }
