import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {apiEnviroment} from "@ingenium/environments/environment";
import {isPlatformBrowser} from "@angular/common";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import {Store} from "@ngxs/store";
import {User} from "@ingenium/app/core/store";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  endSubscription = new Subject();

  constructor(@Inject(PLATFORM_ID) platformId: any, oauthService: OAuthService, private router: Router,
              private store: Store) {
    if (isPlatformBrowser(platformId)) {
      oauthService.configure(apiEnviroment.oauthConfig);
      oauthService.loadDiscoveryDocument();
    }
  }

  ngOnInit(): void {
    // I think this sucks but okay
    // Make sure that on the initial page we don't get the token if we are on the callback page
    this.router.events
      .pipe(
        takeUntil(this.endSubscription)
      )
      .subscribe((e) => {
        if (e instanceof NavigationEnd) {
          // Only get the token if we are not on the callback page
          if (e.url !== '/auth/callback') {
            this.store.dispatch(new User.FetchAuthTokenFromStorage());
          }

          this.endSubscription.next(null);
        }
    });
  }
}
