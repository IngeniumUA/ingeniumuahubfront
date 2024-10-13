import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {debounceTime, delay, Observable, of} from 'rxjs';
import {StaffCardService} from '@ingenium/app/core/services/staff/items/staff_card_router';
import {CardTypes, StaffCardDetailI} from '../../../../models/staff/staff_card_detail';
import {RouterLink} from '@angular/router';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {distinctUntilChanged} from 'rxjs/operators';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LayoutService} from '@ingenium/app/core/services/layout/layout.service';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss'],
  imports: [
    DatePipe,
    MatTableModule,
    NgIf,
    RouterLink,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true
})
export class CardTableComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  cardStats$: Observable<any> = of();
  cards$: Observable<StaffCardDetailI[]> = of([]);
  isMobile$ = this.layoutService.isMobile;

  searchForm = new FormGroup({
    userControl: new FormControl(''),
    cardTypeControl: new FormControl(''),
    cardNrControl: new FormControl('')
  });

  GetDisplayedColumns(): string[] {
    return ['id', 'academic_year', 'card_type',
      'card_nr', 'user', 'linked_date', 'last_edited', 'card_item',
      'unlink_button'];
  }

  constructor(private cardService: StaffCardService,
              private layoutService: LayoutService) {
  }

  ngOnInit() {
    this.LoadData();
    this.searchForm.valueChanges.pipe(
      delay(500),
      distinctUntilChanged((prev, next) => prev === next),
      debounceTime(500)
      //combineLatest
    ).subscribe(() => {
      this.LoadData();
    }
    );
  }

  ngAfterViewInit() {
    // Label popups are breaking something frontend related, just remove them
    // In some cases the paginator is undefined ? We check if it is defined
    if (this.paginator === undefined) {
      return;
    }
    const paginatorIntl = this.paginator._intl;
    paginatorIntl.itemsPerPageLabel = '';
    paginatorIntl.nextPageLabel = '';
    paginatorIntl.previousPageLabel = '';
    paginatorIntl.firstPageLabel = '';
    paginatorIntl.lastPageLabel = '';
  }

  LoadData(pageEvent: PageEvent | null = null) {
    // Form parsing
    const userControlValue = this.searchForm.get('userControl')!.value;
    const cardTypeControl = this.searchForm.get('cardTypeControl')!.value;
    const cardNrControl = this.searchForm.get('cardNrControl')!.value;

    const userQuery = userControlValue === '' ? null: userControlValue;
    const cardTypeQuery = cardTypeControl === '' ? null: cardTypeControl;
    const cardNrQuery = cardNrControl === '' ? null: cardNrControl;

    // Page behaviour
    const pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    this.cardStats$ = this.cardService.getCardStats(pageIndex * pageSize, pageSize, userQuery, cardTypeQuery, cardNrQuery, null);
    this.cards$ = this.cardService.getCards(pageIndex * pageSize, pageSize, userQuery, cardTypeQuery, cardNrQuery, null);
  }

  DownloadData() {

  }

  UnlinkCard(card: StaffCardDetailI) {
    this.cardService.UnlinkCard(card).subscribe({
      next: () => {
        this.LoadData();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  protected readonly CardTypes = CardTypes;
}
