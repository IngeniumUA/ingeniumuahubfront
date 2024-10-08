import {Component, Input, OnInit} from '@angular/core';
import {RecSysPreviewI} from '@ingenium/app/shared/models/items/recsys_interfaces';
import {DatePipe, NgClass, NgIf, NgStyle, NgTemplateOutlet} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ColordbrgbaPipe} from '@ingenium/app/shared/pipes/item/colorpipe.pipe';

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
    NgClass,
    NgTemplateOutlet
  ]
})
export class RecSysItemPreviewComponent implements OnInit {
    @Input() recsysItem!: RecSysPreviewI;
    @Input() small: boolean = false;
    isLandscape!: boolean;
    image!: string;
    internalLink: boolean = false;

    ngOnInit() {
      this.isLandscape = this.recsysItem.image_square === null || this.recsysItem.image_square === '';
      this.image = this.isLandscape ? this.recsysItem.image_landscape: this.recsysItem.image_square;
      this.internalLink = this.recsysItem.follow_through_link.match('^https?:\\/\\/') === null;
    }

    TextColor() {
      // We could customize this
      return 'rgb(255,255,255)';
    }

    CardStyle(): object {
      const colorPipe = new ColordbrgbaPipe();
      // TODO This is ugly, need to lookup more on how objects are created to make better
      if (this.small) {
        return {
          'background': colorPipe.transform(this.recsysItem.color, 1),
          'border': 'solid 2px rgb(0, 0, 0)',
          'max-width': '10rem'
        };
      } else {
        return {
          'background': colorPipe.transform(this.recsysItem.color, 1),
          'border': 'solid 2px rgb(0, 0, 0)'
        };
      }

    }
}
