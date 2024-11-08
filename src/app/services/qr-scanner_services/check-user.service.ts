import { Injectable } from '@angular/core';
import {apiEnviroment} from '@ingenium/environments/environment';
import {CapacitorHttp} from "@capacitor/core";
import {Store} from "@ngxs/store";
import {UserState} from "@ingenium/app/core/store";

@Injectable({
  providedIn: 'root'
})
export class CheckUserService {
  private returnMsg: string | any = "startMsg"

  constructor(private store: Store,) {
  }

  async checkUser(userEmail: string) {

    try {
      const options = {
        url: apiEnviroment.apiUrl + "user?limit=50&offset=0&user=" + userEmail.replace("@", "%40"),
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`}
      }
      const response = await CapacitorHttp.get(options);

      if (response.status === 200) {
        let responseDict: any = {}
        let jsonResponse = await response.data
        responseDict["lid"] = jsonResponse[0]["roles"]["is_lid"]
        responseDict["uuid"] = jsonResponse[0]["user_uuid"]
        this.returnMsg = responseDict
      } else if (response.status === 404) {
        this.returnMsg = "user_not_found"
      }

    } catch (error) {
      console.log(error)
      this.returnMsg = "server_error"
    }

    return this.returnMsg

  }
}
