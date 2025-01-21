import { Component } from '@angular/core';
import { GroupTableComponent } from '../../../../shared/components/staff_webmaster_manager/tables/group-table/group-table.component';

@Component({
    selector: 'app-group-list',
    templateUrl: './group-list.component.html',
    styleUrls: ['./group-list.component.css'],
    imports: [GroupTableComponent]
})
export class GroupListComponent {

}
