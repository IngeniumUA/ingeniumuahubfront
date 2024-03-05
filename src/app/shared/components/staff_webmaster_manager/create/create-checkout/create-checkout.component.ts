import {Component, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder, FormControl, FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {AsyncPipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {StaffProductService} from "../../../../../core/services/staff/staff-product.service";
import {Observable, of} from "rxjs";
import {IProductItem} from "../../../../models/items/products/products";
import {ValidityOptions} from "../../../../models/items/validity";
import {HttpErrorResponse} from "@angular/common/http";



@Component({
  selector: 'app-create-checkout',
  templateUrl: './create-checkout.component.html',
  styleUrls: ['./create-checkout.component.scss'],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgForOf,
        AsyncPipe,
        NgIf,
        NgStyle
    ],
  standalone: true
})
export class CreateCheckoutComponent implements OnInit {

  @Input() item_id: string | null = null;
  loading = false
  userNotInAPI = false

  products$: Observable<IProductItem[]> = of()

  paymentProvidors = ["free", "stripe (wip)", "kassa"];


  formError: string | null = null;
  successMessage: string | null = null

  checkoutForm = this.formBuilder.group(
    {
      "userEmailControl": ['', [Validators.required]],
      "paymentProvider": [Validators.required],

      "forceCreateControl": [false,Validators.required],
      "createUserIfNoneControl": [{value: false, disabled: !this.userNotInAPI}],
      "sendMailControl": [false],

      "transactions": this.formBuilder.array([])
    }
  )

    ngOnInit() {
      this.products$ = this.staffProductService.getProducts(0, 50, this.item_id);
      this.checkoutForm.controls['forceCreateControl'].valueChanges.subscribe((forceCreateValue) => {
        this.transactions().controls.forEach((abstract) => {
          const groupControl = abstract as FormGroup;
          if (forceCreateValue) {
              groupControl.controls['validityControl'].enable()
          } else {
              groupControl.controls['validityControl'].disable()
          }
        })
      })
    }

    constructor(private formBuilder: FormBuilder,
              private staffProductService: StaffProductService) {
  }

  public transactions(): FormArray {
    return this.checkoutForm.controls['transactions'] as FormArray
  }

  public forceEnabled(): boolean {
    return this.checkoutForm.controls['forceCreateControl'].value!
  }

  public RemoveTransaction(index: number) {
    this.transactions().removeAt(index)
  }

  public AddTransaction() {
    const validityDefault = this.forceEnabled() ? null: "Kies Validity" // Validity 2 is invalid
    const transactionGroup = this.formBuilder.group({
      "productControl": ["Kies Product", Validators.required],
      "validityControl": [{value: validityDefault, disabled: !this.forceEnabled()}]
    })
    this.transactions().push(transactionGroup);
  }

  public SubmitForm() {
    this.formError = null;
    if (this.checkoutForm.invalid) {
        if (this.checkoutForm.errors !== null) {
            this.handleError(this.checkoutForm.errors, true)
        } else {
            this.handleError(Error("Invalid form error ( without validation errors )"))
        }
    }
  }

  public handleError(error: Error | ValidationErrors, isFormError: boolean = false) {
      if (error instanceof HttpErrorResponse) {
          if (error.status == 404) {
            if (error.message === "User not found" && !this.userNotInAPI) {
              this.userNotInAPI = true
            }
          }
      }
      if (isFormError) {
          const errorV = error as ValidationErrors;
          this.formError = errorV.toString()
      }
      this.formError = error.message
  }

  GetControl(control: AbstractControl): FormGroup {
    return control as FormGroup
  }

    protected readonly ValidityOptions = ValidityOptions;
}
