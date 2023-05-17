import { Component } from '@angular/core';
import {EventPreview} from "../../../../models/items/events";
import {Router} from "@angular/router";
import {EventService} from "../../../../../core/services/events/event.service";

@Component({
  selector: 'app-eventpreview',
  templateUrl: './eventpreview.component.html',
  styleUrls: ['./eventpreview.component.css']
})
export class EventpreviewComponent {
  eventPreview?: EventPreview;

  constructor(router: Router) {
  }

  public RedirectToEvent(): void {
    // TODO Redirect
  }
}
