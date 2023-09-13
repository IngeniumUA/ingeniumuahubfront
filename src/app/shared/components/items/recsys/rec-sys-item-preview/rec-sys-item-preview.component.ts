import {Component, Input} from '@angular/core';
import {RecSysPreviewI} from "../../../../models/items/recsys_interfaces";
import {DatePipe, NgStyle} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ColordbrgbaPipe} from "../../../../pipes/item/colorpipe.pipe";

@Component({
  selector: 'app-rec-sys-item-preview',
  templateUrl: './rec-sys-item-preview.component.html',
  styleUrls: ['./rec-sys-item-preview.component.css'],
  standalone: true,
  imports: [
    DatePipe,
    NgStyle,
    RouterLink,
    ColordbrgbaPipe
  ]
})
export class RecSysItemPreviewComponent {
    @Input() recsysItem!: RecSysPreviewI;
}
