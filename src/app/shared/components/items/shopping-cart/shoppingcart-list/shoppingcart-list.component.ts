import {Component, OnInit} from '@angular/core';
import {AsyncPipe, KeyValuePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {
  ProductOutI,
  PaymentProviderEnum,
  ProductMetaI
} from '@ingenium/app/shared/models/product/products';
import {Router, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ItemLimitedI} from "@ingenium/app/shared/models/item/itemI";
import {Observable} from "rxjs";
import {Store} from "@ngxs/store";
import {CartActions, CartState, UserState} from "@ingenium/app/core/store";
import {map} from "rxjs/operators";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CartFailedI, FailedProductI} from "@ingenium/app/shared/models/cart/cartI";
import {apiEnviroment} from "@ingenium/environments/environment";

@Component({
  selector: 'app-shoppingcart-list',
  templateUrl: './shoppingcart-list.component.html',
  styleUrls: ['./shoppingcart-list.component.scss'],
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    AsyncPipe,
    ReactiveFormsModule,
    FormsModule,
    KeyValuePipe,
    NgClass,
  ],
  standalone: true
})
export class ShoppingcartListComponent implements OnInit {
  products$: Observable<ProductOutI[]> = this.store.select(CartState.getProducts);
  failedCart$: Observable<null|CartFailedI> = this.store.select(CartState.getFailedCart);
  totalPrice$: Observable<number> = this.store.select(CartState.getTotalPrice);
  allowStaffCheckout$ = this.store.select(UserState.roles).pipe(map(roles => roles && roles?.includes('manager')));
  isAuth$ = this.store.select(UserState.isAuthenticated);

  items: ItemLimitedI[] = [];
  paymentErrors: HttpErrorResponse[] = [];
  captchaError = true;
  captchaMessage = "Je bent niet aangemeld, daarom moet je verplicht een CAPTCHA uitvoeren.";

  checkoutForm: FormGroup = new FormGroup({});

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    if (!this.store.selectSnapshot(UserState.isAuthenticated)) {
      this.loadCloudFlareTurnstile();  // Only load when user is not authenticated
    }

    // Temporary, should be moved elsewhere
    if (this.store.selectSnapshot(UserState.roles)?.includes('manager')) {
      this.store.dispatch(new CartActions.SetPaymentMethod(PaymentProviderEnum.Kassa));
    }

    // Set email validator field
    this.checkoutForm = new FormGroup({
      guestEmailField: new FormControl(this.store.selectSnapshot(CartState.getGuestEmail), [
        Validators.email,
        Validators.required,
      ]),
      checkoutNote: new FormControl(this.store.selectSnapshot(CartState.getCheckoutNote), [
        Validators.maxLength(100),
      ])
    });
  }

  removeProductFromCart(index: number) {
    this.store.dispatch(new CartActions.RemoveFromCart(index));
  }

  onStaffCheckoutClicked(event: Event) {
    // If checked then set the payment method to 'staff'
    if ((event.target as HTMLInputElement).checked) {
      this.store.dispatch(new CartActions.SetPaymentMethod(PaymentProviderEnum.Kassa));
    } else {
      this.store.dispatch(new CartActions.SetPaymentMethod(PaymentProviderEnum.Stripe));
    }
  }

  onNoteAreaChanged(event: Event) {
    const note = (event.target as HTMLInputElement).value;
    this.store.dispatch(new CartActions.SetCheckoutNote(note));
  }

  onEmailAreaChanged(event: Event) {
    const email = (event.target as HTMLInputElement).value;
    this.store.dispatch(new CartActions.SetEmail(email));
  }

  onExtraFormChanged(event: Event, product: ProductOutI, form_data_key: any) {
    form_data_key = form_data_key as string
    const form_data_value = (event.target as HTMLInputElement).value

    let meta_data: any = JSON.stringify(product.product_meta.other_meta_data)
    meta_data = JSON.parse(meta_data)  // janky as fuck but needed to get around read only
    const form = JSON.parse(meta_data["form"])
    form[form_data_key]["value"] = form_data_value

    const updated_meta: ProductMetaI = {
      group: product.product_meta.group,
      categorie: product.product_meta.categorie,
      upon_completion: product.product_meta.upon_completion,
      other_meta_data: {form: JSON.stringify(form)}
    }
    const updated_product: ProductOutI = {
      id: product.id,
      name: product.name,
      description: product.description,
      ordering: product.ordering,
      blueprint_id: product.blueprint_id,
      origin_item_id: product.origin_item_id,
      date_generated: product.date_generated,
      price_policy: product.price_policy,
      note: product.note,
      max_count: product.max_count,
      product_meta: updated_meta,
      allow_individualised: product.allow_individualised
    }
    this.store.dispatch(new CartActions.ReduceProductQuantity(product));
    this.store.dispatch(new CartActions.AddToCart(updated_product));
  }

  hasFailedProduct(product: ProductOutI, failedProducts: FailedProductI[]|undefined) {
    if (!failedProducts) {
      return undefined;
    }

    // Check if the product is in the failed products list and if so return the failed product
    return failedProducts.find(failedProduct => {
      return product.id === failedProduct.product.id && product.price_policy.id === failedProduct.product.price_policy.id;
    });
  }

  loadCloudFlareTurnstile() {
    // Load the script
    const scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';

    scriptElement.onload = () => {
      // @ts-expect-error too lazy to fix these types
      const turnstile = window.turnstile;

      turnstile.render('#turnstile-container', {
        sitekey: apiEnviroment.turnstileSiteKey,
        size: 'flexible',
        theme: 'light',
        lang: 'nl',
        callback: (token: string) => {
          this.captchaError = false;
          this.store.dispatch(new CartActions.SetCaptchaToken(token));
        },
        errorCallback: () => {
          this.store.dispatch(new CartActions.SetCaptchaToken(null));
          this.captchaMessage = "Oeps, er ging iets mis met de CAPTCHA.";
          this.captchaError = true;
        },
        expiredCallback: () => {
          this.store.dispatch(new CartActions.SetCaptchaToken(null));
          this.captchaError = true;
          this.captchaMessage = "De CAPTCHA is verlopen, probeer het opnieuw.";
        },
      });
    };
    scriptElement.onerror = (_) => {
      this.captchaMessage = "De CAPTCHA kon niet worden geladen, probeer het opnieuw.";
    };

    document.getElementsByTagName('body')[0].appendChild(scriptElement);
  }

  goToPayment() {
    if (this.store.selectSnapshot(UserState.isAuthenticated)) {
      this.router.navigateByUrl('/shop/pay');
      return;
    }

    // Check if we have a captcha token and email
    if (!this.store.selectSnapshot(CartState.getCaptchaToken) || !this.store.selectSnapshot(CartState.getGuestEmail)) {
      alert("Vul jouw e-mailadres in en/of voer de CAPTCHA uit.");
      return;
    }

    this.router.navigateByUrl('/shop/pay');
  }

  protected readonly JSON = JSON;
  protected readonly Object = Object;
}
