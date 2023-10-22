import { Component } from '@angular/core';
import {MatTableModule} from "@angular/material/table";
import {async, Observable, of} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";

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
export class UserTableComponent {

  displayedColumns = ["uuid"]

  userTable$: Observable<any[]> = of([])
}
