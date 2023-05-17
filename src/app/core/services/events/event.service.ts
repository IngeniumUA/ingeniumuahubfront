import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  public getEventPreview(eventId: string): Observable<any> {
    return this.httpClient.get("http://127.0.0.1:8000/api/items/event/d31ad8ef-c5b2-490d-bada-0def1c4065a5");
  }
}
