import { Injectable } from '@angular/core';
import {StorageService} from "./storage.service";
import {eventDict} from "@app_services/qr-scanner_services/get-events.service";

@Injectable({
  providedIn: 'root'
})
export class PricesService {

  constructor(private storage: StorageService) {
    this.setupPrices()
    this.storage.get("prices")?.then((result: any) => {
      if (result !== undefined) {
        PriceDict = result;
      }
    });
  }

  public setupPrices() {
    let uuids: any = Object.values(eventDict)

    let PriceDictKeys = Object.keys(PriceDict)
    for (let id of uuids) {
      if (!PriceDictKeys.includes(id)) {
        PriceDict[id] = -1
        let storageDict: any = {}
        storageDict[id] = -1
        this.storage.set("prices", storageDict)
      }
    }
  }

}

export let PriceDict: any = {}
