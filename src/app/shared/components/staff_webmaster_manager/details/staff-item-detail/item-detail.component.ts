import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe, NgIf, NgStyle} from '@angular/common';
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
import {CardMembershipEnum, CardTypeEnum} from "@ingenium/app/shared/models/item/cardI";
import {
  AvailabilityMixinDetailComponent
} from "@ingenium/app/shared/components/staff_webmaster_manager/details/availability-mixin-detail/availability-mixin-detail.component";
import {AvailabilityCompositionI} from "@ingenium/app/shared/models/item/availabilityCompositionI";
import {AppFunctionsService} from "@app_services/app-functions.service";

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  imports: [
    NgIf,
    DisplayMixinDetailComponent,
    NgStyle,
    DatePipe,
    ReactiveFormsModule,
    MatInputModule,
    AsCardItemWide,
    AvailabilityMixinDetailComponent,
    AsShopItemWide,
    AsPromoItemWide,
    AsEventItemWide,
    AsNotificationItemWide
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
              private datePipe: DatePipe,
              private appFunctionsService: AppFunctionsService,) {
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
    });
    // Adding event if required
    if (isEventItem(this.item.derived_type)) {
      this.itemForm.addControl('start_date', new FormControl(
        this.datePipe.transform(this.item.derived_type.event_start, 'yyyy-MM-ddThh:mm')));
      this.itemForm.addControl('end_date', new FormControl(
        this.datePipe.transform(this.item.derived_type.event_end, 'yyyy-MM-ddThh:mm')));
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

  gotoPage(page: string) {this.appFunctionsService.goToPage(page);}

  protected readonly CardTypeEnum = CardTypeEnum;
  protected readonly CardMembershipEnum = CardMembershipEnum;
}
