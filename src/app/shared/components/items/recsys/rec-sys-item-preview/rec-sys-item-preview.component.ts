import {Component, Input, OnInit} from '@angular/core';
import {RecSysPreviewI} from '@ingenium/app/shared/models/item/recsysI';
import {DatePipe, NgIf, NgOptimizedImage, NgStyle, NgTemplateOutlet} from '@angular/common';
import {ColordbrgbaPipe} from '@ingenium/app/shared/pipes/item/colorpipe.pipe';
import {NavController} from "@ionic/angular";
import {PageTrackingService} from "@app_services/page-tracking.service";
import {calcIntensity} from "@ingenium/app/shared/pipes/item/colorIntensity";

@Component({
  selector: 'app-rec-sys-item-preview',
  templateUrl: './rec-sys-item-preview.component.html',
  styleUrls: ['./rec-sys-item-preview.component.css'],
  standalone: true,
  imports: [
    DatePipe,
    NgStyle,
    NgIf,
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
    description!: string;

    ngOnInit() {
      this.isLandscape = this.recsysItem.image_square === null || this.recsysItem.image_square === '';
      this.image = this.isLandscape ? this.recsysItem.image_landscape: this.recsysItem.image_square;
      this.internalLink = this.recsysItem.follow_through_link.match('^https?:\\/\\/|mailto:') === null;
      this.description = this.recsysItem.preview_description === null ? "" : this.recsysItem.preview_description;
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

    constructor(private navCtrl: NavController,
                private pageTrackService: PageTrackingService) {
    }

    gotoPage(page: string) {
      page = 'sub' + page
      this.pageTrackService.addToTree(page)
      this.navCtrl.navigateRoot('/'+page).then()
    }

}
