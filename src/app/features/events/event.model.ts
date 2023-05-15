import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from "./event-routing.module";
import {EventsComponent} from "./events/events.component";
import {EventDetailComponent} from "./event/event-detail.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EventRoutingModule,
  ],
  declarations: [
    EventsComponent,
    EventDetailComponent,
  ]
})
export class EventModule { }
