import { Component } from '@angular/core';
import {RecSysItemPreviewComponent} from "../../items/recsys/rec-sys-item-preview/rec-sys-item-preview.component";
import {AsyncPipe, NgForOf} from "@angular/common";
import {RecSysPreviewI} from "../../../models/items/recsys_interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";

const PARTNERS: RecSysPreviewI[] = [
  {
    follow_through_link: '/partner/sparklink',
    name: 'Sparklink',
    date: undefined,
    color: '255255255',
    text_color: '00000000',
    image_square: "https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/sparklink.webp",
    image_landscape: 'null',
  }
]

@Component({
  selector: 'app-partner-grid',
  templateUrl: './partner-grid.component.html',
  styleUrls: ['./partner-grid.component.css'],
  imports: [
    RecSysItemPreviewComponent,
    NgForOf,
    AsyncPipe
  ],
  standalone: true
})
export class PartnerGridComponent {

  constructor(private httpClient: HttpClient) {
  }

  partners: Observable<RecSysPreviewI[]> = of(PARTNERS);

}
