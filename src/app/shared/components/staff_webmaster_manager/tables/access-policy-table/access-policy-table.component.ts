import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Observable, of} from "rxjs";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {StaffAccessPolicyService} from "../../../../../core/services/staff/staff-accesspolicy.service";
import {StaffAccessPolicy} from "../../../../models/staff/staff_access_policy";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";

@Component({
  selector: 'app-access-policy-table',
  templateUrl: './access-policy-table.component.html',
  styleUrls: ['./access-policy-table.component.css'],
  imports: [
    AsyncPipe,
    DatePipe,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgIf
  ],
  standalone: true
})
export class AccessPolicyTableComponent implements AfterViewInit {
  displayedColumns = ["id", "method", "content", "is_disabled", "name", "description"]

  accessPolicies$: Observable<StaffAccessPolicy[]> = of([])

  constructor(private staffAccessPolicyService: StaffAccessPolicyService) {
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
      this.accessPolicies$ = this.staffAccessPolicyService.getAccessPolicies()
      return
    }
    this.paginator!.pageIndex = event.pageIndex
    this.accessPolicies$ = this.staffAccessPolicyService.getAccessPolicies(event.pageIndex * event.pageSize, event.pageSize)
  }
}
