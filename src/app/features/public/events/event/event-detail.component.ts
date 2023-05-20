import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
@Component({
  selector: 'app-event',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent {
  constructor(route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get('id');
    console.log(id)
  }
}
