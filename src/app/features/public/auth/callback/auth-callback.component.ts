import {Component, OnInit} from '@angular/core';
import {Store} from "@ngxs/store";
import {OAuthService} from "angular-oauth2-oidc";
import {User} from "@ingenium/app/core/store";
import {Router} from "@angular/router";

@Component({
  selector: 'app-page',
  templateUrl: './auth-callback.component.html',
})
export class AuthCallbackComponent implements OnInit {
  failure: boolean = false;

  constructor(private store: Store, private oauthService: OAuthService, private router: Router) {}

  ngOnInit() {
    console.log(this.oauthService.clientId)
    this.tryLogin();
  }

  async tryLogin () {
    try {
      const success = await this.oauthService.loadDiscoveryDocumentAndTryLogin()
      const token = this.oauthService.getAccessToken()

      if (!success || !token) {
        this.failure = true
        return
      }

      const claims = this.oauthService.getIdentityClaims();
      this.store.dispatch(new User.SetAuthData(
        this.oauthService.getAccessToken(),
        claims['email'],
      ))

      this.router.navigateByUrl(decodeURIComponent(this.oauthService.state || '/'));
    } catch (error) {
      console.error(error)
      this.failure = true
    }
  }
}
