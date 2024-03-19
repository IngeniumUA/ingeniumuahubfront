import { CommonModule } from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {TransactionI} from '../../../../core/services/user/account/account.service';
import {CheckoutI} from '../../items/interactions/checkout';

@Component({
  selector: 'app-checkout-display',
  templateUrl: './checkout-display.component.html',
  styleUrls: ['./checkout-display.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class CheckoutDisplayComponent {

  @Input() checkout!: CheckoutI;

}
