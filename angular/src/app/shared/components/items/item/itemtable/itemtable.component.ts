import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {RouterLink} from '@angular/router';
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";


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
  constructor(private itemService: ItemService) {
  }
  items$!: Observable<ItemI[]>;
  ngOnInit(): void {
    this.items$ = this.itemService.getItems();
  }

}
