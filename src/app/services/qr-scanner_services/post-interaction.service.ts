import {Injectable} from '@angular/core';
import {apiEnviroment} from "@ingenium/environments/environment";
import {UserState} from "@ingenium/app/core/store";
import {CapacitorHttp} from "@capacitor/core";
import {Store} from "@ngxs/store";

@Injectable({
  providedIn: 'root'
})
export class PostInteractionService {

  userReturnMsg: string = ""
  interactionExistsMsg: boolean | string = ""
  creationReturnMsg: string = ""

  constructor(private store: Store) { }

  async processInteraction(card_uuid:string, event_id: number) {
    let user_uuid = await this.getUserUUIDFromCard(card_uuid)
    if (user_uuid !== "server_error") {
      let interaction_exists = await this.doesInteractionExist(user_uuid, event_id)
      if (typeof interaction_exists === "boolean") {
        if (interaction_exists) {
          return "interaction_exists"
        } else {
          return await this.createInteraction(user_uuid, event_id)
        }
      } else {
        return interaction_exists
      }
    } else {
      return user_uuid
    }
  }

  async getUserUUIDFromCard(card_uuid: string) {

    try {
      const options = {
        url: apiEnviroment.apiUrl + "card/" + card_uuid,
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`}
      }
      const response = await CapacitorHttp.get(options);

      if (response.status === 200) {
        let jsonResponse = await response.data
        this.userReturnMsg = jsonResponse["user_uuid"]
      }

    } catch (error) {
      console.log(error)
      this.userReturnMsg = "server_error"
    }

    return this.userReturnMsg

  }

  async doesInteractionExist(user_uuid: string, event_id: number) {
    const query_params: string = "&user=" + user_uuid + "&item=" + event_id

    try {
      const options = {
        url: apiEnviroment.apiUrl + "interaction?limit=100&offset=0&interaction_type=1201" + query_params,
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`}
      }
      const response = await CapacitorHttp.get(options);

      if (response.status === 200) {
        let jsonResponse = await response.data
        this.interactionExistsMsg = jsonResponse.length !== 0
      }

    } catch (error) {
      console.log(error)
      this.interactionExistsMsg = "server_error"
    }

    return this.interactionExistsMsg

  }

  async createInteraction(user_uuid: string, event_id: number) {
    try {
      const options = {
        url: apiEnviroment.apiUrl + "interaction",
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`, 'Content-Type': "application/json"},
        data: {
          item_id: event_id,
          user_uuid: user_uuid,
          interaction_type: 1201
        },
      }
      const response = await CapacitorHttp.post(options);

      if (response.status === 200) {
        let jsonResponse = await response.data
        this.creationReturnMsg = "success"
      }

    } catch (error) {
      console.log(error)
      this.creationReturnMsg = "server_error"
    }

    return this.creationReturnMsg
  }

}
