import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/user/auth/auth.service";
import {distinctUntilChanged} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {RecSysPreviewI} from "../../../shared/models/items/recsys_interfaces";
import {RecSysService} from "../../../core/services/recsys/rec-sys.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  isLoggedIn: boolean = this.authService.isLoggedIn();
  constructor(
    private authService: AuthService,
    private recsysService: RecSysService) {
  }
  isNavdropdown: boolean = false;
  isAuth: boolean = false;
  homePageRec$: Observable<RecSysPreviewI[]> = of([])

  ngOnInit() {
    if (this.authService.userValue) {
      this.isAuth = true;
    }
    this.authService.user.
    pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.isAuth = data != null;
      })
    this.homePageRec$ = this.recsysService.getHomepageSlide(1)
  }

  ToggleNavDropdown(): void {
    this.isNavdropdown = ! this.isNavdropdown;
  }
}
