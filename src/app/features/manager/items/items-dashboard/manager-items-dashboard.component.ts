import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemTableComponent } from '../../../../shared/components/items/item/itemtable/item-table.component';

@Component({
    selector: 'app-items',
    templateUrl: './manager-items-dashboard.component.html',
    styleUrls: ['./manager-items-dashboard.component.css'],
    imports: [RouterLink, ItemTableComponent]
})
export class ManagerItemsDashboardComponent {
}
