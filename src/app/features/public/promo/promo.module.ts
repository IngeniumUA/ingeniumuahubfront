import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {PublicHeaderComponent} from "../../../core/layout/public/header/public-header.component";
import {PromoRoutingModule} from "./promo-routing.module";
import { VacatureDisplayComponent } from './vacatures/vacature-display/vacature-display.component';
import { VacaturesListDisplayComponent } from './vacatures/vacatures-list-display/vacatures-list-display.component';
import {
    RecSysItemPreviewComponent
} from "../../../shared/components/items/recsys/rec-sys-item-preview/rec-sys-item-preview.component";
import {PartnerGridComponent} from "../../../shared/components/partners/partner-grid/partner-grid.component";
import {ColordbrgbaPipe} from "../../../shared/pipes/item/colorpipe.pipe";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PromoRoutingModule,
        PublicHeaderComponent,
        RecSysItemPreviewComponent,
        PartnerGridComponent,
        ColordbrgbaPipe,
    ],
    declarations: [


    VacatureDisplayComponent,
           VacaturesListDisplayComponent
  ]
})
export class PromoModule { }
