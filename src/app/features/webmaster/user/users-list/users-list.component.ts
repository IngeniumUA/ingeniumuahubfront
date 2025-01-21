import { Component } from '@angular/core';
import { UserTableComponent } from '../../../../shared/components/staff_webmaster_manager/tables/user-table/user-table.component';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
    imports: [UserTableComponent]
})
export class UsersListComponent {

}
