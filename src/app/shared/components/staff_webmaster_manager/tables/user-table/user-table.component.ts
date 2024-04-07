import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {debounceTime, delay, Observable, of} from 'rxjs';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {StaffUserService} from '../../../../../core/services/staff/staff-user-service';
import {StaffUserDetailI} from '../../../../models/staff/staff_user_detail';
import {RouterLink} from '@angular/router';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {HubGroupI} from '../../../../models/staff/HubGroup';
import {StaffGroupService} from '../../../../../core/services/staff/group/staff-group.service';

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
    ReactiveFormsModule,
    NgForOf,
    MatFormFieldModule,
    MatInputModule
  ],
  standalone: true
})
export class UserTableComponent implements OnInit, AfterViewInit {
  userData$: Observable<StaffUserDetailI[]> = of([]);
  userStats$: Observable<number> = of(0);
  groups$: Observable<HubGroupI[]> = this.staffGroupService.GetGroupsList();
  usersExport$: Observable<Blob> = of();

  blob!: Blob;

  columnSearchForm = new FormGroup({
    uuidControl: new FormControl(''),
    emailControl: new FormControl(''),
  });

  searchForm = new FormGroup({
    groupsControl: new FormArray<FormControl>([])
  });

  GetDisplayedColumns(): string[] {
    return ['uuid', 'email', 'password_set', 'lid', 'is_staff', 'is_manager', 'last_login', 'modified_at'];
  }

  constructor(private datePipe: DatePipe,
              private staffUserService: StaffUserService,
              private staffGroupService: StaffGroupService) {
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.LoadData();
    this.searchForm.valueChanges.pipe(
      delay(1500),
      debounceTime(500)
    ).subscribe(()=> {
      this.LoadData();
    });
    this.columnSearchForm.valueChanges.pipe(
      delay(1500),
      debounceTime(500),
      distinctUntilChanged((prev, next) => prev.emailControl === next.emailControl),
      //combineLatest
    ).subscribe(() => {
      this.LoadData();
    }
    );
  }

  ngAfterViewInit() {
    // Label popups are breaking something frontend related, we just remove them
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
    const emailControlValue = this.columnSearchForm.get('emailControl')!.value;
    const uuidControlValue = this.columnSearchForm.get('uuidControl')!.value;
    const groupControls = this.searchForm.controls['groupsControl'];
    const groupControlValues = groupControls.controls.map((control) => {return control.value;});
    const groupControlValuesFiltered = groupControlValues.filter((value) => { return value > 0; });

    const emailQuery = emailControlValue === '' ? null: emailControlValue;
    const uuidQuery = uuidControlValue === '' ? null: uuidControlValue;
    const groupsQueries: number[] = (groupControlValuesFiltered.length < 0) ? []: groupControlValuesFiltered;

    // Page behaviour
    const pageIndex = pageEvent === null ? 0: pageEvent.pageIndex;
    const pageSize = pageEvent === null ? 100: pageEvent.pageSize;

    // Data
    this.userData$ = this.staffUserService.getUsers(pageIndex * pageSize, pageSize, uuidQuery, emailQuery, groupsQueries);

    // Stats
    this.userStats$ = this.staffUserService.getUserStats(pageIndex * pageSize, pageSize, uuidQuery, emailQuery, groupsQueries);
  }

  DownloadData() {
    // Form parsing
    const emailControlValue = this.columnSearchForm.get('emailControl')!.value;
    const uuidControlValue = this.columnSearchForm.get('uuidControl')!.value;
    const groupControls = this.searchForm.controls['groupsControl'];
    const groupControlValues = groupControls.controls.map((control) => {return control.value;});
    const groupControlValuesFiltered = groupControlValues.filter((value) => { return value > 0; });

    const emailQuery = emailControlValue === '' ? null: emailControlValue;
    const uuidQuery = uuidControlValue === '' ? null: uuidControlValue;
    const groupsQueries: number[] = (groupControlValuesFiltered.length < 0) ? []: groupControlValuesFiltered;

    const fields: string[] = ['uuid', 'email', 'voornaam', 'achternaam', 'telefoonnummer', 'last_login', 'last_edited'];

    this.usersExport$ = this.staffUserService.getUsersExport(fields, uuidQuery, emailQuery, groupsQueries);
    this.usersExport$.pipe(

    ).subscribe((data) => {
      const date = new Date();
      const pipedDate = this.datePipe.transform(date, 'dd-MM-yyyy');


      this.blob = new Blob([data], {type: 'application/vnd.ms-excel'});

      const downloadURL = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'UserExport_' + pipedDate + '.xlsx';
      link.click();

      // This took me longer than I would like to admit
      // These two answers hold all the answers
      // https://stackoverflow.com/questions/52154874/angular-6-downloading-file-from-rest-api
      // https://stackoverflow.com/questions/60730934/typescript-http-get-error-no-overload-matches-this-call
    });
  }

  AddGroupField() {
    this.searchForm.controls['groupsControl'].push(new FormControl(0, Validators.min(1)));
  }

  RemoveGroupField(index: number) {
    this.searchForm.controls['groupsControl'].removeAt(index);
  }
}
