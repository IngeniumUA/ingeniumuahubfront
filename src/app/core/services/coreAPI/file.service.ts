import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '@ingenium/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediabucketFileService {

  constructor(private httpClient: HttpClient) {
  }

  apiUrl = apiEnviroment.apiUrl + 'file/media';

  public listFileNames(): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}/list`);
  }
}
