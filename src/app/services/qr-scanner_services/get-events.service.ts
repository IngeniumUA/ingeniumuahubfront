import {Injectable} from '@angular/core';
import {apiEnviroment} from '@ingenium/environments/environment';
import {CapacitorHttp} from "@capacitor/core";
import {UserState} from "@ingenium/app/core/store";
import {Store} from "@ngxs/store";

@Injectable({
  providedIn: 'root'
})
export class GetEventsService {
  constructor(private store: Store,) { }
  private returnMsg: string = "startMsg"

  async getEvents() {
    let currentDate: Date = new Date(Date.now())

    let day: number = currentDate.getDate() - 1
    let month: number = currentDate.getMonth() + 1
    let year: number = currentDate.getFullYear()
    const monthDayArr: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (day === 0) {
      month = month - 1
      day = monthDayArr[month-1]
    }
    if (month === 0) {
      month = 12
      year = year - 1
    }

    const yearMonthDayString: string = year.toString()+"-"+('00'+month.toString()).slice(-2)+"-"+('00'+day.toString()).slice(-2)
    const dateString: string = "&event_end_ge=" + yearMonthDayString

    try {
      const options = {
        url: apiEnviroment.apiUrl + "item/event/?limit=50&offset=0" + dateString,
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`}
      }
      const response = await CapacitorHttp.get(options)

      if (response.status === 200) {
        let returnDict: any = {}
        let jsonResponse = await response.data
        for (let event of jsonResponse) {
          if (event["derived_type"]["derived_type_enum"] == "eventitem") {
            returnDict[event["item"]["name"]] = "" + event["item"]["id"]
          }
        }
        returnDict['Alle evenementen'] = "alle"
        eventDict = returnDict;
        this.returnMsg = "success"
      } else {this.returnMsg = response.status.toString()}

    } catch (error) {
      console.log(error)
      this.returnMsg = "server_error"
    }

    return this.returnMsg

  }

  async getEventStats(itemId: number): Promise<string> {
    const requestString: string = "?&validity=5&item=" + itemId  // 5 is consumed in the enum

    try {
      const options = {
        url: apiEnviroment.apiUrl + "transaction/group_by" + requestString,
        headers: {Authorization: `Bearer ${this.store.selectSnapshot(UserState.token)}`}
      }
      const response = await CapacitorHttp.get(options)

      if (response.status === 200) {
        let jsonResponse = await response.data
        this.returnMsg = jsonResponse["1"] as string  // 1 is successful in the enum
      }

    } catch (error) {
      console.log(error)
      this.returnMsg = "server_error"
    }

    return this.returnMsg

  }

  public setEvent(event: string) {
    selectedEvent = event
  }

}

export let eventDict: any = {};
export let selectedEvent: any = undefined;
