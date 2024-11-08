import { Injectable } from '@angular/core';
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class HistoryUpdaterService {
  private historyNumber: number = 0

  constructor(private storage: StorageService) {
    this.init()
  }

  public init() {
    this.storage.get("history")?.then((result: any) => {
      if (result !== undefined) {
        let dict: any = result as {}
        let keys = Object.keys(dict)
        let max = +keys[0]; // initialize to the first value
        for (let i = 0; i < keys.length; i++) {
          this.updateHistory(dict[keys[i]])
          if (+keys[i] > max) {
            max = +keys[i];
          }
        }
        this.historyNumber = max
      }

    })
  }

  public updateHistory(history: [string, string, string, string]) {
    historyList.push(history)
    let storeDict: any = {}
    storeDict[this.historyNumber.toString()] = history
    this.storage.set("history", storeDict)
  }

  public clearHistory() {
    historyList = []
  }

}

export let historyList: any = []
