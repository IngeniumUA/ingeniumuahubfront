import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";
import {AppFunctionsService} from "@app_services/app-functions.service";


@Component({
  selector: 'app-itemtable',
  templateUrl: './itemtable.component.html',
  styleUrls: ['./itemtable.component.css'],
  imports: [
    AsyncPipe,
    NgFor,
    NgIf
  ],
  standalone: true
})
export class ItemtableComponent implements OnInit {
  constructor(private itemService: ItemService,
              private appFunctionsService: AppFunctionsService,) {
  }
  items$!: Observable<ItemI[]>;
  ngOnInit(): void {
    this.items$ = this.itemService.getItems();
  }

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

}
