import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/user/auth/auth.service';
import {distinctUntilChanged} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '../../../shared/models/items/recsys_interfaces';
import { EventService } from 'src/app/core/services/items/events/event.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  isLoggedIn: boolean = this.authService.isLoggedIn();
  constructor(private authService: AuthService, private eventService: EventService) {}
  isNavdropdown: boolean = false;
  isAuth: boolean = false;
  homePageRec$: Observable<RecSysPreviewI[]> = of([]);

  sponsors: string[] = [
    'assets/images/sponsors/umicore-logo-2017.svg',
    'assets/images/sponsors/SparklinkLogo.png',
    'assets/images/sponsors/Vorsselmans_logo.png'
  ];

  ngOnInit() {
    if (this.authService.userValue) {
      this.isAuth = true;
    }
    this.authService.user.
      pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.isAuth = data != null;
      });
    this.homePageRec$ = this.eventService.getEventsList();
  }

  ToggleNavDropdown(): void {
    this.isNavdropdown = ! this.isNavdropdown;
  }
}
