import { Component } from '@angular/core';
import {apiEnviroment} from "@ingenium/environments/environment";

@Component({
    selector: 'app-page',
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.scss'],
    standalone: false
})
export class CreditsComponent {
  revision: string = apiEnviroment.versions.revision;
}
