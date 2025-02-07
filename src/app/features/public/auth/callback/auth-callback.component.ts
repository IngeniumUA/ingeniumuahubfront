import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {OAuthService} from "angular-oauth2-oidc";
import {User} from "@ingenium/app/core/store";
import {Router} from "@angular/router";
import {first} from "rxjs/operators";
import {captureException} from "@sentry/angular";

@Component({
  selector: 'app-page',
  templateUrl: './auth-callback.component.html',
})
export class AuthCallbackComponent implements OnInit {
  failure: boolean = false;

  constructor(private store: Store, private oauthService: OAuthService, private router: Router) {}

  ngOnInit() {
    this.tryLogin();
  }

  async tryLogin () {
    try {
      const success = await this.oauthService.loadDiscoveryDocumentAndTryLogin()
      const token = this.oauthService.getAccessToken()

      if (!success || !token) {
        throw new Error("No token or success received from endpoint!");
      }

      // When the user is authenticated, set the auth data in the store
      this.store.dispatch(new User.FetchAuthTokenFromStorage).pipe(first()).subscribe(() => {
        setTimeout(() => {
          this.router.navigateByUrl(decodeURIComponent(this.oauthService.state || '/'));
        }, 500);
      });
    } catch (error) {
      captureException(error);
      console.error(error);
      this.failure = true
    }
  }
}
