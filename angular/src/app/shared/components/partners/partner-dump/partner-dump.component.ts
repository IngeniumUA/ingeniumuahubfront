import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

interface PartnerDisplay {
  xOffset: number
  logo: string
}

@Component({
  selector: 'app-partner-dump',
  templateUrl: './partner-dump.component.html',
  styleUrls: ['./partner-dump.component.css'],
  imports: [
    NgForOf
  ],
  standalone: true
})
export class PartnerDumpComponent {

  partners: PartnerDisplay[] = [
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/sparklink.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/sweco.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/willemen_infra.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/aertssen.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/art_antwerp_nv.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/dosign.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/ibs.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/artes.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/bdo.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/democo.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/deme.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/umicore.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/arcadis.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/reynaers_aluminium.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/atlas_copco.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/stadsbader.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/colas.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/exellys.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/van_roey.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/infrabel.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/jan_de_nul.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/hye.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/renotec.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/ey.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/vorsselmans.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/besix.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/hysopt.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/ineos.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/cordeel.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/elia.webp'},
    {xOffset: 0, logo: 'https://storage.googleapis.com/ingeniumuahubbucket/hub/partner_logo/23_24/process_automation_solutions.webp'},

  ];

}
