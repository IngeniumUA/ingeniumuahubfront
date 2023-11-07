import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {async, Observable, of} from "rxjs";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {StaffUserService} from "../../../../../core/services/staff/staff-user-service";
import {StaffUserDetailI} from "../../../../models/staff/staff_user_detail";
import {RouterLink} from "@angular/router";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

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
    MatProgressSpinnerModule
  ],
  standalone: true
})
export class UserTableComponent implements OnInit, AfterViewInit {

  displayedColumns = ["uuid", "prefered_mail", "password_set", "lid", "is_staff", "is_manager", "modified_at"]

  userData$: Observable<StaffUserDetailI[]> = of([])

  constructor(private staffUserService: StaffUserService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
      this.userData$ = this.staffUserService.getUsers()
      return
    }
    this.paginator!.pageIndex = event.pageIndex
    this.userData$ = this.staffUserService.getUsers(event.pageIndex * event.pageSize, event.pageSize)
  }
}
