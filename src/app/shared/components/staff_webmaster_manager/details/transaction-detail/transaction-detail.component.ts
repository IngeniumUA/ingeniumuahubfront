import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {IProductItem} from '../../../../models/items/products/products';
import {TransactionI} from "@ingenium/app/shared/models/transaction/transactionModels";
import {TransactionService} from "@ingenium/app/core/services/coreAPI/transaction/transaction.service";
import {StaffProductBlueprintService} from "@ingenium/app/core/services/staff/staff-productblueprint-service";
import {ValidityEnum, ValidityList} from "@ingenium/app/shared/models/transaction/validityEnum";
import {PaymentStatusEnum, PaymentStatusList} from "@ingenium/app/shared/models/payment/statusEnum";
import {removeNull} from "@ingenium/app/core/services/serviceUtils";

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
  imports: [
    NgForOf,
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    NgIf,
    NgStyle
  ],
  standalone: true
})
export class TransactionDetailComponent implements OnInit {
  @Input() transaction!: TransactionI;
  @Output() PatchedTransaction = new EventEmitter<boolean>();

  formError: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;
  products$: Observable<IProductItem[]> = of();

  transactionForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private transactionService: TransactionService,
              private blueprintService: StaffProductBlueprintService) {
  }

  ngOnInit() {
    this.products$ = this.blueprintService.getProducts(0, 50, this.transaction.interaction.item_id);
    this.transactionForm = this.fb.group({
      'userEmailControl': [this.transaction.interaction.user_email],
      'validityControl': [this.transaction.validity],
      'statusControl': [{value: this.transaction.transaction_status, disabled: !this.forceEnabled()}],
      'productControl': [this.transaction.purchased_product],
      'noteControl': [this.transaction.note],
      'forcePatchControl': [false]
    });
  }
  public Patch() {
    this.loading = true;
    this.formError = null;
    this.successMessage = null;

    if (this.transactionForm.invalid) {
      if (this.transactionForm.errors !== null) {
        this.handleError(this.transactionForm.errors);
      }
      this.handleError(Error('Invalid form ( but no .errors ? )'));
    }

    const validityControlValue = this.transactionForm.controls['validityControl'].value;
    const userControlValue = this.transactionForm.controls['userEmailControl'].value;
    //const statusControlValue = this.transactionForm.controls['statusControl'].value;
    // const productControlValue = this.transactionForm.controls['productControl'].value;
    // const pricePolicyControlValue

    // Only add value to patch object if it is different from input
    const patchValidity = validityControlValue !== this.transaction.validity ? validityControlValue : null;
    const patchUserValue = userControlValue !== this.transaction.interaction.user_email ? userControlValue : null;


    const interactionPatch = patchUserValue ? {'user': patchUserValue} : null;
    const patchObject: {[key: string] : any}  = {
      validity: patchValidity,
      interaction: interactionPatch
    };

    const patchObjectFiltered = removeNull(patchObject)

    // Quick check for none ( more space efficient on DB )
    const noteControlValue = this.transactionForm.controls['noteControl'].value;
    const noteValue = noteControlValue === '' ? null: noteControlValue;
    const patchNote = noteValue !== this.transaction.note;
    if (patchNote) {
      patchObjectFiltered['note'] = noteValue
    }

    if (patchValidity === null && patchUserValue === null && patchUserValue === this.transaction.note) {
      this.successMessage = 'Geen verandering!';
      this.loading = false;
      return;
    }

    const forcePatchValue: boolean = this.transactionForm.controls['forcePatchControl'].value;

    this.transactionService.patchTransaction(this.transaction.interaction.interaction_id, patchObjectFiltered, forcePatchValue).subscribe(
      (transaction: TransactionI) => {
        this.transaction = transaction;
        this.successMessage = 'Transaction Patched!';
        this.PatchedTransaction.emit(true);
      },
      (err: Error) => {
        this.handleError(err);
      }
    );

    this.loading = false;
  }

  public SendEmail() {
    this.successMessage = null;
    this.formError = null;

    this.loading = true;
    this.transactionService.emailTransaction(this.transaction.interaction.interaction_id).subscribe(
      (succes) => {
        if (succes) {
          this.successMessage = 'Email sent!';
        } else {
          this.formError = 'Email not sent :§';
        }
      },
      (error) => {
        this.handleError(error);
      }
    );
    this.loading = false;
  }

  public handleError(error: Error | ValidationErrors, formError: boolean = false) {
    this.successMessage = null;
    if (error instanceof HttpErrorResponse) {
      this.formError = error.message;
    }
    if (formError) {
      const validationErrors = error as ValidationErrors;
      this.formError = validationErrors.toString();
    }
  }

  public PartialRefund() {
    this.formError = 'Not anytime soon bro';
  }

  public forceEnabled(): boolean {
    if (this.transactionForm === undefined) {
      return false;
    }
    return this.transactionForm.controls['forcePatchControl'].value;
  }

  protected readonly ValidityList = ValidityList;
  protected readonly ValidityEnum = ValidityEnum;
  protected readonly PaymentStatusList = PaymentStatusList;
  protected readonly PaymentStatusEnum = PaymentStatusEnum;
}
