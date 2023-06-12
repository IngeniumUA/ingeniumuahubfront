import {Component} from '@angular/core';
import {RecSysService} from "../../../../../core/services/recsys/rec-sys.service";
import {EventItemI} from "../../../../models/items/events";
import {Observable} from "rxjs";

@Component({
  selector: 'app-recsys',
  templateUrl: './rec-sys.component.html',
  styleUrls: ['./rec-sys.component.css']
})
export class RecSysComponent {
  constructor(private recsysService: RecSysService) {
  }

  event$: Observable<EventItemI> = this.recsysService.getEventPreview();
}
