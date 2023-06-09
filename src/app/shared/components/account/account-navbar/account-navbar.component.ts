import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-account-navbar',
    templateUrl: './account-navbar.component.html',
    styleUrls: ['./account-navbar.component.css'],
    imports: [
        RouterLink
    ],
    standalone: true
})
export class AccountNavbarComponent {

}
