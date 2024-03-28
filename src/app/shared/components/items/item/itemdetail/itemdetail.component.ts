import {Component, OnInit} from '@angular/core';
import {ItemService} from '../../../../../core/services/items/item.service';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {ItemI} from '../../../../models/items/ItemI';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-itemdetail',
  templateUrl: './itemdetail.component.html',
  styleUrls: ['./itemdetail.component.css'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ]
})
export class ItemdetailComponent implements OnInit {
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
