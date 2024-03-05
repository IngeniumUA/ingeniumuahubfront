import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StaffTransactionI, StaffTransactionPatchI} from "../../../../models/staff/staff_transaction";
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors} from "@angular/forms";
import {ValidityOptions} from "../../../../models/items/validity";
import {StatusOptions} from "../../../../models/items/status";
import {HttpErrorResponse} from "@angular/common/http";
import {StaffTransactionService} from "../../../../../core/services/staff/staff-transaction.service";

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css'],
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
  @Input() transaction!: StaffTransactionI
  @Output() PatchedTransaction = new EventEmitter<boolean>()

  formError: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false

  transactionForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private transactionService: StaffTransactionService) {
  }

  ngOnInit() {
    this.transactionForm = this.fb.group({
      'userEmail': [this.transaction.interaction.user_email],
      'validity': [this.transaction.validity],
      'status': [this.transaction.status],
    })
  }

  public Patch() {
    this.loading = true;
    this.formError = null;
    this.successMessage = null

    if (this.transactionForm.invalid) {
      if (this.transactionForm.errors !== null) {
          this.handleError(this.transactionForm.errors);
      }
      this.handleError(Error("Invalid form ( but no .errors ? )"))
    }

    const validityControlValue = this.transactionForm.controls['validity'].value;
    const userControlValue = this.transactionForm.controls['userEmail'].value;

    // Only add value to patch object if it is different from input
    const patchValidity = validityControlValue !== this.transaction.validity ? validityControlValue : null;
    const patchUserEmail = userControlValue !== this.transaction.interaction.user_email ? userControlValue : null;

    const patchObject: StaffTransactionPatchI = {
        validity: patchValidity,
        user: patchUserEmail,
        user_id: null
    }

    if (patchObject.validity === null && patchObject.user === null && patchObject.user_id === null) {
      this.successMessage = "Geen verandering!"
      this.loading = false
      return
    }

    this.transactionService.patchTransaction(this.transaction.interaction.id, patchObject, true).subscribe(
        (transaction: StaffTransactionI) => {
          this.transaction = transaction
          this.successMessage = "Transaction Patched!"
        },
        (err: Error) => {
          this.handleError(err)
        }
    )

    this.loading = false;
  }

    public SendEmail() {
        this.successMessage = null;
        this.formError = null;

        this.loading = true;
        this.transactionService.emailTransaction(this.transaction.interaction.id).subscribe(
            (succes) => {
                if (succes) {
                    this.successMessage = "Email sent!"
                } else {
                    this.formError = "Email not sent :§"
                }
            },
            (error) => {
                this.handleError(error)
            }
        )
        this.loading = false;
    }

    public handleError(error: Error | ValidationErrors, formError: boolean = false) {
        this.successMessage = null;
        if (error instanceof HttpErrorResponse) {
            this.formError = error.message
        }
        if (formError) {
          const validationErrors = error as ValidationErrors;
          this.formError = validationErrors.toString()
        }
    }

  public PartialRefund() {
    this.formError = "Not anytime soon bro";
  }

  protected readonly ValidityOptions = ValidityOptions;
  protected readonly StatusOptions = StatusOptions;
}
