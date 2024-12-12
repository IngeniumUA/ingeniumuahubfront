import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { EventRoutingModule } from './event-routing.module';
import {EventsComponent} from './events/events.component';
import {EventDetailComponent} from './event/event-detail.component';
import {ProductComponent} from '../../../shared/components/items/products/product/product.component';
import {PublicHeaderComponent} from '../../../core/layout/public/header/public-header.component';
import {ColordbrgbaPipe} from '../../../shared/pipes/item/colorpipe.pipe';
import {
  RecSysItemPreviewComponent
} from '../../../shared/components/items/recsys/rec-sys-item-preview/rec-sys-item-preview.component';
import {LoadingIndicatorComponent} from "@ingenium/app/shared/components/loading-indicator/loading-indicator.component";
import {IonicModule} from "@ionic/angular";
import {PublicFooterComponent} from "@ingenium/app/core/layout/public/footer/public-footer.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EventRoutingModule,
    ProductComponent,
    PublicHeaderComponent,
    ColordbrgbaPipe,
    RecSysItemPreviewComponent,
    LoadingIndicatorComponent,
    NgOptimizedImage,
    IonicModule,
    PublicFooterComponent
  ],
  declarations: [
    EventsComponent,
    EventDetailComponent,
  ]
})
export class EventModule { }
