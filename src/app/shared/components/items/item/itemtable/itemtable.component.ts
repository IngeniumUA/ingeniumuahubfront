import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgFor} from "@angular/common";
import {Observable, of} from "rxjs";
import {Item} from "../../../../models/items/item";
import {RouterLink} from "@angular/router";

const getItems$: Observable<Item[]> = of([
  { id: "j8P9sz3", date_created: "nu", name: "Hoppety", is_active: true },
  { id: "iJhgDe5", date_created: "straks", name: "Hippety", is_active: false },
]);

@Component({
  selector: 'app-itemtable',
  templateUrl: './itemtable.component.html',
  styleUrls: ['./itemtable.component.css'],
  imports: [
    AsyncPipe,
    NgFor,
    RouterLink
  ],
  standalone: true
})
export class ItemtableComponent implements OnInit {
  items$!: Observable<Item[]>;
  ngOnInit(): void {
    this.items$ = getItems$;
  }

}
