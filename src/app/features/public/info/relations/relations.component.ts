import { Component } from '@angular/core';
import {PartnerGridComponent} from "@ingenium/app/shared/components/partners/partner-grid/partner-grid.component";
import {PublicHeaderComponent} from "@ingenium/app/core/layout/public/header/public-header.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-page',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css'],
  standalone: true,
  imports: [
    PartnerGridComponent,
    PublicHeaderComponent,
    NgOptimizedImage
  ]
})
export class RelationsComponent { }
