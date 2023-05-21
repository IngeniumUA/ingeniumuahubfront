import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  public getEvent(eventId: string): Observable<any> {
    return this.httpClient.get("https://ingeniumuahub.ew.r.appspot.com/api/items/event/" + eventId);
  }
}
