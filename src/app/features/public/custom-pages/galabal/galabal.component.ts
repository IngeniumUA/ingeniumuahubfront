import {Component, OnInit} from '@angular/core';
import {EventService} from "@ingenium/app/core/services/coreAPI/item/derived_services/event.service";
import {EventItemWideI} from "@ingenium/app/shared/models/item/eventI";

@Component({
  selector: 'app-galabal',
  templateUrl: './galabal.component.html',
  styleUrls: ['./galabal.component.css']
})
export class GalabalComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getEvent("Ingenium%20Galabal").subscribe({
      next: item => {
        if (item.data === undefined || item.data === null) {
          window.location.href = 'https://www.instagram.com/ingeniumua/';
          return
        }
        const eventItem = item.data as EventItemWideI;
        const url = eventItem.derived_type.display.follow_through_link
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          window.location.href = `https://ingeniumua.be/${url}`;
        }
      },
      error: (_: Error) => {
        window.location.href = 'https://www.instagram.com/ingeniumua/';
      }
    })
  }

}
