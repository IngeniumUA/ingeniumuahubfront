import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {debounceTime, delay, Observable, of} from "rxjs";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {StaffUserService} from "../../../../../core/services/staff/staff-user-service";
import {StaffUserDetailI} from "../../../../models/staff/staff_user_detail";
import {RouterLink} from "@angular/router";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
    imports: [
        MatTableModule,
        AsyncPipe,
        NgIf,
        RouterLink,
        DatePipe,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule
    ],
  standalone: true
})
export class UserTableComponent implements OnInit, AfterViewInit {
  userData$: Observable<StaffUserDetailI[]> = of([])
  userStats$: Observable<number> = of(0)

  searchForm = new FormGroup({
      uuidControl: new FormControl(''),
      emailControl: new FormControl(''),
  })

  GetDisplayedColumns(): string[] {
      return ["uuid", "email", "password_set", "lid", "is_staff", "is_manager", "last_login", "modified_at"]
  }

  constructor(private staffUserService: StaffUserService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.LoadData();
    this.searchForm.valueChanges.pipe(
        delay(500),
        distinctUntilChanged((prev, next) => prev.emailControl === next.emailControl),
        debounceTime(500)
        //combineLatest
    ).subscribe((value) => {
            this.LoadData()
        }
    )
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

  LoadData(pageEvent: PageEvent | null = null) {
    // Form parsing
    const emailControlValue = this.searchForm.get('emailControl')!.value;
    const uuidControlValue = this.searchForm.get('uuidControl')!.value;

    const emailQuery = emailControlValue === '' ? null: emailControlValue;
    const uuidQuery = uuidControlValue === '' ? null: uuidControlValue;

    // Page behaviour
    const pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    // Data
    this.userData$ = this.staffUserService.getUsers(pageIndex * pageSize, pageSize, uuidQuery, emailQuery)

    // Stats
    this.userStats$ = this.staffUserService.getUserStats(pageIndex * pageSize, pageSize, uuidQuery, emailQuery)
  }
}
