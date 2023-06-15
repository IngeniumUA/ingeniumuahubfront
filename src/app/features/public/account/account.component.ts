import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  template: '<app-account-navbar></app-account-navbar>\n' +
            '<router-outlet></router-outlet>'
})
export class AccountComponent {

}
