import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {Observable} from 'rxjs';
import {ItemI} from '../../../../models/items/ItemI';
import {RouterLink} from '@angular/router';
import {ItemService} from '../../../../../core/services/items/item.service';


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
