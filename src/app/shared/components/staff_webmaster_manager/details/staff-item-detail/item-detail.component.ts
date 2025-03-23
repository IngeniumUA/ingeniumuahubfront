import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe, JsonPipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {DisplayMixinDetailComponent} from '../display-mixin-detail/display-mixin-detail.component';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ValidURLCharacters} from '../../../../validators/ValidUrlCharacters';
import {ItemWideI} from "@ingenium/app/shared/models/item/itemwideI";
import {DisplayCompositionI} from "@ingenium/app/shared/models/item/displayCompositionI";
import {EventItemI, isEventItem} from '@ingenium/app/shared/models/item/eventI';
import {
  AsCardItemWide,
  AsEventItemWide, AsNotificationItemWide,
  AsPromoItemWide,
  AsShopItemWide
} from "@ingenium/app/shared/pipes/item/itemWidePipes";
import {RouterLink} from "@angular/router";
import {CardMembershipEnum, CardTypeEnum} from "@ingenium/app/shared/models/item/cardI";
import {
  InteractionTableComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/tables/interaction/interaction-table.component";
import {
  AvailabilityMixinDetailComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/details/availability-mixin-detail/availability-mixin-detail.component";
import {AvailabilityCompositionI} from "@ingenium/app/shared/models/item/availabilityCompositionI";
import { isNotificationItem } from '@ingenium/app/shared/models/item/hubNotificationItemI';
import {PromoItemTypeEnum} from "@ingenium/app/shared/models/item/promoI";

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  imports: [
    NgIf,
    DisplayMixinDetailComponent,
    NgStyle,
    DatePipe,
    NgForOf,
    ReactiveFormsModule,
    MatInputModule,
    AsCardItemWide,
    RouterLink,
    InteractionTableComponent,
    AvailabilityMixinDetailComponent,
    AsShopItemWide,
    AsPromoItemWide,
    AsEventItemWide,
    AsNotificationItemWide,
    JsonPipe
  ],
  standalone: true,
  providers: [DatePipe]
})
export class ItemDetailComponent implements OnInit{

  @Input() item!: ItemWideI;
  @Input() editing: boolean = false;
  @Output() itemUpdate = new EventEmitter<ItemWideI>;

  isEventItem: boolean = false;
  isShopItem: boolean = false;
  isPromoItem: boolean = false;
  isCardItem: boolean = false;
  isLinkItem: boolean = false;
  isNotificationItem: boolean = false;

  form_error: string | null = null;
  loading: boolean = false;
  itemForm: any;

  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe) {
  }
  ngOnInit() {
    this.isEventItem = this.item.derived_type.derived_type_enum === "eventitem"
    this.isShopItem = this.item.derived_type.derived_type_enum === "shopitem";
    this.isPromoItem = this.item.derived_type.derived_type_enum === "promoitem" && "display" in this.item.derived_type;
    this.isCardItem = this.item.derived_type.derived_type_enum === "carditem";
    this.isLinkItem = this.item.derived_type.derived_type_enum === "linkitem";
    this.isNotificationItem = this.item.derived_type.derived_type_enum === "notificationitem";

    // Setting up form
    this.itemForm = this.formBuilder.group({
      name: [this.item.item.name, [Validators.required, ValidURLCharacters()]],
      description: [this.item.item.description],
      connected_account_id: [this.item.item.item_metadata.payment_configuration.stripe_payment_configuration.connected_account_id]
    });
    // Adding event if required
    if (isEventItem(this.item.derived_type)) {
      this.itemForm.addControl('start_date', new FormControl(
        this.datePipe.transform(this.item.derived_type.event_start, 'yyyy-MM-ddThh:mm')));
      this.itemForm.addControl('end_date', new FormControl(
        this.datePipe.transform(this.item.derived_type.event_end, 'yyyy-MM-ddThh:mm')));
    }

    if (isNotificationItem(this.item.derived_type)) {
      this.itemForm.addControl('default_subscription', new FormControl(this.item.derived_type.default_subscription))
    }
    // Promo
    // if (this.isPromoItem) {
    //
    // }
  }

  onSubmit(): void {
    // Check if valid guardclause
    if (this.itemForm.invalid) {
      const error: Error = Error('Form error');
      this.handleFormError(error);
      return;  }

    this.loading = true;

    // The underlying components always send updated information in their fields up to the parent
    // When we send the formdata to the parent here, alle data is as seen on the page

    // This manually assigning all fields is not great code
    // So, to be changed later
    this.item.item.name = this.itemForm.controls['name'].value;
    this.item.item.description = this.itemForm.controls['description'].value;

    // Special case - checking for stripe account field
    const connectedAccountControlValue = this.itemForm.controls['connected_account_id'].value;
    if (connectedAccountControlValue !== null && connectedAccountControlValue !== "") {
      this.item.item.item_metadata.payment_configuration.stripe_payment_configuration.connected_account_id = connectedAccountControlValue;
    } else {
      this.item.item.item_metadata.payment_configuration.stripe_payment_configuration.connected_account_id = null
    }

    // Special case for eventitem
    if (this.isEventItem) {
      if ("display" in this.item.derived_type) {
        this.item.derived_type = {
          derived_type_enum: 'eventitem',
          display: this.item.derived_type.display,
          event_start: this.itemForm.controls['start_date'].value,
          event_end: this.itemForm.controls['end_date'].value,
          event_metadata: (this.item.derived_type as EventItemI).event_metadata
        };
      }
    }
    if (this.isNotificationItem) {
      if ("notification_topic" in this.item.derived_type) {
        this.item.derived_type = {
          derived_type_enum: 'notificationitem',
          notification_topic: this.item.derived_type.notification_topic,
          default_subscription: this.itemForm.controls['default_subscription'].value,
          notification_template: this.item.derived_type.notification_template
        }
      }
    }
    // if (this.isPromoItem) {
    //   this.item.promo_item.display_from_date = this.itemForm.controls['displayFromDate'].value;
    //   this.item.promo_item.display_until_date = this.itemForm.controls['displayUntilDate'].value;
    // }
    this.itemUpdate.emit(this.item);

    this.loading = false;
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

  UpdateDisplayMixin(displaymixin_obj: DisplayCompositionI, derived_type: number) {
    // Derived
    // 0: Event
    // 1: Shop
    // 2: Promo
    if ("display" in this.item.derived_type) {
      if (derived_type === 0) {
        this.item.derived_type.display = displaymixin_obj;
      }
      if (derived_type === 1) {
        this.item.derived_type.display = displaymixin_obj;
      }
      if (derived_type === 2) {
        this.item.derived_type.display = displaymixin_obj;
      }
    }
  }
  UpdateAvailability(availabilityObj: AvailabilityCompositionI): void {
    this.item.item.availability = availabilityObj;
  }

  protected readonly CardTypeEnum = CardTypeEnum;
  protected readonly CardMembershipEnum = CardMembershipEnum;
  protected readonly PromoItemTypeEnum = PromoItemTypeEnum;
}
