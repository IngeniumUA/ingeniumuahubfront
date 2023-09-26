import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  constructor(private httpClient: HttpClient) { }

  public setPassword(uuid: string, pw_settoken: string, plain_password: string): any {
    return this.httpClient.post<any>(apiEnviroment.apiUrl + "user/password/set/" + uuid + "/" + pw_settoken, {plain_password: plain_password})
  }

  public sendPasswordEmail(email: string) {
    return this.httpClient.post<any>(apiEnviroment.apiUrl + "user/password/reset", {email: email})
  }
}
