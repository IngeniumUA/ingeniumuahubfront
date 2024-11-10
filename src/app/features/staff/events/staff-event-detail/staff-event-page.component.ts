import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {ItemWideService} from "@ingenium/app/core/services/coreAPI/item/itemwide.service";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

@Component({
  selector: 'app-staff-page',
  templateUrl: './staff-event-page.component.html',
  styleUrls: ['./staff-event-page.component.css'],
})
export class StaffEventPageComponent implements OnInit {
  event$?: Observable<ItemWideI>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private itemWideService: ItemWideService,
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
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id === null) {
      this.router.navigateByUrl('home');
      return;
    }
    this.SetEvent(id);
  }

  SetEvent(id: string): void {
    this.event$ = this.itemWideService.getItem(id);
  }
}
