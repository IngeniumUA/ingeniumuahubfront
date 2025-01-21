import { Component } from '@angular/core';
import {PartnerGridComponent} from "@ingenium/app/shared/components/partners/partner-grid/partner-grid.component";
import {PublicHeaderComponent} from "@ingenium/app/core/layout/public/header/public-header.component";

@Component({
  selector: 'app-partners',
  templateUrl: './partners-info.component.html',
  styleUrls: ['./partners-info.component.css'],
  standalone: true,
  imports: [
    PartnerGridComponent,
    PublicHeaderComponent
  ]
})
export class PartnersInfoComponent { }
