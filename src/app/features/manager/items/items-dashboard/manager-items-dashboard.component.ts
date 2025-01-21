import {Component} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ItemtableComponent } from '../../../../shared/components/items/item/itemtable/itemtable.component';

@Component({
    selector: 'app-items',
    templateUrl: './manager-items-dashboard.component.html',
    styleUrls: ['./manager-items-dashboard.component.css'],
    imports: [RouterLink, ItemtableComponent]
})
export class ManagerItemsDashboardComponent {
}
