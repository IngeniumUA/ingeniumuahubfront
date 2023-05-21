import {Component, OnInit} from '@angular/core';
import {RecSysService} from "../../../../../core/services/recsys/rec-sys.service";
import {EventPreviewModel} from "../../../../models/items/events";

@Component({
  selector: 'app-recsys',
  templateUrl: './rec-sys.component.html',
  styleUrls: ['./rec-sys.component.css']
})
export class RecSysComponent implements OnInit {
  constructor(private recsysService: RecSysService) {
  }

  eventPreview?: EventPreviewModel;

  ngOnInit(): void {
    this.recsysService.getEventPreview().
    subscribe((data) => {
      this.eventPreview = data;})
  }
}
