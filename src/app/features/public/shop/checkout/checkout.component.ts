import {Component} from '@angular/core';
import { PublicHeaderComponent } from '../../../../core/layout/public/header/public-header.component';
import { ShoppingcartListComponent } from '../../../../shared/components/items/shopping-cart/shoppingcart-list/shoppingcart-list.component';

@Component({
    selector: 'app-page',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css'],
    imports: [PublicHeaderComponent, ShoppingcartListComponent]
})
export class CheckoutComponent {
}
