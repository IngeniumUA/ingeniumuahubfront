import {Component, Input, OnInit} from '@angular/core';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {DatePipe, NgClass, NgIf, NgOptimizedImage, NgStyle, NgTemplateOutlet} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ColordbrgbaPipe} from '@ingenium/app/shared/pipes/item/colorpipe.pipe';
import {calcIntensity} from "@ingenium/app/shared/pipes/item/colorIntensity";

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
    NgTemplateOutlet,
    NgOptimizedImage
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

    textColor() {
      // We could customize this
      return calcIntensity(this.recsysItem.color) < 180 ? 'white' : 'black';
    }

    CardStyle(): object {
      const colorPipe = new ColordbrgbaPipe();
      if (this.small) {
        return {
          'background': colorPipe.transform(this.recsysItem.color, 1),
          'border': `solid 2px ${colorPipe.transform(this.recsysItem.color, 0.5)}`,
          'max-width': '10rem'
        };
      } else {
        return {
          'background': colorPipe.transform(this.recsysItem.color, 1),
          'border': `solid 2px ${colorPipe.transform(this.recsysItem.color, 0.5)}`
        };
      }

    }
}
