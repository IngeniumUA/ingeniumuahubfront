import { Component } from '@angular/core';
import { PublicHeaderComponent } from '../../../../core/layout/public/header/public-header.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-checkout-confirm',
    templateUrl: './checkout-confirm.component.html',
    imports: [PublicHeaderComponent, RouterLink]
})
export class CheckoutConfirmComponent {

}
