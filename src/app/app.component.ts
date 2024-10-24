import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {apiEnviroment} from "@ingenium/environments/environment";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(@Inject(PLATFORM_ID) platformId: any, oauthService: OAuthService) {
    if (isPlatformBrowser(platformId)) {
      oauthService.configure(apiEnviroment.oauthConfig);
      oauthService.loadDiscoveryDocument();
    }
  }
}
