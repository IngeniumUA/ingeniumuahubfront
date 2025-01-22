import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {ItemService} from "@ingenium/app/core/services/coreAPI/item/item.service";
import {ItemI} from "@ingenium/app/shared/models/item/itemI";

@Component({
  selector: 'app-itemdetail',
  templateUrl: './manager-item-detail.component.html',
  styleUrls: ['./manager-item-detail.component.css'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ]
})
export class ManagerItemDetailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private itemService: ItemService) {
  }
  item$!: Observable<ItemI>;
  ngOnInit() {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.item$ = this.itemService.getItem(id);
    }
  }
}
