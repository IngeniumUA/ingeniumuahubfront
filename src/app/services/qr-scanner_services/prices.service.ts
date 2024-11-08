import { Injectable } from '@angular/core';
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class PricesService {

  constructor(private storage: StorageService) {
    this.storage.get("prices")?.then((result: any) => {
      if (result !== undefined) {
        PriceDict = result;
      }
    });
  }

}

export let PriceDict: any = {}
