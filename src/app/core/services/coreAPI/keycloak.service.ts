import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "@ingenium/environments/environment";
import {Observable} from "rxjs";
import {KeycloakGroupI} from "@ingenium/app/shared/models/keycloakModels";

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'keycloak';

  getRealmName(): Observable<string> {
    return this.httpClient.get<string>(`${this.apiUrl}/realm`);
  }

  getGroups(): Observable<KeycloakGroupI[]> {
    return this.httpClient.get<KeycloakGroupI[]>(`${this.apiUrl}/group?limit=1000`);
  }
}
