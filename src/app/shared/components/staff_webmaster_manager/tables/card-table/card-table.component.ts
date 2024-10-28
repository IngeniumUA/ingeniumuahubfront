import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {debounceTime, delay, Observable, of} from 'rxjs';
import {RouterLink} from '@angular/router';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {distinctUntilChanged} from 'rxjs/operators';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CardService} from "@ingenium/app/core/services/coreAPI/item/derived_services/card.service";
import {
  CardItemWideI, CardMembershipEnum,
  CardMembershipEnumList,
  CardTypeEnum,
  CardTypeEnumList
} from "@ingenium/app/shared/models/item/cardI";

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
    NgForOf,
    TitleCasePipe
  ],
  standalone: true
})
export class CardTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() userUUID: string | null = null;

  cards$: Observable<CardItemWideI[]> = of([]);

  searchForm = new FormGroup({
    userControl: new FormControl(''),
    cardTypeControl: new FormControl(''),
    cardMembershipTypeControl: new FormControl(''),
    cardNrControl: new FormControl('')
  });

  GetDisplayedColumns(): string[] {
    return ['id', 'card_type', 'membership_type',
      'card_nr', 'user', 'last_edited', 'card_item',
      'unlink_button'];
  }

  constructor(private cardService: CardService) {
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

    const emailQuery = userControlValue === '' ? null: userControlValue;
    const cardTypeQuery = cardTypeControl === '' || cardTypeControl === null ? null: parseInt(cardTypeControl);
    const cardNrQuery = cardNrControl === '' ? null: cardNrControl;

    // User
    const userQuery = this.userUUID !== null ? this.userUUID : emailQuery;

    // Page behaviour
    const pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    this.cards$ = this.cardService.queryCards(pageIndex * pageSize, pageSize,
      userQuery, cardTypeQuery, cardNrQuery);
  }

  DownloadData() {

  }

  UnlinkCard(card_id: number
    ) {
    this.cardService.unlinkCard(card_id).subscribe({
      next: () => {
        this.LoadData();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  protected readonly CardTypeEnum = CardTypeEnum;
  protected readonly CardTypeEnumList = CardTypeEnumList;
  protected readonly CardMembershipEnumList = CardMembershipEnumList;
  protected readonly CardMembershipEnum = CardMembershipEnum;
}
