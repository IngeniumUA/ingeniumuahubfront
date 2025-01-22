import { Component } from '@angular/core';
import {
  InteractionTableComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/tables/interaction/interaction-table.component";

@Component({
  selector: 'app-interactions-page',
  standalone: true,
  imports: [
    InteractionTableComponent
  ],
  templateUrl: './interactions-page.component.html',
  // styleUrl: './interactions-page.component.css'
})
export class InteractionsPageComponent {

}
