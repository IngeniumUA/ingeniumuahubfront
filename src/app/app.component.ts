import { Component } from '@angular/core';
import {HubAuthData} from "./shared/models/user";
import {AuthService} from "./core/services/user/auth/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ingeniumuahubfront';

  user?: HubAuthData | null;

  constructor(private accountService: AuthService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.accountService.logout();
  }
}
