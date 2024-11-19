import {Component, NgZone, OnInit} from '@angular/core';
import {BarcodeFormat, BarcodeScanner, LensFacing, StartScanOptions} from '@capacitor-mlkit/barcode-scanning';
import {NavController, Platform} from "@ionic/angular";
import {eventDict, GetEventsService, selectedEvent} from "@app_services/qr-scanner_services/get-events.service";
import {PageTrackingService, currentPage, pageTree} from "@app_services/page-tracking.service";
import {PricesService} from "@app_services/qr-scanner_services/prices.service";
import {BlueprintsService} from "@app_services/qr-scanner_services/blueprints.service";


@Component({
  selector: 'app-scan',
  templateUrl: 'scan.page.html',
  styleUrls: ['scan.page.scss']
})

export class ScanPage implements OnInit{
  public platform: Platform;

  //vars for mobile qr code scanning
  public formats: BarcodeFormat[] = [BarcodeFormat.QrCode];
  public lensFacing: LensFacing = LensFacing.Back;
  public options: StartScanOptions = {
    formats: this.formats,
    lensFacing: this.lensFacing,
  };

  public selectedItem = selectedEvent
  public events: any = undefined
  public actualEventSelected: boolean = false

  public showChooseEvent: boolean = true

  constructor(private navCtrl: NavController,
              private readonly ngZone: NgZone,
              platform: Platform,
              private eventSetter: GetEventsService,
              private PageTrackService: PageTrackingService,
              public prices: PricesService,
              public blueprints: BlueprintsService) {
    this.platform = platform;
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (pageTree[pageTree.length-2] === 'login' || !pageTree[pageTree.length-2].includes("tabs") || !(pageTree[pageTree.length-2] === "result") || !(pageTree[pageTree.length-2] === "prices") || !(pageTree[pageTree.length-2] === "blueprints")) {
        this.ReturnToHome()
      } else if (pageTree[pageTree.length-2] === undefined) {
        this.ReturnToHome()
      } else {
        this.PageTrackService.popFromTree()
        this.navCtrl.navigateRoot('/'+currentPage).then()
      }
    });
  }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    document.documentElement.classList.toggle('ion-palette-dark', prefersDark.matches);
    if (prefersDark.matches) {
      document.documentElement.style.setProperty('--ing-ion-color', '#ffffff');
    }
  }

  public ReturnToHome() {
    this.PageTrackService.setTreeToRoot()
    this.navCtrl.navigateRoot('').then()
    this.ionViewDidLeave()
  }

  public ionViewWillEnter() {
    this.startScan().then()
    this.events = Object.keys(eventDict)
    this.selectedItem = selectedEvent
    if (this.selectedItem !== undefined) {this.showChooseEvent = false}
    this.actualEventSelected = !(this.selectedItem === undefined || this.selectedItem === 'Alle evenementen');
  }

  public ionViewDidLeave() {
    this.stopScan().then()
  }

  public async startScan() {
    // if mobile
    if (this.platform.is("hybrid")) {
      if (this.platform.is("android")) {
        if (!await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()) {
          BarcodeScanner.installGoogleBarcodeScannerModule().then()
        }
      }
      await BarcodeScanner.checkPermissions().then(result => {
        if (result.camera != "limited" && result.camera != "granted") {
          BarcodeScanner.requestPermissions()
        }
      })
      // The camera is visible behind the WebView, so that you can customize the UI in the WebView.
      // However, this means that you have to hide all elements that should not be visible.
      // You can find an example in our demo repository.
      // In this case we set a class `barcode-scanner-active`, which then contains certain CSS rules for our app.
      document.querySelector('body')?.classList.add('barcode-scanning-active');
      document.querySelector(':root')?.classList.add('barcode-scanning-active-r');

      // Add the `barcodeScanned` listener
      await BarcodeScanner.addListener(
        'barcodeScanned',
        async result => {
          this.ngZone.run(() => {
            scannedQr = result.barcode.rawValue;
            this.stopScan().then()
            this.PageTrackService.addToTree("result")
            this.navCtrl.navigateRoot('/result').then()
          })
        }
      )

      // Start the barcode scanner
      await BarcodeScanner.startScan(this.options);

    } else { // if web
      return
    }
  };

  public async stopScan() {
    if (this.platform.is("hybrid")) {
      // Make all elements in the WebView visible again
      document.querySelector('body')?.classList.remove('barcode-scanning-active');
      document.querySelector(':root')?.classList.remove('barcode-scanning-active-r');

      // Remove all listeners
      await BarcodeScanner.removeAllListeners();

      // Stop the barcode scanner
      await BarcodeScanner.stopScan();
    }
  };

  public onItemSelection($selection: any) {
    if ( $selection != undefined) {
      this.selectedItem = $selection.detail.value;
      this.eventSetter.setEvent($selection.detail.value)
      this.showChooseEvent = false
      this.actualEventSelected = !(this.selectedItem === undefined || this.selectedItem === 'Alle evenementen');
    }
  }

}

export let scannedQr: string
