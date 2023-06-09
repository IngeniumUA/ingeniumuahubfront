import { Component } from '@angular/core';
import {AuthService} from "../../../core/services/user/auth/auth.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  isLoggedIn: boolean = this.authService.isLoggedIn();
  constructor(private authService: AuthService) {
  }

}
