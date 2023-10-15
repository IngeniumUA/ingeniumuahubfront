import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {apiEnviroment} from "../../../../../enviroments";

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient: HttpClient) { }

  public register(email: string): any {
    return this.httpClient.post<any>(apiEnviroment.apiEnv['apiUrl'] + "user/signup/mail", {email: email})
  }
}
