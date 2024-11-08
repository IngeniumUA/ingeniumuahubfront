import {Component, OnInit} from '@angular/core';
import {catchError, ignoreElements, Observable, of} from 'rxjs';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import {PromoService} from "@ingenium/app/core/services/coreAPI/item/derived_services/promo.service";
import {ItemWideLimitedI} from "@ingenium/app/shared/models/item/itemwideI";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-vacature-display',
  templateUrl: './vacature-display.component.html',
  styleUrls: ['./vacature-display.component.scss']
})
export class VacatureDisplayComponent implements OnInit {

  isMobile$: Observable<boolean> = this.layoutService.isMobile;
  vacature$: Observable<ItemWideLimitedI> = of();
  vacatureError$!: Observable<any>;
  item_id!: string;


  constructor(private layoutService: LayoutService,
              private promoService: PromoService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  ngOnInit() {
    // Fetch ID
    const thisUrl: string = currentPage
    let id: string | null = thisUrl.replace("sub/vacature/", "").replace("sub/vacatures/", "")
    if (id === thisUrl) {id = null}

    // If ID is null
    if (id === null) {
      this.IdError();
      return;
    }

    this.item_id = id;
    this.vacature$ = this.promoService.getPromo('vacature', this.item_id);
    this.vacatureError$ = this.vacature$.pipe(
      ignoreElements(),
      catchError((err) => {
        return of(err);
      })
    );
  }

  IdError() {
    this.pageTrackService.addToTree('sub/vacatures')
    this.navCtrl.navigateRoot('/sub/vacatures').then()
  }

  ImageDivClass(isMobile: boolean | null) {
    if (isMobile === null) {
      return 'mx-[20%]';
    }
    if (isMobile) {
      return '';
    } else {
      return 'mx-[20%]';
    }
  }
}
