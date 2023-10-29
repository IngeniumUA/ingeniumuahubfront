import {Component, OnInit} from '@angular/core';
import {StaffItemService} from "../../../../../core/services/staff/items/staff_item_router";
import {StaffItemDetailI} from "../../../../models/staff/staff_item_details";
import {Observable, of} from "rxjs";
import {MatTableModule} from "@angular/material/table";
import {DatePipe, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
  imports: [
    MatTableModule,
    NgIf,
    RouterLink,
    DatePipe
  ],
  standalone: true
})
export class ItemTableComponent implements OnInit {

  displayedColumns: string[] = ['uuid', 'name', 'available', 'disabled', 'created_at', 'modified_at'];

  items$: Observable<StaffItemDetailI[]> = of([])

  constructor(private itemService: StaffItemService) {
  }

  ngOnInit() {
    this.items$ = this.itemService.getItems()
  }

}
