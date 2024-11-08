import { Injectable } from '@angular/core';
import {apiEnviroment} from '@ingenium/environments/environment';
import {eventDict, selectedEvent} from "./get-events.service";
import {StorageService} from "./storage.service";
import {CapacitorHttp} from "@capacitor/core";
import {UserState} from "@ingenium/app/core/store";
import {Store} from "@ngxs/store";

@Injectable({
  providedIn: 'root'
})
export class BlueprintsService {
  private returnMsg: string = "startMsg"

  constructor(private storage: StorageService,
              private store: Store,) {
    this.storage.get("blueprints")?.then((result) => {
      if (result !== undefined) {
        blueprintsDict = result
      }
    })
  }

  async getBlueprints(): Promise<string> {

    try {
      const options = {
        url: apiEnviroment.apiUrl + "blueprint?limit=50&offset=0&source_item_id=" + eventDict[selectedEvent],
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`}
      }
      const response = await CapacitorHttp.get(options);

      if (response.status === 200) {
        let jsonResponse = await response.data
        let trueDict: any = {}
        for (let item of jsonResponse) {
          if (blueprintsDict[selectedEvent] === undefined) {
            blueprintsDict[selectedEvent] = {}
          }
          if (blueprintsDict[selectedEvent][item["name"]] === undefined) {
            trueDict[item["name"]] = true
          } else {
            trueDict[item["name"]] = blueprintsDict[selectedEvent][item["name"]]
          }
        }
        blueprintsDict[selectedEvent] = trueDict
        this.returnMsg = "success"
      }

    } catch (error) {
      console.log(error)
      this.returnMsg = "server_error"
    }

    return this.returnMsg

  }

  dictSetter(dict: any, event: string) {
    blueprintsDict[event] = dict
    this.storage.set("blueprints", blueprintsDict)
  }

}

export let blueprintsDict: any = {}
