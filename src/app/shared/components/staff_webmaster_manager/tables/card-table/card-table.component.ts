import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {Observable, of} from "rxjs";
import {StaffItemDetailI} from "../../../../models/staff/staff_item_details";
import {StaffItemService} from "../../../../../core/services/staff/items/staff_item_router";
import {StaffCardService} from "../../../../../core/services/staff/items/staff_card_router";
import {StaffCardDetailI} from "../../../../models/staff/staff_card_detail";
import {RouterLink} from "@angular/router";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {map} from "rxjs/operators";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.css'],
  imports: [
    DatePipe,
    MatTableModule,
    NgIf,
    RouterLink,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  standalone: true
})
export class CardTableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id', 'academic_year', 'card_type',
    'card_nr', 'user_id', 'linked_date', 'last_edited', 'card_item',
    'unlink_button'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  cards$: Observable<StaffCardDetailI[]> = of([])

  constructor(private cardService: StaffCardService) {
  }

  ngOnInit() {
    this.LoadData()
  }

  ngAfterViewInit() {
    // Label popups are breaking something frontend related, just remove them
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.itemsPerPageLabel = '';
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
    paginatorIntl.firstPageLabel = '';
    paginatorIntl.lastPageLabel = '';
  }

  LoadData(event: PageEvent | null = null) {
    if (event === null) {
      this.cards$ = this.cardService.getCards()
      return
    }
    this.paginator!.pageIndex = event.pageIndex
    this.cards$ = this.cardService.getCards(event.pageIndex * event.pageSize, event.pageSize)
  }

  UnlinkCard(card: StaffCardDetailI) {
    this.cardService.UnlinkCard(card).subscribe({
      next: (value) => {
        this.LoadData()
      },
      error: (err) => {
        console.log(err)
      }
    });
  }
}
