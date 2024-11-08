import { Injectable } from '@angular/core';
import {apiEnviroment} from '@ingenium/environments/environment';
import {CapacitorHttp} from "@capacitor/core";
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store";

@Injectable({
  providedIn: 'root'
})
export class TransactionPatcherService {
  private returnMsg: string = "startMsg"
  constructor(private store: Store) { }

  async PatchTransaction(interactionID: number, validity: string = "", user: string = "") {
    let data: any = {}
    if (validity !== "") {
      let validityEnum: number = 1
      if (validity === "forbidden") {validityEnum = 1}
      if (validity === "valid") {validityEnum = 2}
      if (validity === "invalid") {validityEnum = 3}
      if (validity === "manually_verified") {validityEnum = 4}
      if (validity === "consumed") {validityEnum = 5}
      data["validity"] = validityEnum}
    if (user !== "") {data["interaction"] = {"user": user}}

    try {
      const options = {
        url: apiEnviroment.apiUrl + "transaction/" + interactionID.toString(),
        data: data,
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`, 'Content-Type': "application/json"}
      }
      const response = await CapacitorHttp.patch(options);

      if (response.status === 200) {
        console.log("success")
        this.returnMsg = "success"
      } else {
        console.log(response.status)
        console.log(JSON.stringify(response.data))
      }

    } catch (error) {
      console.log(error)
      this.returnMsg = "server_error"
    }

    return this.returnMsg

  }

}
