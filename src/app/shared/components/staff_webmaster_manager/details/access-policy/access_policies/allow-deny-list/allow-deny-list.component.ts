import {Component, Input} from '@angular/core';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-allow-deny-list',
  templateUrl: './allow-deny-list.component.html',
  styleUrls: ['./allow-deny-list.component.css'],
  imports: [
    JsonPipe
  ],
  standalone: true
})
export class AllowDenyListComponent {

    @Input() access_policy_json: object | undefined;
    @Input() access_policy_name: string | undefined;

}
