import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {FlagService} from "@ingenium/app/core/services/coreAPI/flag.service";
import {PaymentProviderEnum} from "@ingenium/app/shared/models/product/products";
import {NavController, Platform} from "@ionic/angular";
import {currentPage, PageTrackingService} from "@app_services/page-tracking.service";

interface FlagI {
  id: number
  name: string
  value: object
}

@Component({
  selector: 'app-flag-table',
  templateUrl: './flag-table.component.html',
  styleUrls: ['./flag-table.component.css']
})
export class FlagTableComponent implements OnInit {

  loading: boolean = false;
  addingFlag: boolean = false

  flags$: Observable<FlagI[]> = of([])


  constructor(private flagService: FlagService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,
              private platform: Platform) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.pageTrackService.popFromTree()
      this.navCtrl.navigateRoot('/'+currentPage).then()
    });
  }

  ngOnInit() {
    this.LoadData()
  }

  LoadData() {
    this.flags$ = this.flagService.queryFlags();
  }

  ToggleAddingFlag() {
    this.addingFlag = !this.addingFlag
  }

  FlagCreated() {
    this.addingFlag = false;
    this.LoadData()
  }

  protected readonly PaymentProviderEnum = PaymentProviderEnum;
}
