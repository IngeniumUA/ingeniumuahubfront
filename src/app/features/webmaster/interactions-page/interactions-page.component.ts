import { Component } from '@angular/core';
import {
  InteractionTableComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/tables/interaction/interaction-table.component";

@Component({
    selector: 'app-interactions-page',
    imports: [
        InteractionTableComponent
    ],
    templateUrl: './interactions-page.component.html'
})
export class InteractionsPageComponent {

}
