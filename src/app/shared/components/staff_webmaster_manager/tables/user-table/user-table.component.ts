import {Component, OnInit} from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {async, Observable, of} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {StaffUserService} from "../../../../../core/services/staff/staff-user-service";
import {StaffUserDetailI} from "../../../../models/staff/staff_user_detail";

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  imports: [
    MatTableModule,
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class UserTableComponent implements OnInit {

  displayedColumns = ["uuid", "prefered_mail", "lid", "is_staff", "is_manager", "modified_at"]

  userData$: Observable<StaffUserDetailI[]> = of([])

  constructor(private staffUserService: StaffUserService) {
  }

  ngOnInit() {
    this.userData$ = this.staffUserService.getUsers()
  }
}
