import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, of} from "rxjs";
import {EventItemDetailI} from "../../../../shared/models/items/events";
import {IItem} from "../../../../shared/models/items/IItem";
import {apiEnviroment} from "../../../../../enviroments";


const TESTevent = {
  item: {
    uuid: "test_item_id",
    date_created: "string",
    name: "Deme Pitchavond",
    description: "test_deme_pitch",
  },
  start_date: "1970-01-01 00:00:00",
  end_date: "",
  follow_through_link: "",
  location: "",
  image_landscape: "assets/images/PitchDEME.png",
  image_square: "",
  color: "000000000"
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  public getEvents(): Observable<EventItemDetailI[]> {
    return this.httpClient.get<EventItemDetailI[]>(apiEnviroment.apiUrl + "api/items/events")
  }

  public getEvent(eventId: string): Observable<EventItemDetailI> {
    return of(TESTevent)
    // return this.httpClient.get<EventItemI>(apiEnviroment.apiUrl + "api/items/event/" + eventId)
  }
}
