import { Component } from '@angular/core';
import {RecSysItemPreviewComponent} from '../../items/recsys/rec-sys-item-preview/rec-sys-item-preview.component';
import {AsyncPipe, NgForOf} from '@angular/common';
import {Observable, of} from 'rxjs';
import {PartnerService} from "@ingenium/app/core/services/coreAPI/partner.service";

interface PartnerDisplay {
  name: string
  logo: string
}

@Component({
    selector: 'app-partner-grid',
    templateUrl: './partner-grid.component.html',
    styleUrls: ['./partner-grid.component.scss'],
    imports: [
        RecSysItemPreviewComponent,
        NgForOf,
        AsyncPipe
    ]
})
export class PartnerGridComponent {

  constructor(private partnerService: PartnerService) {
  }

  partnerLogos$: Observable<string[]> = this.partnerService.getCurrentPartnerLogos()
  // partners: Observable<RecSysPreviewI[]> = this.httpClient.get<RecSysPreviewI[]>("/assets/temp_partner_config/partners.json");

  partners: Observable<PartnerDisplay[]> = of([
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/umicore.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/sparklink_logo.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/sweco.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/bdo.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/willemen_infra.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/aertssen.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/art_antwerp_nv.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/dosign.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/ibs.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/artes.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/democo.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/deme.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/arcadis.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/reynaers_aluminium.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/atlas_copco.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/stadsbader.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/colas.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/exellys.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/van_roey.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/infrabel.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/jan_de_nul.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/hye.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/renotec.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/ey.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/vorsselmans.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/besix.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/hysopt.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/ineos.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/cordeel.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/elia.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/process_automation_solutions.webp'},
    {name: '', logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/lantis.webp'}
  ]);

}
