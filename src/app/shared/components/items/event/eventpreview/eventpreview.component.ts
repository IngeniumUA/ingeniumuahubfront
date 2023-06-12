import {Component, Input, OnInit} from '@angular/core';
import {EventItemI} from "../../../../models/items/events";
import {Router} from "@angular/router";
import {AsyncPipe, DatePipe, NgIf, NgStyle} from "@angular/common";
import {LayoutService} from "../../../../../core/services/layout/layout.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-eventpreview',
  templateUrl: './eventpreview.component.html',
  styleUrls: ['./eventpreview.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgStyle,
    DatePipe,
    AsyncPipe,
  ]
})
export class EventpreviewComponent implements OnInit {
  @Input() event!: EventItemI

  constructor(private router: Router,
              private layoutService: LayoutService,) {
  }
  isMobile: Observable<boolean> = this.layoutService.isMobile;
  primaryColor90!: string;
  primaryColorFull!: string;
  ngOnInit() {
    const primaryBackground = "rgba("
      + this.event.main_color.substring(0, 3) + ", "
      + this.event.main_color.substring(3, 6) + ", "
      + this.event.main_color.substring(6, 9)

    this.primaryColor90 = primaryBackground + ", 0.9)";
    this.primaryColorFull = primaryBackground + ")";
  }

  public RedirectToEvent(): void {
    this.router.navigate(['event/' + this.event.item.id]);
  }
}
