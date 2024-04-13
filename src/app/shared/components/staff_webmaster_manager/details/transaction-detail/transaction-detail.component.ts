import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StaffTransactionI, StaffTransactionPatchI} from '../../../../models/staff/staff_transaction';
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {ValidityOptions} from '../../../../models/items/validity';
import {StatusOptions} from '../../../../models/items/status';
import {HttpErrorResponse} from '@angular/common/http';
import {StaffTransactionService} from '../../../../../core/services/staff/staff-transaction.service';
import {Observable, of} from 'rxjs';
import {IProductItem} from '../../../../models/items/products/products';
import {StaffProductService} from '../../../../../core/services/staff/staff-product.service';

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
  @Input() transaction!: StaffTransactionI;
  @Output() PatchedTransaction = new EventEmitter<boolean>();

  formError: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;
  products$: Observable<IProductItem[]> = of();

  transactionForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private transactionService: StaffTransactionService,
              private staffProductService: StaffProductService) {
  }

  ngOnInit() {
    this.products$ = this.staffProductService.getProducts(0, 50, this.transaction.interaction.item_id);
    this.transactionForm = this.fb.group({
      'userEmailControl': [this.transaction.interaction.user_email],
      'validityControl': [this.transaction.validity],
      'statusControl': [{value: this.transaction.status, disabled: !this.forceEnabled()}],
      'productControl': [this.transaction.product],
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
    //const noteControlValue = this.transactionForm.controls['noteControl'].value;
    const productControlValue = this.transactionForm.controls['productControl'].value;

    // Quick check for none ( more space efficient on DB )
    //const noteValue = noteControlValue === '' ? null: noteControlValue;

    // Only add value to patch object if it is different from input
    const patchValidity = validityControlValue !== this.transaction.validity ? validityControlValue : null;
    const patchUserEmail = userControlValue !== this.transaction.interaction.user_email ? userControlValue : null;
    const patchProduct = productControlValue !== this.transaction.product ? productControlValue : null;
    //const patchNote = noteValue !== this.transaction.note ? noteValue: null;

    const patchObject: StaffTransactionPatchI = {
      validity: patchValidity,
      user: patchUserEmail,
      user_id: null,
      product: patchProduct
    };

    if (patchObject.validity === null && patchObject.user === null && patchObject.user_id === null &&
        patchObject.product === null) {
      this.successMessage = 'Geen verandering!';
      this.loading = false;
      return;
    }

    this.transactionService.patchTransaction(this.transaction.interaction.id, patchObject, true).subscribe(
      (transaction: StaffTransactionI) => {
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
    this.transactionService.emailTransaction(this.transaction.interaction.id).subscribe(
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

  protected readonly ValidityOptions = ValidityOptions;
  protected readonly StatusOptions = StatusOptions;
}
