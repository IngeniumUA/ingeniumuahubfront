import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {KeycloakService} from "@ingenium/app/core/services/coreAPI/keycloak.service";
import {AsyncPipe} from "@angular/common";
import {KeycloakGroupI} from "@ingenium/app/shared/models/keycloakModels";

@Component({
  selector: 'app-keycloak-page',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './keycloak-page.component.html',
  styleUrl: './keycloak-page.component.scss'
})
export class KeycloakPageComponent {

  constructor(private keycloakService: KeycloakService) {
  }

  realmName$: Observable<string> = this.keycloakService.getRealmName();
  keycloakGroups$: Observable<KeycloakGroupI[]> = this.keycloakService.getGroups();

}
