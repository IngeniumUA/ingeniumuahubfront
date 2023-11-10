import { Component } from '@angular/core';
import {RecSysItemPreviewComponent} from "../../items/recsys/rec-sys-item-preview/rec-sys-item-preview.component";
import {AsyncPipe, NgForOf} from "@angular/common";
import {RecSysPreviewI} from "../../../models/items/recsys_interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-partner-grid',
  templateUrl: './partner-grid.component.html',
  styleUrls: ['./partner-grid.component.scss'],
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

  partners: Observable<RecSysPreviewI[]> = this.httpClient.get<RecSysPreviewI[]>("/assets/temp_partner_config/partners.json");

}
