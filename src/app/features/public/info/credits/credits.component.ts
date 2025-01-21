import { Component } from '@angular/core';
import {apiEnviroment} from "@ingenium/environments/environment";
import { PublicHeaderComponent } from '../../../../core/layout/public/header/public-header.component';

@Component({
    selector: 'app-page',
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.scss'],
    imports: [PublicHeaderComponent]
})
export class CreditsComponent {
  revision: string = apiEnviroment.versions.revision;
}
