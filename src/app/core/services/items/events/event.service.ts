import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, of} from "rxjs";
import {EventItemI} from "../../../../shared/models/items/events";
import {IItem} from "../../../../shared/models/items/IItem";
import {apiEnviroment} from "../../../../../enviroments";


const TESTevent = {
  item: {
    id: "test_item_id",
    date_created: "string",
    name: "Deme Pitchavond",
    is_active: true,
  },
  start_date: "1970-01-01 00:00:00",
  end_date: "",
  location: "",
  image_landscape: "assets/images/PitchDEME.png",
  image_square: "",
  description: "",

  button_text: "",
  main_color: "07919055",
  text_color: "",
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  public getEvents(): Observable<EventItemI[]> {
    return this.httpClient.get<EventItemI[]>(apiEnviroment.apiUrl + "api/items/events")
  }

  public getEvent(eventId: string): Observable<EventItemI> {
    return of(TESTevent)
    // return this.httpClient.get<EventItemI>(apiEnviroment.apiUrl + "api/items/event/" + eventId)
  }
}
