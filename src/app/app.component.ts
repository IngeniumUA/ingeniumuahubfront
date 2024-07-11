import {Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {User} from './core/store';
import {OAuthService} from "angular-oauth2-oidc";
import {apiEnviroment} from "@ingenium/environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store, private oauthService: OAuthService) {
    oauthService.configure(apiEnviroment.oauthConfig);
    oauthService.loadDiscoveryDocument();
  }

  ngOnInit() {
    this.store.dispatch(new User.FetchAuthTokenFromStorage());
  }
}
