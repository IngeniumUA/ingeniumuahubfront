import {Component, Input, OnInit} from '@angular/core';
import {RecSysPreviewI} from "../../../../models/items/recsys_interfaces";
import {DatePipe, NgClass, NgIf, NgStyle} from "@angular/common";
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
    ColordbrgbaPipe,
    NgIf,
    NgClass
  ]
})
export class RecSysItemPreviewComponent implements OnInit {
    @Input() recsysItem!: RecSysPreviewI;
    isLandscape!: boolean;
    image!: string;

    ngOnInit() {
      this.isLandscape = this.recsysItem.image_square === null
      this.image = this.isLandscape ? this.recsysItem.image_landscape: this.recsysItem.image_square
    }
}
