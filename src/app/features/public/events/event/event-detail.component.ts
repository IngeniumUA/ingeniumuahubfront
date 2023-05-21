import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EventModelInterface} from "../../../../shared/models/items/events";
import {EventService} from "../../../../core/services/events/event.service";
@Component({
  selector: 'app-event',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private eventService: EventService) {
  }

  eventDetail?: EventModelInterface;
  primaryColor90!: string;
  primaryColorFull!: string;
  ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.eventService.getEvent(id).subscribe((data) => {
        this.eventDetail = data;

        if (this.eventDetail === undefined) {
          return;
        }
        const primaryBackground = "rgba("
          + this.eventDetail.main_color.substring(0, 3) + ", "
          + this.eventDetail.main_color.substring(3, 6) + ", "
          + this.eventDetail.main_color.substring(6, 9)

        this.primaryColor90 = primaryBackground + ", 0.9)";
        this.primaryColorFull = primaryBackground + ")";

      })
    }

  }
}
