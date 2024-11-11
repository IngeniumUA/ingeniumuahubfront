import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {RouterLink} from '@angular/router';
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {NavController} from "@ionic/angular";
import {PageTrackingService} from "@app_services/page-tracking.service";


@Component({
  selector: 'app-itemtable',
  templateUrl: './itemtable.component.html',
  styleUrls: ['./itemtable.component.css'],
  imports: [
    AsyncPipe,
    NgFor,
    RouterLink,
    NgIf
  ],
  standalone: true
})
export class ItemtableComponent implements OnInit {
  constructor(private itemService: ItemService,
              private navCtrl: NavController,
              private pageTrackService: PageTrackingService,) {
  }
  items$!: Observable<ItemI[]>;
  ngOnInit(): void {
    this.items$ = this.itemService.getItems();
  }

  gotoPage(page: string) {
    this.pageTrackService.addToTree(page)
    this.navCtrl.navigateRoot('/'+page).then()
  }

}
