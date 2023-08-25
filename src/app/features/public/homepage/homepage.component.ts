import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/user/auth/auth.service";
import {distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  isLoggedIn: boolean = this.authService.isLoggedIn();
  constructor(private authService: AuthService) {
  }
  isNavdropdown: boolean = false;
  isAuth: boolean = false;

  ngOnInit() {
    if (this.authService.userValue) {
      this.isAuth = true;
    }
    this.authService.user.
    pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.isAuth = data != null;
      })
  }

  ToggleNavDropdown(): void {
    this.isNavdropdown = ! this.isNavdropdown;
  }
}
