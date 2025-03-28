import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {Observable, of} from 'rxjs';
import {ProductOutI, PaymentProviderEnum} from '../../../../models/product/products';
import {HttpErrorResponse} from '@angular/common/http';
import {TransactionInI} from "@ingenium/app/shared/models/payment/transaction/hubTransactionI";
import {CheckoutInI} from "@ingenium/app/shared/models/payment/checkout/hubCheckoutI";
import {ValidityEnum, ValidityList} from "@ingenium/app/shared/models/payment/transaction/validityEnum";
import {CheckoutService} from "@ingenium/app/core/services/coreAPI/payment/checkout.service";
import {ProductBlueprintService} from "@ingenium/app/core/services/coreAPI/blueprint/productBlueprint.service";
import {ToastrService} from "ngx-toastr";


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
    NgStyle,
    KeyValuePipe
  ],
  standalone: true
})
export class CreateCheckoutComponent implements OnInit {

  @Input() item_id: number | null = null;
  @Output() checkoutCreated = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder,
              private productBlueprintService: ProductBlueprintService,
              private checkoutService: CheckoutService,
              private toastrService: ToastrService,) {
  }

  loading = false;
  userNotInAPI = false;

  products$: Observable<ProductOutI[]> = of();

  paymentProviders = [
    PaymentProviderEnum.Free,
    PaymentProviderEnum.Kassa
  ];

  formError: string | null = null;
  successMessage: string | null = null;

  checkoutForm = this.formBuilder.group(
    {
      'userEmailControl': ['', [Validators.required]],
      'paymentProvider': [Validators.required],

      'forceCreateControl': [false,Validators.required],
      'createUserIfNoneControl': [false], // TODO disabled: !this.userNotInAPI}
      'sendMailControl': [false],

      'transactions': this.formBuilder.array([])
    }
  );

  ngOnInit() {
    // TODO if is debug
    this.paymentProviders.push(PaymentProviderEnum.Dev)

    this.products$ = this.productBlueprintService.queryProducts(0, 50, this.item_id);
    this.checkoutForm.controls['forceCreateControl'].valueChanges.subscribe((forceCreateValue) => {
      this.transactions().controls.forEach((abstract) => {
        const groupControl = abstract as FormGroup;
        if (forceCreateValue) {
          groupControl.controls['validityControl'].enable();
        } else {
          groupControl.controls['validityControl'].disable();
        }
      });
    });
  }

  public transactions(): FormArray {
    return this.checkoutForm.controls['transactions'] as FormArray;
  }

  public forceEnabled(): boolean {
    return this.checkoutForm.controls['forceCreateControl'].value!;
  }

  public RemoveTransaction(index: number) {
    this.transactions().removeAt(index);
  }

  public AddTransaction() {
    const validityDefault = this.forceEnabled() ? null: 'Kies Validity'; // Validity 2 is invalid
    const transactionGroup = this.formBuilder.group({
      'productControl': ['Kies Product', Validators.required],
      'validityControl': [{value: validityDefault, disabled: !this.forceEnabled()}]
    });
    transactionGroup.controls['productControl'].valueChanges.subscribe(() => {
    })
    this.transactions().push(transactionGroup);
  }

  public SubmitForm() {
    this.formError = null;
    if (this.checkoutForm.invalid) {
      if (this.checkoutForm.errors !== null) {
        this.handleError(this.checkoutForm.errors, true);
      } else {
        this.handleError(Error('Invalid form error ( without validation errors )'));
      }
    }

    // Parsing create params
    const forceCreateValue = this.checkoutForm.controls['forceCreateControl'].value;
    const sendMailValue = this.checkoutForm.controls['sendMailControl'].value;
    const createMissingUserValue = this.checkoutForm.controls['createUserIfNoneControl'].value;

    const forceCreate = forceCreateValue === null ? false : forceCreateValue;
    const sendMail = sendMailValue === null ? false : sendMailValue;
    const createMissingUser = createMissingUserValue === null ? false : createMissingUserValue;

    // Parsing create data
    const userValue = this.checkoutForm.controls['userEmailControl'].value;
    const paymentProvidorValue = this.checkoutForm.controls['paymentProvider'].value;
    if (userValue === null || paymentProvidorValue === null) {
      this.handleError(Error('userValue or paymentProvider is null')); return; } // Fast return ( should not happen )

    const transactions = this.parseTransactionFormArray(userValue);

    const checkoutObj: CheckoutInI = {
      user_email: userValue,
      payment_provider: paymentProvidorValue,
      transactions: transactions,
      note: null
    };

    this.loading = true;
    this.checkoutService.postCheckout(checkoutObj, forceCreate, sendMail, createMissingUser).subscribe(
      () => {
        this.loading = false;
        this.checkoutCreated.emit(true);
        this.toastrService.success("Checkout created")
      },
      (err: Error) => {
        this.loading = false;
        this.handleError(err);
      }
    );
  }

  public handleError(error: Error | ValidationErrors, isFormError: boolean = false) {
    this.toastrService.error(error.message);
    if (error instanceof HttpErrorResponse) {
      if (error.status == 404) {
        if (!this.userNotInAPI) {
          this.userNotInAPI = true;
        }
      }
    }
    if (isFormError) {
      const errorV = error as ValidationErrors;
      this.formError = errorV.toString();
    }
    this.formError = error.message;
  }

  GetControl(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  parseTransactionFormArray(userValue: string): TransactionInI[] {
    const transactionArray = this.transactions();
    const abstractControls = transactionArray.controls;
    const formGroups = abstractControls.map((abstactControl) => {
      return this.GetControl(abstactControl);
    });
    return formGroups.map((formGroup) => {
      return this.parseTransactionFormGroup(userValue, formGroup);
    });
  }

  parseTransactionFormGroup(userValue: string, formGroup: FormGroup): TransactionInI {
    const productControl: ProductOutI = formGroup.controls['productControl'].value;
    const validityControl: number = formGroup.controls['validityControl'].value;
    return {
      user_email: userValue,
      item_id: this.item_id!,
      product_blueprint_id: productControl.blueprint_id,
      price_policy_id: productControl.price_policy.id,
      validity: validityControl,
      status: 1
    };
  }

  protected readonly PaymentProviderEnum = PaymentProviderEnum;
  protected readonly ValidityList = ValidityList;
  protected readonly ValidityEnum = ValidityEnum;
}
