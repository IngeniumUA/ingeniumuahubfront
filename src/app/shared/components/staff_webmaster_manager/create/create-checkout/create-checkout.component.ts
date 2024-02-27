import {Component, Input} from '@angular/core';
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {StaffProductService} from "../../../../../core/services/staff/staff-product.service";
import {Observable} from "rxjs";
import {IProductItem} from "../../../../models/items/products/products";
import {ValidityOptions} from "../../../../models/items/validity";



@Component({
  selector: 'app-create-checkout',
  templateUrl: './create-checkout.component.html',
  styleUrls: ['./create-checkout.component.css'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgForOf,
        AsyncPipe,
        NgIf
    ],
  standalone: true
})
export class CreateCheckoutComponent {

  @Input() item_id: string | null = null;

  products$: Observable<IProductItem[]> = this.staffProductService.getProducts(0, 50, this.item_id);

  paymentProvidors = ["free", "stripe (wip)", "kassa"];


  formError: string | null = null;

  checkoutForm = this.formBuilder.group(
    {
      "userEmail": [],
      "paymentProvider": [],

      "createUserIfNone": [],
      "sendMail": [],

      "transactions": this.formBuilder.array([])
    }
  )

  constructor(private formBuilder: FormBuilder,
              private staffProductService: StaffProductService) {
  }

  public transactions(): FormArray {
    return this.checkoutForm.controls['transactions'] as FormArray
  }

  public SubmitForm() {
    this.formError = null;
  }

    protected readonly ValidityOptions = ValidityOptions;
}
