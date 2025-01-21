import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {RouterLink} from '@angular/router';
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";


@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    RouterLink,
    NgIf
  ]
})
export class ItemTableComponent implements OnInit {
  constructor(private itemService: ItemService) {
  }
  items$!: Observable<ItemI[]>;
  ngOnInit(): void {
    this.items$ = this.itemService.getItems();
  }

}
