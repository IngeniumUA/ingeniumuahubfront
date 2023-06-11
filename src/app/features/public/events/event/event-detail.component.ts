import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventItemI} from "../../../../shared/models/items/events";
import {EventService} from "../../../../core/services/events/event.service";
import {Observable, tap} from "rxjs";
import {LayoutService} from "../../../../core/services/layout/layout.service";
@Component({
  selector: 'app-event',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private elementRef: ElementRef,
              private layoutService: LayoutService,
              private eventService: EventService) {
  }
  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  event$?: Observable<EventItemI>;
  primaryColor90!: string;
  primaryColorFull!: string;
  ngOnInit() {
    // Fetch ID
    const id: string | null = this.route.snapshot.paramMap.get('id');

    if (id != null) {
      this.event$ = this.eventService.getEvent(id).pipe(
        tap((event: EventItemI) => {
          const primaryBackground = "rgba("
            + event.main_color.substring(0, 3) + ", "
            + event.main_color.substring(3, 6) + ", "
            + event.main_color.substring(6, 9)

          this.primaryColor90 = primaryBackground + ", 0.9)";
          this.primaryColorFull = primaryBackground + ")";
        })
      );
    }
  }


  ProductOnHover(id: string): void {
    // TODO De product 'sectie' waarover je hovert of klikt moet de primarycolor worden
  }
}
