import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {apiEnviroment} from "@ingenium/environments/environment";
import {isPlatformBrowser} from "@angular/common";
import {Store} from "@ngxs/store";
import {User} from "@ingenium/app/core/store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) platformId: any, oauthService: OAuthService, private store: Store) {
    if (isPlatformBrowser(platformId)) {
      oauthService.configure(apiEnviroment.oauthConfig);
      oauthService.loadDiscoveryDocument();
    }
  }

  ngOnInit(): void {
    // On app load, we cannot be on the callback page to load our auth data
    if (window.location.pathname !== "/auth/callback") {
      this.store.dispatch(new User.FetchAuthTokenFromStorage());
    }
  }
}
