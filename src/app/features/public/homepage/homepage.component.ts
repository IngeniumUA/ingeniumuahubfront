import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/items/recsys_interfaces';
import {EventService} from '@ingenium/app/core/services/items/events/event.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  homePageRec$: Observable<RecSysPreviewI[]> = of([]);

  constructor(private eventService: EventService) {}

  sponsors: string[] = [
    'assets/images/sponsors/umicore-logo-2017.svg',
    'assets/images/sponsors/SparklinkLogo.png',
    'assets/images/sponsors/Vorsselmans_logo.png'
  ];

  ngOnInit() {
    this.homePageRec$ = this.eventService.getEventsList();
  }
}
