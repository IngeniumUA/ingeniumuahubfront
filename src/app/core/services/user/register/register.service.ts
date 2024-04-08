import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiEnviroment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient: HttpClient) { }

  public register(email: string): any {
    return this.httpClient.post<any>(apiEnviroment.apiUrl + 'user/signup/mail', {email: email});
  }
}
