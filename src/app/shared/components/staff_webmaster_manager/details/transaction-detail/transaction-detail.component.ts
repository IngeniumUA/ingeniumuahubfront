import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StaffTransactionI} from "../../../../models/staff/staff_transaction";
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ValidityOptions} from "../../../../models/items/validity";
import {StatusOptions} from "../../../../models/items/status";

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
  loading: boolean = false

  transactionForm!: FormGroup;

  constructor(private fb: FormBuilder) {
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
    this.formError = "Not implemented";
    this.loading = false;
  }

  public ResendEmail() {
    this.loading = true;
    this.formError = "Not implemented";
    this.loading = false
  }

  public PartialRefund() {
    this.formError = "Not anytime soon bro";
  }

  protected readonly ValidityOptions = ValidityOptions;
  protected readonly StatusOptions = StatusOptions;
}
