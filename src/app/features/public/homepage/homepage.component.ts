import {afterNextRender, Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {RecSysPreviewI} from '@ingenium/app/shared/models/items/recsys_interfaces';
import {EventService} from '@ingenium/app/core/services/items/events/event.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  homePageRec$: Observable<RecSysPreviewI[]> = of([]);

  constructor(private eventService: EventService) {
    afterNextRender(() => { // Without this in pre-rendering we would get outdated data from the server
      this.homePageRec$ = this.eventService.getEventsList();
    });
  }

  sponsors: string[] = [
    'assets/images/sponsors/umicore-logo-2017.svg',
    'assets/images/sponsors/SparklinkLogo.png',
    'assets/images/sponsors/Vorsselmans_logo.png'
  ];
}
