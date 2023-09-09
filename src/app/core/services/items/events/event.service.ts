import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {EventItemI} from "../../../../shared/models/items/events";
import {apiEnviroment} from "../../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  public getEvents(): Observable<EventItemI[]> {
    return this.httpClient.get<EventItemI[]>(apiEnviroment.apiUrl + "api/items/events")
  }

  public getEvent(eventId: string): Observable<EventItemI> {
    return this.httpClient.get<EventItemI>(apiEnviroment.apiUrl + "api/items/event/" + eventId)
  }
}
